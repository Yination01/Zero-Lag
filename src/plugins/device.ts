import { NativeModules, Platform } from 'react-native';
import { createDeviceFactsReader, type DeviceFacts, type NativeDeviceModule } from './bridges';

const native = NativeModules.ZeroLagDevice as NativeDeviceModule | undefined;

export const getDeviceFacts = createDeviceFactsReader(native, Platform.OS);
export type { DeviceFacts };
