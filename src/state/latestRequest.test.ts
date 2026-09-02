import assert from 'node:assert/strict';
import test from 'node:test';
import { createLatestRequest } from './latestRequest.ts';

test('only the latest asynchronous request may publish a HUD status', () => {
  const requests = createLatestRequest();
  const initialCheck = requests.begin();
  const resumedCheck = requests.begin();

  assert.equal(requests.isCurrent(initialCheck), false);
  assert.equal(requests.isCurrent(resumedCheck), true);
});

test('a confirmed toggle invalidates an older in-flight status check', () => {
  const requests = createLatestRequest();
  const oldCheck = requests.begin();
  requests.invalidate();

  assert.equal(requests.isCurrent(oldCheck), false);
});
