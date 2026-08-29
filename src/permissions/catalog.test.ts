import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PERMISSIONS, missingPermissions, allGranted } from './catalog.ts';

test('every permission has a key, label, reason and a valid kind', () => {
  for (const p of PERMISSIONS) {
    assert.ok(p.key.length > 0);
    assert.ok(p.label.length > 0);
    assert.ok(p.why.length > 10, `${p.key} must explain why`);
    assert.ok(['runtime', 'special'].includes(p.kind));
  }
});

test('permission keys are unique', () => {
  const keys = PERMISSIONS.map((p) => p.key);
  assert.equal(new Set(keys).size, keys.length);
});

test('overlay and usage access are special settings, not runtime prompts', () => {
  const overlay = PERMISSIONS.find((p) => p.key === 'overlay');
  const usage = PERMISSIONS.find((p) => p.key === 'usage');
  assert.equal(overlay?.kind, 'special');
  assert.equal(usage?.kind, 'special');
});

test('missingPermissions returns exactly the keys not granted', () => {
  const missing = missingPermissions({ location: true, notifications: false });
  assert.ok(missing.some((p) => p.key === 'notifications'));
  assert.ok(!missing.some((p) => p.key === 'location'));
});

test('allGranted is false until every required permission is granted', () => {
  assert.equal(allGranted({ location: true }), false);
  const full = Object.fromEntries(PERMISSIONS.map((p) => [p.key, true]));
  assert.equal(allGranted(full), true);
});
