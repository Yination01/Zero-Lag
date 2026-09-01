import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const hudServicePath = join(
  process.cwd(),
  'plugins',
  'zerolag-hud',
  'android',
  'src',
  'main',
  'java',
  'com',
  'yination01',
  'zerolag',
  'hud',
  'PingOverlayService.kt',
);

test('the floating HUD is non-touchable so it cannot eat game taps', () => {
  const source = readFileSync(hudServicePath, 'utf8');

  assert.match(source, /FLAG_NOT_FOCUSABLE\s+or\s+WindowManager\.LayoutParams\.FLAG_NOT_TOUCHABLE/);
  assert.doesNotMatch(source, /FLAG_NOT_TOUCH_MODAL/);
});
