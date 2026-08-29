import { useEffect, useState } from 'react';
import { classifyDevice, recommendProfile, type TierResult, type TuningProfile, type ProfileId } from '../device/tier';
import { getDeviceFacts } from '../plugins/device';

export interface DeviceState {
  tier: TierResult | null;
  profile: TuningProfile | null;
  loading: boolean;
}

export function useDevice(preference: ProfileId = 'auto'): DeviceState {
  const [state, setState] = useState<DeviceState>({ tier: null, profile: null, loading: true });

  useEffect(() => {
    let alive = true;
    getDeviceFacts().then((facts) => {
      if (!alive) return;
      const tier = classifyDevice(facts);
      const profile = recommendProfile(tier, preference);
      setState({ tier, profile, loading: false });
    });
    return () => {
      alive = false;
    };
  }, [preference]);

  return state;
}
