// Signal reading. Real dBm comes from a native telephony module (plugins/).
// Until that plugin is wired, the app reads the React Native Network
// information it can get and shows an honest "signal detail unavailable"
// state rather than faking a number.

export interface SignalSnapshot {
  carrier: string;
  networkType: string; // 5G, 4G LTE, 3G, 2G, Wi-Fi, Unknown
  dbm: number | null;  // null until the native telephony plugin reports it
  quality: string;     // human label from signalQualityLabel, or a state note
  isWifi: boolean;
}

export const EMPTY_SIGNAL: SignalSnapshot = {
  carrier: 'Unknown',
  networkType: 'Unknown',
  dbm: null,
  quality: 'Signal detail unavailable',
  isWifi: false,
};

export interface NativeSignalModule {
  // Implemented in plugins/zerolag-net on the Android side.
  getSnapshot(): Promise<Partial<SignalSnapshot> | null>;
}

export async function readSignal(native: NativeSignalModule | null): Promise<SignalSnapshot> {
  if (!native) return EMPTY_SIGNAL;
  try {
    const s = await native.getSnapshot();
    if (!s) return EMPTY_SIGNAL;
    return { ...EMPTY_SIGNAL, ...s };
  } catch {
    return EMPTY_SIGNAL;
  }
}
