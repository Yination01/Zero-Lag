export type SettingsDestination =
  | 'usage-access'
  | 'display-over-other-apps'
  | 'notification-policy'
  | 'do-not-disturb'
  | 'display'
  | 'storage'
  | 'airplane-mode';

export type SpecialSettingsDestination = 'usage-access' | 'display-over-other-apps';

export const GENERAL_SETTINGS_ACTION = 'android.settings.SETTINGS';

export const ANDROID_SETTINGS_ACTIONS: Record<SettingsDestination, string> = {
  'usage-access': 'android.settings.USAGE_ACCESS_SETTINGS',
  'display-over-other-apps': 'android.settings.action.MANAGE_OVERLAY_PERMISSION',
  'notification-policy': 'android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS',
  'do-not-disturb': 'android.settings.ZEN_MODE_SETTINGS',
  display: 'android.settings.DISPLAY_SETTINGS',
  storage: 'android.settings.INTERNAL_STORAGE_SETTINGS',
  'airplane-mode': 'android.settings.AIRPLANE_MODE_SETTINGS',
};

const SETTINGS_NAMES: Record<SettingsDestination, string> = {
  'usage-access': 'Usage access',
  'display-over-other-apps': 'Display over other apps',
  'notification-policy': 'Do Not Disturb access',
  'do-not-disturb': 'Do Not Disturb',
  display: 'Display',
  storage: 'Storage',
  'airplane-mode': 'Airplane mode',
};

export interface AndroidIntentLauncher {
  sendIntent(action: string): Promise<unknown>;
}

export type SettingsLaunchResult = 'opened' | 'opened-general-settings' | 'unavailable';

export interface SpecialAccessGuide {
  title: string;
  openLabel: string;
  steps: readonly string[];
  returnToAppStep: string;
  manualFallback: string;
}

export const SPECIAL_ACCESS_GUIDES: Record<SpecialSettingsDestination, SpecialAccessGuide> = {
  'usage-access': {
    title: 'Set up Usage Access',
    openLabel: 'OPEN USAGE ACCESS',
    steps: [
      '1. Tap Open Usage Access.',
      '2. In Android Settings, select Zero-Lag.',
      '3. Turn on Allow usage access.',
    ],
    returnToAppStep: '4. Return to Zero-Lag. Game detection refreshes within a few seconds.',
    manualFallback:
      'Android opened general Settings. Search for Usage access, select Zero-Lag, turn it on, then return to Zero-Lag.',
  },
  'display-over-other-apps': {
    title: 'Set up the floating HUD',
    openLabel: 'OPEN DISPLAY OVER OTHER APPS',
    steps: [
      '1. Tap Open Display over other apps.',
      '2. If Android shows a list, select Zero-Lag.',
      '3. Turn on Allow display over other apps.',
    ],
    returnToAppStep: '4. Return to Zero-Lag, then tap Start Floating HUD. If Android asks for Notifications, tap Allow so the ongoing HUD readout is visible.',
    manualFallback:
      'Android opened general Settings. Search for Display over other apps, select Zero-Lag, turn it on, then return to Zero-Lag.',
  },
};

export function specialAccessGuide(destination: SettingsDestination): SpecialAccessGuide | null {
  if (destination === 'usage-access' || destination === 'display-over-other-apps') {
    return SPECIAL_ACCESS_GUIDES[destination];
  }
  return null;
}

export async function openAndroidSettings(
  launcher: AndroidIntentLauncher,
  destination: SettingsDestination,
): Promise<SettingsLaunchResult> {
  try {
    await launcher.sendIntent(ANDROID_SETTINGS_ACTIONS[destination]);
    return 'opened';
  } catch {
    try {
      await launcher.sendIntent(GENERAL_SETTINGS_ACTION);
      return 'opened-general-settings';
    } catch {
      return 'unavailable';
    }
  }
}

export function settingsLaunchFeedback(
  destination: SettingsDestination,
  result: Exclude<SettingsLaunchResult, 'opened'>,
): string {
  const guide = SPECIAL_ACCESS_GUIDES[destination as SpecialSettingsDestination];
  if (result === 'opened-general-settings') {
    return guide?.manualFallback ?? `Android opened general Settings. Search for ${SETTINGS_NAMES[destination]}.`;
  }
  return `Could not open Android Settings. Open Settings manually, select ${SETTINGS_NAMES[destination]}, then return to Zero-Lag.`;
}
