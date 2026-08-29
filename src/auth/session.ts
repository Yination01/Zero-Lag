// Session model. Accounts are optional. Guests get full, unrestricted app
// access. An account only unlocks optional cloud sync, and that stays OFF
// until a host is named (budget zero, no live host). History and settings
// persist on-device for guests too.

export type Session =
  | { mode: 'guest' }
  | { mode: 'account'; email: string };

// No live backend exists. Flip to true only when a host is named and wired.
export const CLOUD_SYNC_AVAILABLE = false;

export function guestSession(): Session {
  return { mode: 'guest' };
}

export function canUseApp(session: Session | null): boolean {
  // Guests and account holders are equal. There is no gate on features.
  return session !== null;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

// Local account intent. Real auth requires the named backend; until then an
// "account" is a local profile label so the screen works end to end on device.
export function localAccount(email: string): Session {
  return { mode: 'account', email: email.trim().toLowerCase() };
}
