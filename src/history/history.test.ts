import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addResult,
  createStoredResult,
  hasEdgeResponse,
  MAX_ENTRIES,
  sanitizeHistory,
  sessionSummary,
  type StoredResult,
} from './history.ts';

test('an empty history says no games yet', () => {
  assert.equal(sessionSummary([]).games, 0);
  assert.equal(sessionSummary([]).bestPingMs, null);
});

test('adds a result and keeps newest first', () => {
  const a: StoredResult = { id: 'a', at: 1, game: 'COD', avgPingMs: 90, jitterMs: 20, lossPercent: 0, verdict: 'playable' };
  const b: StoredResult = { id: 'b', at: 2, game: 'eFootball', avgPingMs: 40, jitterMs: 8, lossPercent: 0, verdict: 'match-ready' };
  const list = addResult(addResult([], a), b);
  assert.equal(list[0].id, 'b');
});

test('history stays newest-first even when an older completion arrives later', () => {
  const older: StoredResult = { id: 'older', at: 1, game: 'Network check', avgPingMs: 80, jitterMs: 12, lossPercent: 0, verdict: 'playable' };
  const newer: StoredResult = { id: 'newer', at: 2, game: 'Network check', avgPingMs: 50, jitterMs: 8, lossPercent: 0, verdict: 'match-ready' };

  const list = addResult([newer], older);

  assert.deepEqual(list.map((item) => item.id), ['newer', 'older']);
});

test('a loaded local history is repaired to newest-first order', () => {
  const older: StoredResult = { id: 'older', at: 1, game: 'Network check', avgPingMs: 80, jitterMs: 12, lossPercent: 0, verdict: 'playable' };
  const newer: StoredResult = { id: 'newer', at: 2, game: 'Network check', avgPingMs: 50, jitterMs: 8, lossPercent: 0, verdict: 'match-ready' };

  const cleaned = sanitizeHistory([older, newer]);

  assert.deepEqual(cleaned.map((item) => item.id), ['newer', 'older']);
});

test('best edge estimate is the lowest responding average', () => {
  const list: StoredResult[] = [
    { id: 'a', at: 1, game: 'COD', avgPingMs: 90, jitterMs: 20, lossPercent: 5, verdict: 'risky' },
    { id: 'b', at: 2, game: 'COD', avgPingMs: 40, jitterMs: 8, lossPercent: 0, verdict: 'match-ready' },
  ];
  assert.equal(sessionSummary(list).bestPingMs, 40);
  assert.equal(sessionSummary(list).games, 2);
});

test('the summary uses the no-connection verdict, not zero alone, as the no-response sentinel', () => {
  const list: StoredResult[] = [
    { id: 'offline', at: 1, game: 'Network check', avgPingMs: 0, jitterMs: 0, lossPercent: 100, verdict: 'no-connection' },
    { id: 'fast', at: 2, game: 'Network check', avgPingMs: 0, jitterMs: 0, lossPercent: 0, verdict: 'match-ready' },
    { id: 'normal', at: 3, game: 'Network check', avgPingMs: 40, jitterMs: 4, lossPercent: 0, verdict: 'match-ready' },
  ];

  assert.equal(sessionSummary(list).bestPingMs, 0);
  assert.equal(hasEdgeResponse(list[0]), false);
  assert.equal(hasEdgeResponse(list[1]), true);
});

test('an unrestricted local guest session can save a readiness result', () => {
  const list = addResult([], { id: 'a', at: 1, game: 'COD', avgPingMs: 60, jitterMs: 10, lossPercent: 0, verdict: 'match-ready' });
  assert.equal(list.length, 1);
});

test('a completed readiness result becomes a local history record with the measured values', () => {
  const record = createStoredResult(
    { avgPingMs: 67, jitterMs: 11, lossPercent: 0, samples: 8, verdict: 'match-ready' },
    'Call of Duty Mobile',
    { at: 1234, id: 'ready-1' },
  );

  assert.deepEqual(record, {
    id: 'ready-1',
    at: 1234,
    game: 'Call of Duty Mobile',
    avgPingMs: 67,
    jitterMs: 11,
    lossPercent: 0,
    verdict: 'match-ready',
  });
});

test('a missing game context is stored as a generic network check, not fabricated as a game', () => {
  const record = createStoredResult(
    { avgPingMs: 0, jitterMs: 0, lossPercent: 100, samples: 5, verdict: 'no-connection' },
    null,
    { at: 1234, id: 'offline-1' },
  );

  assert.equal(record.game, 'Network check');
  assert.equal(record.verdict, 'no-connection');
});

test('stored history fails closed for malformed records, duplicate ids, and an unbounded payload', () => {
  const valid: StoredResult = {
    id: 'valid', at: MAX_ENTRIES + 10, game: 'Network check', avgPingMs: 70, jitterMs: 12, lossPercent: 0, verdict: 'playable',
  };
  const malformed = { ...valid, id: '', lossPercent: 101 };
  const duplicate = { ...valid, at: MAX_ENTRIES + 11 };
  const oversized = Array.from({ length: MAX_ENTRIES + 3 }, (_, index) => ({
    ...valid,
    id: `entry-${index}`,
    at: index + 1,
  }));

  const cleaned = sanitizeHistory([valid, malformed, duplicate, ...oversized]);

  assert.equal(cleaned.length, MAX_ENTRIES);
  assert.deepEqual(cleaned[0], valid);
  assert.equal(cleaned.filter((item) => item.id === 'valid').length, 1);
  assert.ok(cleaned.every((item) => item.lossPercent >= 0 && item.lossPercent <= 100));
});

test('a non-list history payload becomes an empty safe history', () => {
  assert.deepEqual(sanitizeHistory({ results: [] }), []);
});
