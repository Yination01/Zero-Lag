// Honest one-tap network refresh.
//
// Android does not let ordinary apps toggle airplane mode or reset the
// radio (that is system app power), and shell tricks need root. What
// genuinely works is opening the airplane mode settings so the user flips
// it on, waits, and flips it off. That forces the modem to drop a stale
// tower lock and re-register on the strongest nearby cell.

export interface LinkDeps {
  openURL: (url: string) => Promise<void>;
}

// Android settings deep links, best first.
export const AIRPLANE_SETTINGS_URIS = [
  'android.settings.AIRPLANE_MODE_SETTINGS',
  'android.settings.WIRELESS_SETTINGS',
  'android.settings.SETTINGS',
];

export const REFRESH_INSTRUCTIONS =
  '1. Turn Airplane mode ON.\n' +
  '2. Wait 5 seconds.\n' +
  '3. Turn it back OFF.\n\n' +
  'Your phone reconnects to the strongest nearby tower. Do this before ' +
  'matchmaking, never during a live match.';

export async function openAirplaneModeSettings(link: LinkDeps, canOpen: (url: string) => Promise<boolean>): Promise<void> {
  for (const uri of AIRPLANE_SETTINGS_URIS) {
    try {
      if (await canOpen(uri)) {
        await link.openURL(uri);
        return;
      }
    } catch {
      // try the next fallback
    }
  }
  // Last resort: open the generic settings.
  await link.openURL('android.settings.SETTINGS').catch(() => undefined);
}
