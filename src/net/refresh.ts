// Honest one-tap network refresh.
//
// Android does not let ordinary apps toggle airplane mode or reset the
// radio. What genuinely works is opening the system setting so the user can
// reconnect on their own. The app uses an Android intent, not a URL string.

import {
  openAndroidSettings,
  type AndroidIntentLauncher,
  type SettingsLaunchResult,
} from '../permissions/settings';

export const REFRESH_INSTRUCTIONS =
  'You will open Android Airplane mode settings.\n\n' +
  '1. Turn Airplane mode ON.\n' +
  '2. Wait 5 seconds.\n' +
  '3. Turn Airplane mode OFF.\n' +
  '4. Wait for mobile signal to return.\n' +
  '5. Return to Zero-Lag and run the test again.\n\n' +
  'Do this before matchmaking, never during a live match.';

export function openAirplaneModeSettings(link: AndroidIntentLauncher): Promise<SettingsLaunchResult> {
  return openAndroidSettings(link, 'airplane-mode');
}
