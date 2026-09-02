import assert from 'node:assert/strict';
import test from 'node:test';
import { PRIMARY_TABS, isPrimaryTab } from './navigation.ts';

test('the full on-device history is a primary destination', () => {
  assert.deepEqual(PRIMARY_TABS.map((tab) => tab.id), ['home', 'game', 'boost', 'history', 'device']);
  assert.equal(isPrimaryTab('history'), true);
});

test('unknown route ids cannot be treated as primary tabs', () => {
  assert.equal(isPrimaryTab('account'), false);
  assert.equal(isPrimaryTab('settings'), false);
});
