// Device recognition and performance-tier engine.
//
// The tier tunes Zero-Lag behavior (HUD refresh rate, test sample count,
// whether extra overlays run). It CANNOT overclock the CPU or change a
// game's graphics. Unknown devices fall back to the lightest tier so we
// never assume a budget phone has headroom.

export type Tier = 'entry' | 'midrange' | 'flagship';

export interface DeviceFacts {
  ramMb: number | null;
  cores: number | null;
  model: string;
}

export interface TierResult {
  tier: Tier;
  label: string;
  facts: DeviceFacts;
}

export type ProfileId = 'auto' | 'battery' | 'balanced' | 'performance';

export interface TuningProfile {
  profile: ProfileId;
  hudIntervalMs: number;
  sampleCount: number;
  overlaysEnabled: boolean;
}

// Tuning presets for the performance feature.
export const ALL_TUNING: TuningProfile[] = [
  { profile: 'battery', hudIntervalMs: 5000, sampleCount: 5, overlaysEnabled: false },
  { profile: 'balanced', hudIntervalMs: 3000, sampleCount: 8, overlaysEnabled: true },
  { profile: 'performance', hudIntervalMs: 1500, sampleCount: 10, overlaysEnabled: true },
];

function tierFromFacts(ramMb: number | null, cores: number | null): Tier {
  if (ramMb == null || cores == null) return 'entry';
  if (ramMb >= 8000 && cores >= 8) return 'flagship';
  if (ramMb >= 4000 && cores >= 6) return 'midrange';
  return 'entry';
}

export function classifyDevice(facts: DeviceFacts): TierResult {
  const tier = tierFromFacts(facts.ramMb, facts.cores);
  const label = tier === 'flagship' ? 'Flagship' : tier === 'midrange' ? 'Mid-range' : 'Entry';
  return { tier, label, facts };
}

const AUTO_FOR_TIER: Record<Tier, ProfileId> = {
  entry: 'battery',
  midrange: 'balanced',
  flagship: 'performance',
};

// Resolve the effective tuning. preference 'auto' follows the device tier;
// any explicit user preference wins.
export function recommendProfile(
  device: TierResult,
  preference: ProfileId,
): TuningProfile {
  if (preference !== 'auto') {
    const chosen = ALL_TUNING.find((p) => p.profile === preference)!;
    return { ...chosen };
  }
  const wanted = AUTO_FOR_TIER[device.tier];
  return { ...ALL_TUNING.find((p) => p.profile === wanted)! };
}
