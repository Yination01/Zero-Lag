// Expo config plugin: register Zero-Lag's local native packages so the
// generated MainApplication includes them. android/ stays generated and
// gitignored; this is the supported hook for local native modules.
const { withMainApplication } = require('expo/config-plugins');

const PACKAGES = [
  'com.yination01.zerolag.net.ZeroLagNetPackage',
  'com.yination01.zerolag.device.ZeroLagDevicePackage',
  'com.yination01.zerolag.hud.ZeroLagHudPackage',
];

function withNativePackages(config) {
  return withMainApplication(config, (cfg) => {
    let contents = cfg.modResults.contents;
    for (const pkg of PACKAGES) {
      const simple = pkg.split('.').pop();
      if (!contents.includes(simple)) {
        contents = contents.replace(
          /(import\s+com\.facebook\.react\.ReactNativeHost;)/,
          `$1\nimport ${pkg};`,
        );
        contents = contents.replace(
          /(packages\.add\(new\s+[^;]*?;)|(return packages;)/,
          `packages.add(new ${simple}());\n$1`,
        );
      }
    }
    cfg.modResults.contents = contents;
    return cfg;
  });
}

module.exports = withNativePackages;
