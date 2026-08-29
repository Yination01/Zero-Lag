// Local game history. Stored on-device for guests and account users alike.
// Cloud sync is a separate, optional feature and is off until a host exists.

export type StoredVerdict = 'match-ready' | 'playable' | 'risky' | 'no-connection';

export interface StoredResult {
  id: string;
  at: number;
  game: string;
  avgPingMs: number;
  jitterMs: number;
  lossPercent: number;
  verdict: StoredVerdict;
}

// Newest first, capped so a daily user cannot grow the store unbounded.
const MAX_ENTRIES = 500;

export function addResult(history: StoredResult[], result: StoredResult): StoredResult[] {
  return [result, ...history].slice(0, MAX_ENTRIES);
}

export interface Summary {
  games: number;
  bestPingMs: number | null;
  readyCount: number;
}

export function sessionSummary(history: StoredResult[]): Summary {
  const games = history.length;
  const pings = history.map((h) => h.avgPingMs).filter((p) => p > 0);
  const bestPingMs = pings.length ? Math.min(...pings) : null;
  const readyCount = history.filter((h) => h.verdict === 'match-ready').length;
  return { games, bestPingMs, readyCount };
}
