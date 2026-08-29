import { NativeModules } from 'react-native';
import {
  createForegroundGamePackageReader,
  type ForegroundGamePackage,
  type NativeGameDetectionModule,
} from './bridges';

const native = NativeModules.ZeroLagNet as NativeGameDetectionModule | undefined;

export const getForegroundGamePackage = createForegroundGamePackageReader(native);
export type { ForegroundGamePackage };
