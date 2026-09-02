import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

type RasterExpectation = {
  path: string;
  width: number;
  height: number;
};

function readPngSize(relativePath: string) {
  const image = readFileSync(join(projectRoot, relativePath));
  assert.deepEqual(image.subarray(0, PNG_SIGNATURE.length), PNG_SIGNATURE, `${relativePath} must be a PNG.`);
  assert.equal(image.toString('ascii', 12, 16), 'IHDR', `${relativePath} must start with a PNG IHDR chunk.`);
  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
    bytes: image.byteLength,
  };
}

test('Expo config binds the Zero-Lag brand mark to the launcher and splash', () => {
  const appConfig = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf8'));
  const expo = appConfig.expo;

  assert.equal(expo.icon, './assets/zero-lag-icon.png');
  assert.equal(expo.splash?.image, './assets/zero-lag-splash.png');
  assert.equal(expo.splash?.resizeMode, 'contain');
  assert.equal(expo.splash?.backgroundColor, '#0A0F14');
  assert.equal(expo.android?.adaptiveIcon?.foregroundImage, './assets/zero-lag-adaptive-foreground.png');
  assert.equal(expo.android?.adaptiveIcon?.backgroundColor, '#0A0F14');
});

test('launcher, adaptive foreground, and splash mark are full-resolution non-placeholder PNG assets', () => {
  const expected: RasterExpectation[] = [
    { path: 'assets/zero-lag-icon.png', width: 1024, height: 1024 },
    { path: 'assets/zero-lag-adaptive-foreground.png', width: 1024, height: 1024 },
    { path: 'assets/zero-lag-splash.png', width: 1024, height: 1024 },
  ];

  for (const asset of expected) {
    const image = readPngSize(asset.path);
    assert.equal(image.width, asset.width, `${asset.path} has the expected width.`);
    assert.equal(image.height, asset.height, `${asset.path} has the expected height.`);
    assert.ok(image.bytes > 4096, `${asset.path} must contain real artwork, not a placeholder pixel.`);
    assert.equal(statSync(join(projectRoot, asset.path)).isFile(), true);
  }
});
