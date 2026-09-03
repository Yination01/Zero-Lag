import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

type ImageExpectation = {
  path: string;
  width: number;
  height: number;
};

function pngMetadata(relativePath: string) {
  const image = readFileSync(join(projectRoot, relativePath));
  assert.deepEqual(image.subarray(0, pngSignature.length), pngSignature, `${relativePath} must be a PNG.`);
  assert.equal(image.toString('ascii', 12, 16), 'IHDR', `${relativePath} must contain a PNG IHDR chunk.`);
  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
    bytes: image.byteLength,
    colorType: image.readUInt8(25),
  };
}

test('Google Play listing artwork has the required icon and feature-graphic dimensions', () => {
  const expected: ImageExpectation[] = [
    { path: 'assets/play-store/zero-lag-play-icon.png', width: 512, height: 512 },
    { path: 'assets/play-store/zero-lag-feature-graphic.png', width: 1024, height: 500 },
  ];

  for (const asset of expected) {
    const image = pngMetadata(asset.path);
    assert.equal(image.width, asset.width, `${asset.path} has the required width.`);
    assert.equal(image.height, asset.height, `${asset.path} has the required height.`);
    assert.ok(image.bytes > 4096, `${asset.path} must contain non-placeholder artwork.`);
    assert.equal(image.colorType, 2, `${asset.path} must retain an opaque RGB background.`);
  }
});
