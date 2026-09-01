import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as probe from './probe.ts';
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

test('a rejected request is a failed probe (null), not a throw', async () => {
  const rtt = await probeOnce({
    request: () => Promise.reject(new Error('down')),
    targets: [{ host: 'x', url: 'x' }],
    timeoutMs: 500,
  });
  assert.equal(rtt, null);
});

test('a slow request times out and counts as a failed probe', async () => {
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

test('end to end: all failed probes give no-connection', async () => {
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

test('probe requests add a fresh cache-busting value before URL fragments', () => {
  const buildProbeUrl = (probe as { buildProbeUrl?: (url: string, nonce: number) => string }).buildProbeUrl;
  assert.equal(typeof buildProbeUrl, 'function');

  const url = buildProbeUrl!('https://edge.example/test?mode=fast#section', 42);

  assert.equal(url, 'https://edge.example/test?mode=fast&zl_probe=42#section');
});

test('network analysis explicitly distinguishes an edge estimate from game-server ping', () => {
  const guidance = (probe as {
    NETWORK_ANALYSIS_GUIDANCE?: {
      targetScope?: unknown;
      reportsExactGameServerPing?: unknown;
      failedProbesArePacketLoss?: unknown;
      recommendedUse?: unknown;
    };
  }).NETWORK_ANALYSIS_GUIDANCE;

  assert.equal(guidance?.targetScope, 'regional-anycast-edges');
  assert.equal(guidance?.reportsExactGameServerPing, false);
  assert.equal(guidance?.failedProbesArePacketLoss, false);
  assert.ok(Array.isArray(guidance?.recommendedUse) && guidance.recommendedUse.length >= 2);
});
