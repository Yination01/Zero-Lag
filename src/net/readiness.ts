// Pure readiness math. No device, no network. Fully unit tested.
// Thresholds are ported from docs/kotlin-reference net/ReadinessChecker.kt.

export type Verdict = 'match-ready' | 'playable' | 'risky' | 'no-connection';

// One public-edge RTT sample in milliseconds, or null when that probe fails.
export type RttSample = number | null;

export interface ReadinessResult {
  avgPingMs: number;
  jitterMs: number;
  // Kept as a stable data field; it is the percentage of failed HTTP probes,
  // not measured UDP packet loss inside a game.
  lossPercent: number;
  samples: number;
  verdict: Verdict;
}

const MATCH_AVG_MAX = 80;
const MATCH_JITTER_MAX = 15;
const PLAYABLE_AVG_MAX = 130;
const PLAYABLE_JITTER_MAX = 35;
const PLAYABLE_FAILED_PROBE_MAX = 10;

export function computeReadiness(samples: RttSample[]): ReadinessResult {
  const total = samples.length;
  const rtts = samples.filter((s): s is number => s !== null);

  if (rtts.length === 0) {
    return { avgPingMs: 0, jitterMs: 0, lossPercent: total ? 100 : 100, samples: total, verdict: 'no-connection' };
  }

  const avgPingMs = Math.round(rtts.reduce((a, b) => a + b, 0) / rtts.length);

  let jitterMs = 0;
  if (rtts.length > 1) {
    let gapSum = 0;
    for (let i = 1; i < rtts.length; i++) gapSum += Math.abs(rtts[i] - rtts[i - 1]);
    jitterMs = Math.round(gapSum / (rtts.length - 1));
  }

  const failedProbePercent = Math.round(((total - rtts.length) * 100) / total);

  let verdict: Verdict;
  if (avgPingMs < MATCH_AVG_MAX && jitterMs < MATCH_JITTER_MAX && failedProbePercent === 0) {
    verdict = 'match-ready';
  } else if (avgPingMs < PLAYABLE_AVG_MAX && jitterMs < PLAYABLE_JITTER_MAX && failedProbePercent <= PLAYABLE_FAILED_PROBE_MAX) {
    verdict = 'playable';
  } else {
    verdict = 'risky';
  }

  return { avgPingMs, jitterMs, lossPercent: failedProbePercent, samples: total, verdict };
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case 'match-ready':
      return 'Match-ready estimate: reasonable to queue';
    case 'playable':
      return 'Playable estimate: some lag risk';
    case 'risky':
      return 'Risky estimate: high edge delay or instability';
    case 'no-connection':
      return 'No connection';
  }
}

// RSRP / RSSI buckets in dBm. Closer to zero is stronger.
export function signalQualityLabel(dbm: number): string {
  if (dbm >= -80) return 'excellent';
  if (dbm >= -95) return 'good';
  if (dbm >= -110) return 'fair';
  if (dbm >= -120) return 'weak';
  return 'very weak';
}
