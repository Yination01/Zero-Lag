// JS bridge for foreground-app detection via Usage Access.
// The native side lives in plugins/zerolag-net (UsageStatsManager) and is
// compiled at prebuild. Absent native module => we report needsPermission
// so the UI shows the grant screen, never a fabricated game.
const { NativeModules } = require('react-native');

const native = NativeModules && NativeModules.ZeroLagNet ? NativeModules.ZeroLagNet : null;

async function getForegroundGamePackage() {
  if (!native || !native.getForegroundPackage) {
    return { packageName: null, needsPermission: true };
  }
  try {
    const pkg = await native.getForegroundPackage();
    if (pkg === null || pkg === 'PERMISSION_DENIED') {
      return { packageName: null, needsPermission: true };
    }
    return { packageName: pkg, needsPermission: false };
  } catch {
    return { packageName: null, needsPermission: true };
  }
}

module.exports = { getForegroundGamePackage };
