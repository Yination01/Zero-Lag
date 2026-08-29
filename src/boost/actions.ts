// Boost action catalog. Every action is something Android actually allows.
// Nothing here kills another app silently, overclocks, or changes another
// app's settings. Deep links take the user to the right system screen.

export type BoostKind = 'deep-link' | 'settings' | 'toggle';

export interface BoostAction {
  id: string;
  label: string;
  description: string;
  // Plain-language honesty copy, shown to the user.
  doesWhat: string; // exactly what happens when they tap it
  whyItWorks: string; // why it helps
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
      'Find apps using the most battery and memory and help you stop them.',
    doesWhat:
      'Zero-Lag lists the heaviest background apps and opens each one’s App Info screen. You tap Force stop yourself. Android blocks every third-party app from ending other apps on its own.',
    whyItWorks:
      'Stopping another app’s process needs root or system rights that third-party apps never get. When you force stop a hog yourself, it frees RAM and CPU until it reopens, which can make your game smoother.',
    kind: 'deep-link',
    target: 'android.settings.USAGE_ACCESS_SETTINGS',
    requiresPermission: 'usage',
  },
  {
    id: 'dnd',
    label: 'Game Mode (Do Not Disturb)',
    description: 'Silence notifications so they do not interrupt a match.',
    doesWhat:
      'Opens the Do Not Disturb access screen so you can turn it on. Zero-Lag does not toggle it for you.',
    whyItWorks:
      'Notifications can trigger overlays and sounds during play. DND stops them so a banner does not cause you to lose a match.',
    kind: 'settings',
    target: 'android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS',
  },
  {
    id: 'wakelock',
    label: 'Keep screen awake while playing',
    description: 'Stop the screen sleeping mid-match.',
    doesWhat:
      'During an active game-bar session Zero-Lag keeps the screen awake inside its own app. It cannot change other apps’ sleep settings.',
    whyItWorks:
      'Android allows an app to hold a wake lock while it is running, which prevents the screen timing out during a long match.',
    kind: 'toggle',
  },
  {
    id: 'brightness',
    label: 'Set brightness for gaming',
    description: 'Open display settings to avoid auto-dim.',
    doesWhat: 'Opens your Display settings. You set the brightness or disable adaptive brightness.',
    whyItWorks:
      'A stable brightness stops the screen dimming during long sessions. Apps cannot set system brightness without a settings-write permission, so we guide you.',
    kind: 'settings',
    target: 'android.settings.DISPLAY_SETTINGS',
  },
  {
    id: 'storage',
    label: 'Find storage hogs and junk',
    description: 'Open storage settings to clear space.',
    doesWhat: 'Opens the Storage screen. You review and delete files. Zero-Lag cannot delete files outside its own folder.',
    whyItWorks:
      'Nearly full storage slows the whole phone and can block game updates. Freeing space lets the system cache work normally.',
    kind: 'settings',
    target: 'android.settings.INTERNAL_STORAGE_SETTINGS',
  },
  {
    id: 'refresh',
    label: 'Guided network refresh',
    description: 'Reconnect to the strongest tower before matchmaking.',
    doesWhat:
      'Opens airplane mode settings with a 5 step guide. You flip airplane mode on then off. Zero-Lag cannot toggle the radio itself.',
    whyItWorks:
      'Airplane mode off then on forces the modem to drop a stale tower lock and re-register on the strongest nearby cell, which can cut lag. Never do it during a live match.',
    kind: 'deep-link',
    target: 'android.settings.AIRPLANE_MODE_SETTINGS',
  },
  {
    id: 'gaming-dns',
    label: 'Gaming DNS (Network Boost)',
    description: 'Use fast DNS resolvers to cut matchmaking time.',
    doesWhat:
      'Pending. A local VPN routes only DNS queries through fast resolvers and blocks ad hosts. Full app traffic is not proxied.',
    whyItWorks:
      'Slow carrier DNS delays how fast game servers are found. Fast resolvers can shorten matchmaking time. It cannot increase radio signal, that is physics.',
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
