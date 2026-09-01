import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();

test('Expo splash config defines the color resource referenced by Android prebuild', () => {
  const appConfig = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf8'));
  const splash = appConfig.expo.splash;

  assert.equal(
    typeof splash?.backgroundColor,
    'string',
    'Expo generates @color/splashscreen_background, so the supported top-level splash.backgroundColor must be explicit.',
  );
  assert.match(splash.backgroundColor, /^#[0-9a-f]{6}$/i);
});
