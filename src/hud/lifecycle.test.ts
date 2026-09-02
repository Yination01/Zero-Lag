import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  inspectHud,
  toggleHud,
  type HudGateway,
} from './lifecycle.ts';

function gateway(overrides: Partial<HudGateway> = {}): HudGateway {
  return {
    isSupported: () => true,
    canDrawOverlays: async () => true,
    isRunning: async () => false,
    start: async () => undefined,
    stop: async () => undefined,
    ...overrides,
  };
}

test('inspection fails closed when the native HUD is unavailable', async () => {
  let checkedPermission = false;
  const status = await inspectHud(gateway({
    isSupported: () => false,
    canDrawOverlays: async () => {
      checkedPermission = true;
      return true;
    },
  }));

  assert.equal(status, 'unavailable');
  assert.equal(checkedPermission, false);
});

test('inspection reports overlay access before claiming the HUD is stopped', async () => {
  const status = await inspectHud(gateway({ canDrawOverlays: async () => false }));

  assert.equal(status, 'needs-overlay-permission');
});

test('a broken native status check is not converted into a false stopped state', async () => {
  const status = await inspectHud(gateway({
    isSupported: () => { throw new Error('native bridge check failed'); },
  }));

  assert.equal(status, 'status-unknown');
});

test('a stopped HUD starts at the chosen interval and waits for native confirmation', async () => {
  const requestedIntervals: number[] = [];
  const runningAnswers = [false, false, true];
  let waits = 0;
  const result = await toggleHud(gateway({
    isRunning: async () => runningAnswers.shift() ?? true,
    start: async (intervalMs) => { requestedIntervals.push(intervalMs ?? -1); },
  }), 1500, {
    attempts: 3,
    wait: async () => { waits += 1; },
  });

  assert.equal(result.action, 'started');
  assert.equal(result.status, 'running');
  assert.deepEqual(requestedIntervals, [1500]);
  assert.equal(waits, 1, 'the first post-start check must not be treated as confirmation');
});

test('a start that never becomes visible is not reported as running', async () => {
  const result = await toggleHud(gateway({ isRunning: async () => false }), 3000, {
    attempts: 2,
    wait: async () => undefined,
  });

  assert.equal(result.action, 'start-unconfirmed');
  assert.notEqual(result.status, 'running');
});

test('a running HUD stops and waits until the native service is gone', async () => {
  let stopCalls = 0;
  const runningAnswers = [true, true, false];
  const result = await toggleHud(gateway({
    isRunning: async () => runningAnswers.shift() ?? false,
    stop: async () => { stopCalls += 1; },
  }), 3000, { attempts: 3, wait: async () => undefined });

  assert.equal(result.action, 'stopped');
  assert.equal(result.status, 'stopped');
  assert.equal(stopCalls, 1);
});

test('a missing overlay permission never calls start', async () => {
  let starts = 0;
  const result = await toggleHud(gateway({
    canDrawOverlays: async () => false,
    start: async () => { starts += 1; },
  }), 3000, { wait: async () => undefined });

  assert.equal(result.action, 'needs-overlay-permission');
  assert.equal(starts, 0);
});

test('native start and stop errors stay explicit and fail closed', async () => {
  const startFailure = await toggleHud(gateway({
    start: async () => { throw new Error('start failed'); },
  }), 3000, { wait: async () => undefined });
  assert.equal(startFailure.action, 'start-failed');
  assert.notEqual(startFailure.status, 'running');

  const stopFailure = await toggleHud(gateway({
    isRunning: async () => true,
    stop: async () => { throw new Error('stop failed'); },
  }), 3000, { wait: async () => undefined });
  assert.equal(stopFailure.action, 'stop-failed');
  assert.equal(stopFailure.status, 'status-unknown');
});
