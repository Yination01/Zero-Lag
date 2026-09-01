// RTT probe and network adapters. The timing logic is pure and testable;
// the platform bits (fetch, linking) are injected so unit tests need no
// React Native runtime.

import type { RttSample } from './readiness.ts';

export interface RttTarget {
  host: string;
  url: string;
}

// Anycast edges land on the nearest regional node. HTTPS gives a real
// handshake round trip without root or raw sockets.
export const DEFAULT_TARGETS: RttTarget[] = [
  { host: 'cloudflare', url: 'https://1.1.1.1/cdn-cgi/trace' },
  { host: 'google', url: 'https://8.8.8.8/generate_204' },
];

// This is deliberately a connection-quality estimate, not a claim to know a
// game's private server route. Failed HTTP probes are useful reliability
// signals, but they are not the same as UDP packet loss inside a game.
export const NETWORK_ANALYSIS_GUIDANCE = {
  targetScope: 'regional-anycast-edges',
  reportsExactGameServerPing: false,
  failedProbesArePacketLoss: false,
  method:
    'Short HTTP requests measure round-trip time to nearby public network edges. This is a regional pre-match connection-quality estimate, most useful for comparing connections in the same place.',
  limitation:
    'It cannot read a game server route, exact in-game ping, frame rate, or UDP packet loss.',
  recommendedUse: [
    'Run the test twice where you normally play, just before matchmaking.',
    'Compare Wi-Fi and mobile data, then use the connection with the steadier result.',
    'Retest after moving rooms, changing networks, or seeing a large result change.',
  ],
} as const;

export interface ProbeDeps {
  // Resolves when the edge responds, rejects on timeout/network error.
  request: (url: string) => Promise<unknown>;
  targets?: RttTarget[];
  timeoutMs?: number;
}

export function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

// One sample. Returns null RTT when the HTTP edge check fails or times out.
export async function probeOnce(deps: ProbeDeps): Promise<RttSample> {
  const targets = deps.targets ?? DEFAULT_TARGETS;
  const target = targets[Math.floor(Math.random() * targets.length)];
  const start = Date.now();
  try {
    await withTimeout(deps.request(target.url), deps.timeoutMs ?? 3000);
    return Date.now() - start;
  } catch {
    return null;
  }
}

export async function probeSeries(deps: ProbeDeps, count = 8, gapMs = 250): Promise<RttSample[]> {
  const out: RttSample[] = [];
  for (let i = 0; i < count; i++) {
    out.push(await probeOnce(deps));
    if (i < count - 1) await new Promise((r) => setTimeout(r, gapMs));
  }
  return out;
}

export function buildProbeUrl(url: string, nonce: number = Date.now()): string {
  const hashIndex = url.indexOf('#');
  const base = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const fragment = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}zl_probe=${encodeURIComponent(String(nonce))}${fragment}`;
}

// Real request adapter for React Native. The fresh query and no-cache headers
// prevent a cached edge response from being mistaken for a live measurement.
export const rnRequest = (url: string) =>
  fetch(buildProbeUrl(url), {
    method: 'HEAD',
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
