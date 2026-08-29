// Pure readiness math. No device, no network. Fully unit tested.
// Thresholds are ported from docs/kotlin-reference net/ReadinessChecker.kt.

export type Verdict = 'match-ready' | 'playable' | 'risky' | 'no-connection';

// One RTT sample in milliseconds, or null for a lost probe (packet loss).
export type RttSample = number | null;

export interface ReadinessResult {
  avgPingMs: number;
  jitterMs: number;
  lossPercent: number;
  samples: number;
  verdict: Verdict;
}

const MATCH_AVG_MAX = 80;
const MATCH_JITTER_MAX = 15;
const PLAYABLE_AVG_MAX = 130;
const PLAYABLE_JITTER_MAX = 35;
const PLAYABLE_LOSS_MAX = 10;

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

  const lossPercent = Math.round(((total - rtts.length) * 100) / total);

  let verdict: Verdict;
  if (avgPingMs < MATCH_AVG_MAX && jitterMs < MATCH_JITTER_MAX && lossPercent === 0) {
    verdict = 'match-ready';
  } else if (avgPingMs < PLAYABLE_AVG_MAX && jitterMs < PLAYABLE_JITTER_MAX && lossPercent <= PLAYABLE_LOSS_MAX) {
    verdict = 'playable';
  } else {
    verdict = 'risky';
  }

  return { avgPingMs, jitterMs, lossPercent, samples: total, verdict };
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case 'match-ready':
      return 'Match ready, safe to queue';
    case 'playable':
      return 'Playable, some lag risk';
    case 'risky':
      return 'Risky, high lag expected';
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
