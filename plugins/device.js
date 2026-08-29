// JS bridge for device facts (RAM, cores, model). The native read is best
// done in a module; here we fall back to values RN exposes and mark unknowns
// as null so the tier engine defaults to entry (never guessed high).
const { NativeModules, Platform } = require('react-native');

const native = NativeModules && NativeModules.ZeroLagDevice ? NativeModules.ZeroLagDevice : null;

async function getDeviceFacts() {
  const model = (Platform.OS === 'android' && 'Android device') || 'Device';
  if (native && native.getFacts) {
    try {
      const f = await native.getFacts();
      if (f) return { ramMb: f.ramMb ?? null, cores: f.cores ?? null, model: f.model || model };
    } catch {
      // fall through to defaults
    }
  }
  // cores are the one fact available without a native module.
  const cores = (native && native.getCoreCount) || null;
  return { ramMb: null, cores: null, model };
}

module.exports = { getDeviceFacts };
