import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRunGate } from './runGate.ts';

test('a run gate accepts one active operation and rejects duplicate starts', () => {
  const gate = createRunGate();

  assert.equal(gate.isBusy(), false);
  assert.equal(gate.tryAcquire(), true);
  assert.equal(gate.isBusy(), true);
  assert.equal(gate.tryAcquire(), false);
});

test('a released run gate accepts a later operation', () => {
  const gate = createRunGate();

  assert.equal(gate.tryAcquire(), true);
  gate.release();
  assert.equal(gate.isBusy(), false);
  assert.equal(gate.tryAcquire(), true);
});
