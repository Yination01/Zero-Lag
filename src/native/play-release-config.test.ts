import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();

function readJson(relativePath: string) {
  return JSON.parse(readFileSync(join(projectRoot, relativePath), 'utf8'));
}

test('production Android config explicitly targets the current Google Play API requirement', () => {
  const app = readJson('app.json').expo;
  const plugins = app.plugins ?? [];
  const buildProperties = plugins.find((entry: unknown) => Array.isArray(entry) && entry[0] === 'expo-build-properties');

  assert.ok(buildProperties, 'expo-build-properties must declare the Android API contract.');
  assert.deepEqual((buildProperties as [string, { android?: unknown }])[1]?.android, {
    compileSdkVersion: 36,
    targetSdkVersion: 36,
    buildToolsVersion: '36.0.0',
  });
});

test('local native libraries inherit the Android API contract and retain an API 36 fallback', () => {
  const nativeGradleFiles = [
    'plugins/zerolag-device/android/build.gradle',
    'plugins/zerolag-hud/android/build.gradle',
    'plugins/zerolag-net/android/build.gradle',
  ];

  for (const relativePath of nativeGradleFiles) {
    const gradle = readFileSync(join(projectRoot, relativePath), 'utf8');
    assert.match(gradle, /compileSdkVersion\s+safeExtGet\('compileSdkVersion',\s*36\)/);
    assert.match(gradle, /targetSdkVersion\s+safeExtGet\('targetSdkVersion',\s*36\)/);
  }
});

test('production profile outputs an Android App Bundle instead of an installable preview APK', () => {
  const eas = readJson('eas.json');

  assert.equal(eas.build?.production?.android?.buildType, 'app-bundle');
});
