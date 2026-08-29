// On-device persistence. Guests and account users use the same local store;
// an account only matters for optional cloud sync later. We lazily load
// AsyncStorage so node tests (which have no React Native runtime) still work,
// falling back to an in-memory map.

let memory: Record<string, string> = {};
let store: { getItem(k: string): Promise<string | null>; setItem(k: string, v: string): Promise<void> } | null = null;

async function driver() {
  if (store) return store;
  try {
    const mod = require('@react-native-async-storage/async-storage');
    store = mod.default || mod.AsyncStorage;
    return store;
  } catch {
    store = {
      getItem: async (k: string) => (k in memory ? memory[k] : null),
      setItem: async (k: string, v: string) => {
        memory[k] = v;
      },
    };
    return store;
  }
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  const d = await driver();
  const raw = await d.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJson<T>(key: string, value: T): Promise<void> {
  const d = await driver();
  await d.setItem(key, JSON.stringify(value));
}

export const KEYS = {
  legalVersion: 'zerolag.legalVersion',
  session: 'zerolag.session',
  permissions: 'zerolag.permissions',
  history: 'zerolag.history',
  profile: 'zerolag.performanceProfile',
} as const;
