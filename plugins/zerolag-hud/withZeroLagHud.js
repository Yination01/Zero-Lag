// Expo config plugin for the floating ping HUD. Runs during prebuild and
// injects the overlay service plus its permissions into AndroidManifest.xml.
// android/ is generated, never hand edited, per CLAUDE.md.
const { withAndroidManifest } = require('expo/config-plugins');

const SERVICE_NAME = 'com.yination01.zerolag.hud.PingOverlayService';
const PERMISSIONS = [
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
  'android.permission.POST_NOTIFICATIONS',
];

function addPermission(manifest, name) {
  manifest['uses-permission'] = manifest['uses-permission'] || [];
  const has = manifest['uses-permission'].some((p) => p.$?.['android:name'] === name);
  if (!has) manifest['uses-permission'].push({ $: { 'android:name': name } });
}

function withZeroLagHud(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults;
    const app = manifest.application[0];

    app.service = app.service || [];
    const exists = app.service.some((s) => s.$?.['android:name'] === SERVICE_NAME);
    if (!exists) {
      app.service.push({
        $: {
          'android:name': SERVICE_NAME,
          'android:enabled': 'true',
          'android:exported': 'false',
          'android:foregroundServiceType': 'specialUse',
        },
        property: [
          {
            $: {
              'android:name': 'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE',
              'android:value':
                'Floating real-time ping meter shown over mobile games so the user can monitor network stability while playing.',
            },
          },
        ],
      });
    }

    for (const p of PERMISSIONS) addPermission(manifest, p);
    return cfg;
  });
}

module.exports = withZeroLagHud;
