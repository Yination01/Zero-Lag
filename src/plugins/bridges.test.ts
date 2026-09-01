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

test('game detection does not mistake no recent foreground event for denied Usage Access', async () => {
  const read = createForegroundGamePackageReader({
    getForegroundPackage: async () => 'NO_FOREGROUND_APP',
  });

  assert.deepEqual(await read(), { packageName: null, needsPermission: false });
});

test('HUD bridge only exposes available Android native controls', async () => {
  let starts = 0;
  let stops = 0;
  const hud = createHudController(
    {
      canDrawOverlays: async () => true,
      isRunning: async () => false,
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

test('a partial native module is unsupported instead of promising a broken HUD', () => {
  const partial = createHudController(
    {
      canDrawOverlays: async () => true,
      start: async () => true,
      stop: async () => true,
    },
    'android',
  );

  assert.equal(partial.isSupported(), false);
});

test('HUD bridge forwards the selected refresh interval to native start', async () => {
  const intervals: Array<number | undefined> = [];
  const hud = createHudController(
    {
      canDrawOverlays: async () => true,
      isRunning: async () => false,
      start: async (intervalMs?: number) => { intervals.push(intervalMs); },
      stop: async () => true,
    },
    'android',
  );

  await (hud.start as unknown as (intervalMs: number) => Promise<void>)(1500);

  assert.deepEqual(intervals, [1500]);
});

test('HUD bridge exposes the native overlay-settings launcher when available', async () => {
  let opened = 0;
  const hud = createHudController(
    {
      canDrawOverlays: async () => true,
      isRunning: async () => false,
      start: async () => true,
      stop: async () => true,
      openOverlaySettings: async () => { opened += 1; return true; },
    } as never,
    'android',
  ) as unknown as { openOverlaySettings: () => Promise<boolean> };

  assert.equal(await hud.openOverlaySettings(), true);
  assert.equal(opened, 1);
});

test('HUD bridge reports the actual native service status and fails closed when absent', async () => {
  const running = createHudController(
    {
      canDrawOverlays: async () => true,
      start: async () => true,
      stop: async () => true,
      isRunning: async () => true,
    } as never,
    'android',
  ) as unknown as { isRunning: () => Promise<boolean> };
  const unavailable = createHudController(null, 'android') as unknown as { isRunning: () => Promise<boolean> };

  assert.equal(await running.isRunning(), true);
  assert.equal(await unavailable.isRunning(), false);
});
