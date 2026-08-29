// Permission catalog. Each entry tells the user exactly what we ask for and
// why, in plain language. "runtime" permissions use the system dialog;
// "special" permissions open a settings screen (overlay, usage access).

export type PermissionKind = 'runtime' | 'special';

export interface PermissionDef {
  key: string;
  label: string;
  why: string; // honest reason shown to the user
  kind: PermissionKind;
  settingsUri?: string; // for special permissions
}

export const PERMISSIONS: PermissionDef[] = [
  {
    key: 'location',
    label: 'Location',
    why: 'Android only gives signal strength (dBm) to apps that hold location. It stays on your device and is never uploaded.',
    kind: 'runtime',
  },
  {
    key: 'phone',
    label: 'Phone state',
    why: 'Used to read your carrier name and whether you are on 4G or 5G.',
    kind: 'runtime',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    why: 'Lets the game bar run as a foreground service and show a ping notification while you play.',
    kind: 'runtime',
  },
  {
    key: 'overlay',
    label: 'Display over other apps',
    why: 'Required to draw the floating game bar on top of your game. It is read-only and never blocks your touch more than a tiny pill.',
    kind: 'special',
    settingsUri: 'android.settings.action.MANAGE_OVERLAY_PERMISSION',
  },
  {
    key: 'usage',
    label: 'Usage access',
    why: 'Needed to see which game is in the foreground so we tune the readout. We never close apps for you.',
    kind: 'special',
    settingsUri: 'android.settings.USAGE_ACCESS_SETTINGS',
  },
];

export type GrantMap = Record<string, boolean>;

export function missingPermissions(granted: GrantMap): PermissionDef[] {
  return PERMISSIONS.filter((p) => !granted[p.key]);
}

export function allGranted(granted: GrantMap): boolean {
  return PERMISSIONS.every((p) => granted[p.key]);
}
