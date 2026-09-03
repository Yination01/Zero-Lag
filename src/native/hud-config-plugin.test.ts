import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();
const require = createRequire(import.meta.url);
const withZeroLagHud = require(join(projectRoot, 'plugins', 'zerolag-hud', 'withZeroLagHud.js'));

const serviceName = 'com.yination01.zerolag.hud.PingOverlayService';
const requiredPermissions = [
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
  'android.permission.POST_NOTIFICATIONS',
];

type AndroidNode = {
  $?: Record<string, string>;
  service?: AndroidNode[];
  property?: AndroidNode[];
};

type AndroidManifest = {
  manifest: {
    application: AndroidNode[];
    'uses-permission'?: AndroidNode[];
  };
};

function newManifest(): AndroidManifest {
  return {
    manifest: {
      application: [{ $: { 'android:name': '.MainApplication' } }],
      'uses-permission': [{ $: { 'android:name': 'android.permission.ACCESS_NETWORK_STATE' } }],
    },
  };
}

async function applyHudPlugin(modResults: AndroidManifest): Promise<AndroidManifest> {
  const config = withZeroLagHud({});
  const manifestMod = config.mods?.android?.manifest;
  assert.equal(typeof manifestMod, 'function');

  const result = await manifestMod({
    modResults,
    modRequest: { platform: 'android', modName: 'manifest' },
  });
  return result.modResults;
}

test('HUD config plugin transforms the nested Android manifest and is idempotent', async () => {
  const modResults = newManifest();
  assert.equal(await applyHudPlugin(modResults), modResults);
  assert.equal(await applyHudPlugin(modResults), modResults);

  const manifest = modResults.manifest;
  const app = manifest.application[0];
  const services = app.service || [];
  const pingServices = services.filter((service) => service.$?.['android:name'] === serviceName);

  assert.equal(pingServices.length, 1);
  assert.equal(pingServices[0].$?.['android:foregroundServiceType'], 'specialUse');
  assert.equal(
    pingServices[0].property?.[0].$?.['android:name'],
    'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE',
  );

  const permissionNames = (manifest['uses-permission'] || []).map(
    (permission) => permission.$?.['android:name'],
  );
  for (const permission of requiredPermissions) {
    assert.equal(permissionNames.filter((name) => name === permission).length, 1);
  }
});

test('app configuration carries no unreviewed architecture override', () => {
  const appConfig = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf8'));
  assert.equal(Object.hasOwn(appConfig.expo, 'newArchEnabled'), false);
});
