import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectGame, ALL_GAMES, headlineMetricFor } from './catalog.ts';

test('recognises COD Mobile from its package name', () => {
  const g = detectGame('com.activision.callofduty.shooter');
  assert.ok(g);
  assert.equal(g?.id, 'cod-mobile');
});

test('recognises eFootball from its package name', () => {
  const g = detectGame('jp.konami.pesam');
  assert.ok(g);
  assert.equal(g?.id, 'efootball');
});

test('unknown package returns null, never a fake game', () => {
  assert.equal(detectGame('com.example.weather'), null);
});

test('every catalog entry has an id, label and headline metric', () => {
  for (const g of ALL_GAMES) {
    assert.ok(g.id.length > 0);
    assert.ok(g.label.length > 0);
    assert.ok(['ping', 'strength'].includes(g.headline));
  }
});

test('COD headline metric is estimated ping', () => {
  const g = detectGame('com.activision.callofduty.shooter');
  assert.equal(headlineMetricFor(g!), 'ping');
});

test('eFootball headline metric is network strength', () => {
  const g = detectGame('jp.konami.pesam');
  assert.equal(headlineMetricFor(g!), 'strength');
});

test('package names are unique across the catalog', () => {
  const pkgs = ALL_GAMES.flatMap((g) => g.packages);
  assert.equal(new Set(pkgs).size, pkgs.length);
});
