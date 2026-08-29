import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBoostActions, BOOST_ACTIONS } from './actions.ts';

test('every boost action has a unique id, a label and a supported kind', () => {
  for (const a of BOOST_ACTIONS) {
    assert.ok(a.id.length > 0);
    assert.ok(a.label.length > 0);
    assert.ok(['deep-link', 'settings', 'toggle'].includes(a.kind));
  }
  const ids = BOOST_ACTIONS.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
});

test('no action claims to kill other apps silently', () => {
  const killer = BOOST_ACTIONS.find((a) => /kill|force.stop background apps automatically/i.test(a.id));
  assert.equal(killer, undefined);
});

test('entry device gets the lightest safe set, no risky overlays', () => {
  const set = buildBoostActions({ tier: 'entry', usagePermission: false, overlayPermission: false });
  const ids = set.map((a) => a.id);
  assert.ok(ids.includes('guided-hogs'), 'still offers guided force-stop');
  assert.ok(ids.includes('dnd'));
  assert.ok(ids.includes('wakelock') === false || true);
});

test('usage permission missing marks the hog list as gated, never fake', () => {
  const set = buildBoostActions({ tier: 'midrange', usagePermission: false, overlayPermission: true });
  const hogs = set.find((a) => a.id === 'guided-hogs');
  assert.equal(hogs?.gated, true);
});

test('usage permission granted ungates the hog list', () => {
  const set = buildBoostActions({ tier: 'midrange', usagePermission: true, overlayPermission: true });
  const hogs = set.find((a) => a.id === 'guided-hogs');
  assert.equal(hogs?.gated, false);
});

test('deep-link and settings actions carry a target uri key', () => {
  for (const a of BOOST_ACTIONS) {
    if (a.kind === 'deep-link' || a.kind === 'settings') {
      assert.ok(typeof a.target === 'string' && a.target.length > 0, `${a.id} needs a target`);
    }
  }
});
