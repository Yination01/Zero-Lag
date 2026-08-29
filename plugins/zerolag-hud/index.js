// Bridge to the floating game bar service. The native module compiles from
// plugins/zerolag-hud/android during prebuild. Outside a build we no-op so
// JS and node tests never crash.
const { NativeModules, Platform } = require('react-native');

const native = NativeModules && NativeModules.ZeroLagHud ? NativeModules.ZeroLagHud : null;

module.exports = {
  isSupported() {
    return Platform.OS === 'android' && !!native;
  },
  async canDrawOverlays() {
    if (native && native.canDrawOverlays) {
      try {
        return await native.canDrawOverlays();
      } catch {
        return false;
      }
    }
    return false;
  },
  async start() {
    if (native && native.start) await native.start();
  },
  async stop() {
    if (native && native.stop) await native.stop();
  },
};
