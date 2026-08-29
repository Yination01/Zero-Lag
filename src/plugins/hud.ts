import { NativeModules, Platform } from 'react-native';
import { createHudController, type NativeHudModule } from './bridges';

const native = NativeModules.ZeroLagHud as NativeHudModule | undefined;

export const hud = createHudController(native, Platform.OS);
