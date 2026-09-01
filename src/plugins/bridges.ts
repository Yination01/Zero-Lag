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
  openOverlaySettings?: () => Promise<unknown> | unknown;
  isRunning?: () => Promise<unknown> | unknown;
  start?: (intervalMs?: number) => Promise<unknown> | unknown;
  stop?: () => Promise<unknown> | unknown;
}

export interface ForegroundGamePackage {
  packageName: string | null;
  needsPermission: boolean;
}

export interface HudController {
  isSupported(): boolean;
  canDrawOverlays(): Promise<boolean>;
  openOverlaySettings(): Promise<boolean>;
  isRunning(): Promise<boolean>;
  start(intervalMs?: number): Promise<void>;
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
      if (packageName === 'NO_FOREGROUND_APP') return { packageName: null, needsPermission: false };
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
  const supported =
    platform === 'android' &&
    typeof native?.canDrawOverlays === 'function' &&
    typeof native?.isRunning === 'function' &&
    typeof native?.start === 'function' &&
    typeof native?.stop === 'function';

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
    async openOverlaySettings() {
      if (!supported || !native?.openOverlaySettings) return false;
      try {
        return (await native.openOverlaySettings()) === true;
      } catch {
        return false;
      }
    },
    async isRunning() {
      if (!supported || !native?.isRunning) return false;
      try {
        return (await native.isRunning()) === true;
      } catch {
        return false;
      }
    },
    async start(intervalMs = 3000) {
      if (supported && native?.start) {
        const safeInterval = Number.isFinite(intervalMs)
          ? Math.round(Math.min(10_000, Math.max(1_000, intervalMs)))
          : 3000;
        await native.start(safeInterval);
      }
    },
    async stop() {
      if (supported && native?.stop) await native.stop();
    },
  };
}
