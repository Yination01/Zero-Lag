import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const hudServicePath = join(
  process.cwd(),
  'plugins', 'zerolag-hud', 'android', 'src', 'main', 'java',
  'com', 'yination01', 'zerolag', 'hud', 'PingOverlayService.kt',
);

test('the ongoing HUD notification uses the app icon, not an unrelated system feature icon', () => {
  const source = readFileSync(hudServicePath, 'utf8');

  assert.match(source, /\.setSmallIcon\(applicationInfo\.icon\)/);
  assert.doesNotMatch(source, /stat_sys_data_bluetooth/);
});

test('the ongoing HUD notification includes an immutable stop control that stops the service', () => {
  const source = readFileSync(hudServicePath, 'utf8');

  assert.match(source, /PendingIntent\.getService\(/);
  assert.match(source, /setAction\(ACTION_STOP\)/);
  assert.match(source, /PendingIntent\.FLAG_IMMUTABLE/);
  assert.match(source, /intent\?\.action\s*==\s*ACTION_STOP[\s\S]{0,140}stopSelf\(\)/);
  assert.match(source, /\.addAction\(/);
});
