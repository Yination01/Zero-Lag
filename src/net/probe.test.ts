import { test } from 'node:test';
import assert from 'node:assert/strict';
import { probeOnce, probeSeries, withTimeout } from './probe.ts';
import { computeReadiness } from './readiness.ts';

test('a fast resolved request yields a numeric rtt', async () => {
  const rtt = await probeOnce({
    request: () => new Promise((r) => setTimeout(() => r(1), 5)),
    targets: [{ host: 'x', url: 'x' }],
    timeoutMs: 500,
  });
  assert.equal(typeof rtt, 'number');
  assert.ok((rtt as number) >= 0);
});

test('a rejected request is a loss (null), not a throw', async () => {
  const rtt = await probeOnce({
    request: () => Promise.reject(new Error('down')),
    targets: [{ host: 'x', url: 'x' }],
    timeoutMs: 500,
  });
  assert.equal(rtt, null);
});

test('a slow request times out and counts as loss', async () => {
  const rtt = await probeOnce({
    request: () => new Promise((r) => setTimeout(r, 200)),
    targets: [{ host: 'x', url: 'x' }],
    timeoutMs: 30,
  });
  assert.equal(rtt, null);
});

test('probeSeries returns exactly count samples', async () => {
  const out = await probeSeries(
    { request: () => Promise.resolve(1), targets: [{ host: 'x', url: 'x' }], timeoutMs: 500 },
    4,
    1,
  );
  assert.equal(out.length, 4);
  assert.ok(out.every((s) => typeof s === 'number'));
});

test('end to end: all loss gives no-connection', async () => {
  const samples = await probeSeries(
    { request: () => Promise.reject(new Error('x')), targets: [{ host: 'x', url: 'x' }], timeoutMs: 500 },
    3,
    1,
  );
  assert.equal(computeReadiness(samples).verdict, 'no-connection');
});

test('withTimeout rejects after the limit', async () => {
  await assert.rejects(
    withTimeout(new Promise((r) => setTimeout(r, 200)), 20),
    /timeout/,
  );
});
