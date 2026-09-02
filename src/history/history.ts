// Local readiness history for the unrestricted local guest session. It remains
// on-device; Zero-Lag has no account service or cloud history.

import type { ReadinessResult } from '../net/readiness.ts';

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

export interface StoredResultOptions {
  at?: number;
  id?: string;
}

// Newest first, capped so a daily user cannot grow the store unbounded.
export const MAX_ENTRIES = 500;
export const NETWORK_CHECK_LABEL = 'Network check';

const MAX_GAME_LABEL_LENGTH = 80;
const MAX_MEASUREMENT_MS = 60_000;
const VALID_VERDICTS: ReadonlySet<StoredVerdict> = new Set([
  'match-ready',
  'playable',
  'risky',
  'no-connection',
]);
let generatedIdSequence = 0;

function isNonBlankString(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isPositiveWhole(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function isMeasurement(value: unknown, maximum = MAX_MEASUREMENT_MS): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= maximum;
}

function isStoredVerdict(value: unknown): value is StoredVerdict {
  return typeof value === 'string' && VALID_VERDICTS.has(value as StoredVerdict);
}

function validGameLabel(value: string | null | undefined): string {
  if (!isNonBlankString(value, MAX_GAME_LABEL_LENGTH)) return NETWORK_CHECK_LABEL;
  return value.trim();
}

function boundedMeasurement(value: number, maximum = MAX_MEASUREMENT_MS): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(maximum, Math.max(0, Math.round(value)));
}

function validStoredResult(value: unknown): StoredResult | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (
    !isNonBlankString(item.id, 120)
    || !isPositiveWhole(item.at)
    || !isNonBlankString(item.game, MAX_GAME_LABEL_LENGTH)
    || !isMeasurement(item.avgPingMs)
    || !isMeasurement(item.jitterMs)
    || !isMeasurement(item.lossPercent, 100)
    || !isStoredVerdict(item.verdict)
  ) {
    return null;
  }

  return {
    id: item.id.trim(),
    at: item.at,
    game: item.game.trim(),
    avgPingMs: item.avgPingMs,
    jitterMs: item.jitterMs,
    lossPercent: item.lossPercent,
    verdict: item.verdict,
  };
}

function generatedId(at: number): string {
  generatedIdSequence += 1;
  return `readiness-${at}-${generatedIdSequence}`;
}

// Convert only a completed local measurement into a persistable record. A
// missing game label stays honest, it is a generic network check rather than
// an invented detected game.
export function createStoredResult(
  result: ReadinessResult,
  game: string | null | undefined,
  options: StoredResultOptions = {},
): StoredResult {
  const at = isPositiveWhole(options.at) ? options.at : Date.now();
  const verdict = isStoredVerdict(result.verdict) ? result.verdict : 'no-connection';
  const suppliedId = isNonBlankString(options.id, 120) ? options.id.trim() : generatedId(at);

  return {
    id: suppliedId,
    at,
    game: validGameLabel(game),
    avgPingMs: boundedMeasurement(result.avgPingMs),
    jitterMs: boundedMeasurement(result.jitterMs),
    lossPercent: boundedMeasurement(result.lossPercent, 100),
    verdict,
  };
}

// Treat persistence as an untrusted boundary. Invalid records are dropped and
// duplicates are ignored so a damaged local payload cannot poison the summary.
export function sanitizeHistory(value: unknown): StoredResult[] {
  if (!Array.isArray(value)) return [];

  const ids = new Set<string>();
  const cleaned: StoredResult[] = [];
  for (const candidate of value) {
    const item = validStoredResult(candidate);
    if (!item || ids.has(item.id)) continue;
    ids.add(item.id);
    cleaned.push(item);
    if (cleaned.length === MAX_ENTRIES) break;
  }
  return cleaned.sort((left, right) => right.at - left.at);
}

export function addResult(history: StoredResult[], result: StoredResult): StoredResult[] {
  return [result, ...history.filter((item) => item.id !== result.id)]
    .sort((left, right) => right.at - left.at)
    .slice(0, MAX_ENTRIES);
}

// A numeric zero can be a fast measured value. Only the explicit verdict
// represents a failed set of probes with no edge response.
export function hasEdgeResponse(result: Pick<StoredResult, 'verdict'>): boolean {
  return result.verdict !== 'no-connection';
}

export interface Summary {
  games: number;
  bestPingMs: number | null;
  readyCount: number;
}

export function sessionSummary(history: StoredResult[]): Summary {
  const games = history.length;
  const pings = history
    .filter(hasEdgeResponse)
    .map((item) => item.avgPingMs);
  const bestPingMs = pings.length ? Math.min(...pings) : null;
  const readyCount = history.filter((h) => h.verdict === 'match-ready').length;
  return { games, bestPingMs, readyCount };
}
