// Boost action catalog. Every action is something Android actually allows.
// Nothing here kills another app silently, overclocks, or changes another
// app's settings. Typed intent destinations take the user to the right system screen.

import type { SettingsDestination } from '../permissions/settings';

export type BoostKind = 'deep-link' | 'settings' | 'toggle';

export interface BoostAction {
  id: string;
  label: string;
  description: string;
  // Plain-language honesty copy, shown to the user.
  doesWhat: string; // exactly what happens when they tap it
  whyItWorks: string; // why it helps
  kind: BoostKind;
  target?: SettingsDestination; // typed Android settings destination
  gated?: boolean; // needs a permission before it can run
  requiresPermission?: string;
  // Which tiers find this meaningful. Default all.
  tiers?: Array<'entry' | 'midrange' | 'flagship'>;
}

export const BOOST_ACTIONS: BoostAction[] = [
  {
    id: 'guided-hogs',
    label: 'Allow game detection',
    description: 'Open Usage access so Zero-Lag can recognize a supported game.',
    doesWhat:
      'Opens Usage access settings. Select Zero-Lag, turn on Allow usage access, then return to the Game tab. Zero-Lag does not list, force stop, or close other apps.',
    whyItWorks:
      'Usage access lets Android report the foreground app, so Zero-Lag can label a supported game. Android keeps app management under your control.',
    kind: 'deep-link',
    target: 'usage-access',
    requiresPermission: 'usage',
  },
  {
    id: 'dnd',
    label: 'Do Not Disturb for matches',
    description: 'Open Do Not Disturb settings to silence match interruptions.',
    doesWhat:
      'Opens Do Not Disturb settings. Turn on Do Not Disturb or set a gaming schedule, then return to Zero-Lag. Zero-Lag does not toggle it for you.',
    whyItWorks:
      'Notifications can trigger overlays and sounds during play. Do Not Disturb reduces interruptions while you control which people and apps may break through.',
    kind: 'settings',
    target: 'do-not-disturb',
  },
  {
    id: 'wakelock',
    label: 'Keep screen awake while playing',
    description: 'Open Display settings to choose a longer screen timeout.',
    doesWhat:
      'Opens Display settings. Set Screen timeout long enough for your match. Zero-Lag cannot keep another app screen awake for you.',
    whyItWorks:
      'A longer timeout prevents the screen from dimming or sleeping during a match. Android keeps this system setting under your control.',
    kind: 'settings',
    target: 'display',
  },
  {
    id: 'brightness',
    label: 'Set brightness for gaming',
    description: 'Open display settings to avoid auto-dim.',
    doesWhat: 'Opens your Display settings. You set the brightness or disable adaptive brightness.',
    whyItWorks:
      'A stable brightness stops the screen dimming during long sessions. Apps cannot set system brightness without a settings-write permission, so we guide you.',
    kind: 'settings',
    target: 'display',
  },
  {
    id: 'storage',
    label: 'Find storage hogs and junk',
    description: 'Open storage settings to clear space.',
    doesWhat: 'Opens the Storage screen. You review and delete files. Zero-Lag cannot delete files outside its own folder.',
    whyItWorks:
      'Nearly full storage slows the whole phone and can block game updates. Freeing space lets the system cache work normally.',
    kind: 'settings',
    target: 'storage',
  },
  {
    id: 'refresh',
    label: 'Guided network refresh',
    description: 'Reconnect your mobile network before matchmaking.',
    doesWhat:
      'Shows a five-step guide, then opens Airplane mode settings. You turn airplane mode on then off; Zero-Lag cannot toggle the radio itself.',
    whyItWorks:
      'Turning airplane mode off then on makes the modem detach and register again. The network chooses the cell, so this may help a stale connection but cannot guarantee lower lag. Never do it during a live match.',
    kind: 'deep-link',
    target: 'airplane-mode',
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
