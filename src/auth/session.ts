// Session model. Zero-Lag has no account or cloud service today. A guest
// session is the complete, unrestricted local experience.

export type Session = { mode: 'guest' };

// No live backend exists. Flip to true only when a host is named and wired.
export const CLOUD_SYNC_AVAILABLE = false;

export function guestSession(): Session {
  return { mode: 'guest' };
}

// Treat persisted state as untrusted. Older account-shaped records are not
// authentication and must return the user to the local start screen.
export function canUseApp(session: unknown): session is Session {
  if (typeof session !== 'object' || session === null || Array.isArray(session)) return false;
  const value = session as Record<string, unknown>;
  return value.mode === 'guest' && Object.keys(value).length === 1;
}
