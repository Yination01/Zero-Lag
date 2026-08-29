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

// One sample. Returns null RTT on any failure, that is a loss event.
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

// Real request adapter for React Native.
export const rnRequest = (url: string) => fetch(url, { method: 'HEAD' });
