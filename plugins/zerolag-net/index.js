// JS bridge to the native telephony module. On Android after prebuild the
// native module exists. Outside a build (node test, web) it is null and the
// app shows the honest "unavailable" signal state.
const { NativeModules } = require('react-native');

const native = NativeModules && NativeModules.ZeroLagNet ? NativeModules.ZeroLagNet : null;

module.exports = {
  getNativeSignalModule() {
    if (!native) return null;
    return {
      async getSnapshot() {
        return native.getSnapshot ? await native.getSnapshot() : null;
      },
    };
  },
};
