import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarizeRuntimePermissionResults } from './runtime.ts';

test('runtime permission feedback only reports complete access when every requested permission is granted', () => {
  const summary = summarizeRuntimePermissionResults(['granted', 'granted', 'granted']);

  assert.deepEqual(summary, { requested: 3, granted: 3, denied: 0, complete: true });
});

test('a denied or permanently denied permission is reported as partial, not silently treated as access', () => {
  const summary = summarizeRuntimePermissionResults(['granted', 'denied', 'never_ask_again']);

  assert.equal(summary.requested, 3);
  assert.equal(summary.granted, 1);
  assert.equal(summary.denied, 2);
  assert.equal(summary.complete, false);
});

test('no available runtime prompt does not claim that permissions were granted', () => {
  const summary = summarizeRuntimePermissionResults([]);

  assert.equal(summary.requested, 0);
  assert.equal(summary.granted, 0);
  assert.equal(summary.complete, false);
});
