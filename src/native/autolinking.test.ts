import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();

const nativePackages = [
  {
    name: '@zerolag/net',
    packageClass: 'com.yination01.zerolag.net.ZeroLagNetPackage',
  },
  {
    name: '@zerolag/device',
    packageClass: 'com.yination01.zerolag.device.ZeroLagDevicePackage',
  },
  {
    name: '@zerolag/hud',
    packageClass: 'com.yination01.zerolag.hud.ZeroLagHudPackage',
  },
];

function reactNativeConfig() {
  const cli = join(projectRoot, 'node_modules', 'react-native', 'cli.js');
  const output = execFileSync(process.execPath, [cli, 'config'], {
    cwd: projectRoot,
    encoding: 'utf8',
  });
  return JSON.parse(output);
}

test('Zero-Lag native packages are discovered by React Native autolinking', () => {
  const config = reactNativeConfig();

  for (const expected of nativePackages) {
    const android = config.dependencies[expected.name]?.platforms?.android;
    assert.ok(android, `${expected.name} must expose an Android native module`);
    assert.ok(existsSync(join(android.sourceDir, 'build.gradle')), `${expected.name} must expose an Android library`);
    assert.equal(android.packageImportPath, `import ${expected.packageClass};`);
    assert.equal(android.packageInstance, `new ${expected.packageClass.split('.').pop()}()`);
  }
});

test('app config leaves native package registration to autolinking', () => {
  const appConfig = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf8'));
  const plugins = appConfig.expo.plugins || [];

  assert.ok(!plugins.includes('./plugins/withNativePackages.js'));
});
