export interface DeviceFacts {
  ramMb: number | null;
  cores: number | null;
  model: string;
}

export interface NativeDeviceModule {
  getFacts?: () => Promise<unknown> | unknown;
}

export interface NativeGameDetectionModule {
  getForegroundPackage?: () => Promise<unknown> | unknown;
}

export interface NativeHudModule {
  canDrawOverlays?: () => Promise<unknown> | unknown;
  start?: () => Promise<unknown> | unknown;
  stop?: () => Promise<unknown> | unknown;
}

export interface ForegroundGamePackage {
  packageName: string | null;
  needsPermission: boolean;
}

export interface HudController {
  isSupported(): boolean;
  canDrawOverlays(): Promise<boolean>;
  start(): Promise<void>;
  stop(): Promise<void>;
}

function positiveWholeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

function nonBlankString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function fallbackDeviceFacts(platform: string): DeviceFacts {
  return { ramMb: null, cores: null, model: platform === 'android' ? 'Android device' : 'Device' };
}

export function createDeviceFactsReader(native: NativeDeviceModule | null | undefined, platform: string) {
  return async (): Promise<DeviceFacts> => {
    const fallback = fallbackDeviceFacts(platform);
    if (!native?.getFacts) return fallback;

    try {
      const result = await native.getFacts();
      if (typeof result !== 'object' || result === null) return fallback;
      const facts = result as Record<string, unknown>;
      return {
        ramMb: positiveWholeNumber(facts.ramMb),
        cores: positiveWholeNumber(facts.cores),
        model: nonBlankString(facts.model) ?? fallback.model,
      };
    } catch {
      return fallback;
    }
  };
}

function deniedGamePackage(): ForegroundGamePackage {
  return { packageName: null, needsPermission: true };
}

export function createForegroundGamePackageReader(native: NativeGameDetectionModule | null | undefined) {
  return async (): Promise<ForegroundGamePackage> => {
    if (!native?.getForegroundPackage) return deniedGamePackage();

    try {
      const packageName = nonBlankString(await native.getForegroundPackage());
      if (!packageName || packageName === 'PERMISSION_DENIED') return deniedGamePackage();
      return { packageName, needsPermission: false };
    } catch {
      return deniedGamePackage();
    }
  };
}

export function createHudController(
  native: NativeHudModule | null | undefined,
  platform: string,
): HudController {
  const supported = platform === 'android' && native !== null && native !== undefined;

  return {
    isSupported: () => supported,
    async canDrawOverlays() {
      if (!supported || !native?.canDrawOverlays) return false;
      try {
        return (await native.canDrawOverlays()) === true;
      } catch {
        return false;
      }
    },
    async start() {
      if (supported && native?.start) await native.start();
    },
    async stop() {
      if (supported && native?.stop) await native.stop();
    },
  };
}
