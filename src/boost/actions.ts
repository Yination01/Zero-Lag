// Boost action catalog. Every action is something Android actually allows.
// Nothing here kills another app silently, overclocks, or changes another
// app's settings. Deep links take the user to the right system screen.

export type BoostKind = 'deep-link' | 'settings' | 'toggle';

export interface BoostAction {
  id: string;
  label: string;
  description: string;
  kind: BoostKind;
  target?: string; // settings intent key or url
  gated?: boolean; // needs a permission before it can run
  requiresPermission?: string;
  // Which tiers find this meaningful. Default all.
  tiers?: Array<'entry' | 'midrange' | 'flagship'>;
}

export const BOOST_ACTIONS: BoostAction[] = [
  {
    id: 'guided-hogs',
    label: 'Stop background app hogs',
    description:
      'Show apps using the most battery and memory, then open App Info so you can force stop each one. Android does not let us close them for you.',
    kind: 'deep-link',
    target: 'android.settings.USAGE_ACCESS_SETTINGS',
    requiresPermission: 'usage',
  },
  {
    id: 'dnd',
    label: 'Game Mode (Do Not Disturb)',
    description: 'Silence notifications while you play so they do not interrupt a match.',
    kind: 'settings',
    target: 'android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS',
  },
  {
    id: 'wakelock',
    label: 'Keep screen awake while playing',
    description: 'Stop the screen from sleeping mid-match. This is a real in-app setting.',
    kind: 'toggle',
  },
  {
    id: 'brightness',
    label: 'Set brightness for gaming',
    description: 'Apply a steady brightness to avoid auto-dim during a long session.',
    kind: 'settings',
    target: 'android.settings.DISPLAY_SETTINGS',
  },
  {
    id: 'storage',
    label: 'Find storage hogs and junk',
    description: 'Scan large files and old downloads, then open storage settings to clear them.',
    kind: 'settings',
    target: 'android.settings.INTERNAL_STORAGE_SETTINGS',
  },
  {
    id: 'refresh',
    label: 'Guided network refresh',
    description: 'Force your phone to reconnect to the strongest tower before matchmaking.',
    kind: 'deep-link',
    target: 'android.settings.AIRPLANE_MODE_SETTINGS',
  },
  {
    id: 'gaming-dns',
    label: 'Gaming DNS (Network Boost)',
    description: 'Route DNS through fast resolvers to cut matchmaking time. VPN based, coming in a later build.',
    kind: 'toggle',
    requiresPermission: 'vpn',
  },
];

export interface BoostContext {
  tier: 'entry' | 'midrange' | 'flagship';
  usagePermission: boolean;
  overlayPermission: boolean;
}

// Resolve whether each action is available now. Gating is computed
// authoritatively here from the permission context so the UI never fakes an
// action the platform or user has not allowed.
export function buildBoostActions(ctx: BoostContext): BoostAction[] {
  return BOOST_ACTIONS.map((a) => {
    let gated = false;
    if (a.requiresPermission === 'usage') gated = !ctx.usagePermission;
    if (a.requiresPermission === 'vpn') gated = true; // not shipped yet
    return { ...a, gated };
  });
}
