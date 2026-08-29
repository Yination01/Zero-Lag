// JS bridge for device facts. The native module is available only in an
// Android build, so unknown values deliberately fall back to null.
const { NativeModules, Platform } = require('react-native');

const native = NativeModules && NativeModules.ZeroLagDevice ? NativeModules.ZeroLagDevice : null;

async function getDeviceFacts() {
  const model = (Platform.OS === 'android' && 'Android device') || 'Device';
  if (native && native.getFacts) {
    try {
      const facts = await native.getFacts();
      if (facts) return { ramMb: facts.ramMb ?? null, cores: facts.cores ?? null, model: facts.model || model };
    } catch {
      // Keep the conservative fallback below.
    }
  }
  return { ramMb: null, cores: null, model };
}

module.exports = { getDeviceFacts };
