import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeReadiness, signalQualityLabel, verdictLabel } from './readiness.ts';

test('all fast, stable samples return MATCH READY', () => {
  const r = computeReadiness([40, 42, 39, 41, 44]);
  assert.equal(r.verdict, 'match-ready');
  assert.equal(r.lossPercent, 0);
  assert.ok(r.avgPingMs < 80, 'avg ping under 80');
  assert.ok(r.jitterMs < 15, 'jitter under 15');
});

test('zero samples or all failed probes return NO CONNECTION at 100 percent failed probes', () => {
  assert.equal(computeReadiness([]).verdict, 'no-connection');
  const r = computeReadiness([null, null, null]);
  assert.equal(r.verdict, 'no-connection');
  assert.equal(r.lossPercent, 100);
});

test('jitter is the mean absolute gap between consecutive samples', () => {
  // gaps: |20-50|=30, |50-30|=20, |30-60|=30 -> mean 80/3 = 27 (rounded)
  const r = computeReadiness([20, 50, 30, 60]);
  assert.equal(r.jitterMs, 27);
});

test('failed-probe percent is failed probes over total, rounded', () => {
  // 2 failed probes of 8 = 25 percent
  const r = computeReadiness([50, null, 55, null, 60, 52, 58, 54]);
  assert.equal(r.lossPercent, 25);
});

test('slightly slow but stable connection is PLAYABLE', () => {
  // avg around 100, low jitter, no failed probes
  const r = computeReadiness([100, 102, 99, 101, 103]);
  assert.equal(r.verdict, 'playable');
});

test('slow or choppy connection is RISKY', () => {
  const slow = computeReadiness([220, 240, 210, 260]);
  assert.equal(slow.verdict, 'risky');
  const choppy = computeReadiness([40, 140, 45, 150, 42]);
  assert.equal(choppy.verdict, 'risky');
});

test('average ping is rounded, not floored', () => {
  const r = computeReadiness([33, 34, 35]);
  assert.equal(r.avgPingMs, 34);
});

test('verdictLabel maps every verdict to a user facing phrase', () => {
  for (const v of ['match-ready', 'playable', 'risky', 'no-connection'] as const) {
    const phrase = verdictLabel(v);
    assert.ok(typeof phrase === 'string' && phrase.length > 0);
  }
});

test('signal quality label buckets dBm honestly', () => {
  assert.equal(signalQualityLabel(-75), 'excellent');
  assert.equal(signalQualityLabel(-88), 'good');
  assert.equal(signalQualityLabel(-105), 'fair');
  assert.equal(signalQualityLabel(-115), 'weak');
  assert.equal(signalQualityLabel(-125), 'very weak');
});
