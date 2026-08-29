import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addResult, sessionSummary, type StoredResult } from './history.ts';

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

test('best ping is the lowest non-null average', () => {
  const list: StoredResult[] = [
    { id: 'a', at: 1, game: 'COD', avgPingMs: 90, jitterMs: 20, lossPercent: 5, verdict: 'risky' },
    { id: 'b', at: 2, game: 'COD', avgPingMs: 40, jitterMs: 8, lossPercent: 0, verdict: 'match-ready' },
  ];
  assert.equal(sessionSummary(list).bestPingMs, 40);
  assert.equal(sessionSummary(list).games, 2);
});

test('history stores equally for guest and account (no guest lockout)', () => {
  const list = addResult([], { id: 'a', at: 1, game: 'COD', avgPingMs: 60, jitterMs: 10, lossPercent: 0, verdict: 'match-ready' });
  assert.equal(list.length, 1);
});
