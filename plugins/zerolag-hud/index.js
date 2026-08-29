// Bridge to the overlay service. The native ReactContextBaseJavaModule
// (start/stop) is compiled from plugins/zerolag-hud/android during prebuild.
// Here we tolerate its absence so JS code and node tests never crash.
const { NativeModules, Platform } = require('react-native');

const native = NativeModules && NativeModules.ZeroLagHud ? NativeModules.ZeroLagHud : null;

module.exports = {
  isSupported() {
    return Platform.OS === 'android' && !!native;
  },
  async start() {
    if (native && native.start) await native.start();
  },
  async stop() {
    if (native && native.stop) await native.stop();
  },
};
