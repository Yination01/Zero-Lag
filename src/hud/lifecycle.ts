// HUD lifecycle decisions live here so the UI only renders confirmed native
// state. A foreground-service start is asynchronous on Android, therefore a
// resolved start request is not treated as proof that the overlay is visible.

import type { HudController } from '../plugins/bridges.ts';

export type HudGateway = Pick<
  HudController,
  'isSupported' | 'canDrawOverlays' | 'isRunning' | 'start' | 'stop'
>;

export type HudStatus =
  | 'unavailable'
  | 'needs-overlay-permission'
  | 'stopped'
  | 'running'
  | 'status-unknown';

export type HudDisplayStatus = HudStatus | 'checking';

export type HudAction =
  | 'unavailable'
  | 'needs-overlay-permission'
  | 'started'
  | 'stopped'
  | 'start-unconfirmed'
  | 'stop-unconfirmed'
  | 'start-failed'
  | 'stop-failed'
  | 'status-unknown';

export interface HudTransition {
  action: HudAction;
  status: HudStatus;
}

export interface HudConfirmationOptions {
  attempts?: number;
  wait?: () => Promise<void>;
}

const DEFAULT_ATTEMPTS = 5;
const MAX_ATTEMPTS = 8;

function defaultWait(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200));
}

function confirmationAttempts(value: number | undefined): number {
  if (!Number.isFinite(value)) return DEFAULT_ATTEMPTS;
  return Math.max(1, Math.min(MAX_ATTEMPTS, Math.floor(value!)));
}

export async function inspectHud(hud: HudGateway): Promise<HudStatus> {
  try {
    if (!hud.isSupported()) return 'unavailable';
  } catch {
    return 'status-unknown';
  }

  let canDraw: boolean;
  try {
    canDraw = await hud.canDrawOverlays();
  } catch {
    return 'status-unknown';
  }
  if (!canDraw) return 'needs-overlay-permission';

  try {
    return await hud.isRunning() ? 'running' : 'stopped';
  } catch {
    return 'status-unknown';
  }
}

async function waitForHudState(
  hud: HudGateway,
  expected: boolean,
  options: HudConfirmationOptions,
): Promise<boolean> {
  const attempts = confirmationAttempts(options.attempts);
  const wait = options.wait ?? defaultWait;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      if (await hud.isRunning() === expected) return true;
    } catch {
      return false;
    }
    if (attempt < attempts - 1) await wait();
  }
  return false;
}

// Toggle only after the currently reported state is known. The returned state
// is confirmed by the native module or deliberately marked unknown.
export async function toggleHud(
  hud: HudGateway,
  intervalMs: number,
  options: HudConfirmationOptions = {},
): Promise<HudTransition> {
  const before = await inspectHud(hud);

  if (before === 'unavailable') return { action: 'unavailable', status: before };
  if (before === 'needs-overlay-permission') {
    return { action: 'needs-overlay-permission', status: before };
  }
  if (before === 'status-unknown') return { action: 'status-unknown', status: before };

  if (before === 'stopped') {
    try {
      await hud.start(intervalMs);
    } catch {
      return { action: 'start-failed', status: 'status-unknown' };
    }
    return await waitForHudState(hud, true, options)
      ? { action: 'started', status: 'running' }
      : { action: 'start-unconfirmed', status: 'status-unknown' };
  }

  try {
    await hud.stop();
  } catch {
    return { action: 'stop-failed', status: 'status-unknown' };
  }
  return await waitForHudState(hud, false, options)
    ? { action: 'stopped', status: 'stopped' }
    : { action: 'stop-unconfirmed', status: 'status-unknown' };
}
