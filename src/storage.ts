// On-device persistence. Guests and account users use the same local store;
// an account only matters for optional cloud sync later. We lazily load
// AsyncStorage so node tests (which have no React Native runtime) still work,
// falling back to an in-memory map.

type StorageDriver = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

let memory: Record<string, string> = {};
let store: StorageDriver | null = null;

function isStorageDriver(value: unknown): value is StorageDriver {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<StorageDriver>;
  return typeof candidate.getItem === 'function' && typeof candidate.setItem === 'function';
}

function memoryDriver(): StorageDriver {
  return {
    getItem: async (key) => (key in memory ? memory[key] : null),
    setItem: async (key, value) => {
      memory[key] = value;
    },
  };
}

async function driver(): Promise<StorageDriver> {
  if (store !== null) return store;

  try {
    const mod = require('@react-native-async-storage/async-storage') as {
      default?: unknown;
      AsyncStorage?: unknown;
    };
    const nativeStore = mod.default ?? mod.AsyncStorage;
    if (isStorageDriver(nativeStore)) {
      store = nativeStore;
      return nativeStore;
    }
  } catch {
    // The memory fallback below keeps node tests and unsupported runtimes safe.
  }

  const fallback = memoryDriver();
  store = fallback;
  return fallback;
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  const storage = await driver();
  const raw = await storage.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJson<T>(key: string, value: T): Promise<void> {
  const storage = await driver();
  await storage.setItem(key, JSON.stringify(value));
}

export const KEYS = {
  legalVersion: 'zerolag.legalVersion',
  session: 'zerolag.session',
  permissions: 'zerolag.permissions',
  history: 'zerolag.history',
  profile: 'zerolag.performanceProfile',
} as const;
