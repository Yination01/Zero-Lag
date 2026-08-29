import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createDeviceFactsReader,
  createForegroundGamePackageReader,
  createHudController,
} from './bridges.ts';

test('device bridge returns native facts only when they are usable', async () => {
  const read = createDeviceFactsReader(
    {
      getFacts: async () => ({ ramMb: 8192, cores: 8, model: 'Test device' }),
    },
    'android',
  );

  assert.deepEqual(await read(), { ramMb: 8192, cores: 8, model: 'Test device' });
});

test('device bridge keeps unknown or malformed facts conservative', async () => {
  const read = createDeviceFactsReader(
    {
      getFacts: async () => ({ ramMb: '8192', cores: -1, model: '' }),
    },
    'android',
  );

  const facts = await read();
  assert.equal(facts.ramMb, null);
  assert.equal(facts.cores, null);
  assert.ok(facts.model.length > 0);
});

test('game detection reports missing or denied access instead of inventing a game', async () => {
  const denied = createForegroundGamePackageReader({
    getForegroundPackage: async () => 'PERMISSION_DENIED',
  });
  const unavailable = createForegroundGamePackageReader(null);

  assert.deepEqual(await denied(), { packageName: null, needsPermission: true });
  assert.deepEqual(await unavailable(), { packageName: null, needsPermission: true });
});

test('game detection returns a valid foreground package when native access is granted', async () => {
  const read = createForegroundGamePackageReader({
    getForegroundPackage: async () => 'com.example.game',
  });

  assert.deepEqual(await read(), { packageName: 'com.example.game', needsPermission: false });
});

test('HUD bridge only exposes available Android native controls', async () => {
  let starts = 0;
  let stops = 0;
  const hud = createHudController(
    {
      canDrawOverlays: async () => true,
      start: async () => { starts += 1; },
      stop: async () => { stops += 1; },
    },
    'android',
  );
  const unsupported = createHudController(null, 'android');

  assert.equal(hud.isSupported(), true);
  assert.equal(unsupported.isSupported(), false);
  assert.equal(await hud.canDrawOverlays(), true);
  await hud.start();
  await hud.stop();
  assert.equal(starts, 1);
  assert.equal(stops, 1);
});
