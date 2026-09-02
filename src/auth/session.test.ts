import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guestSession, canUseApp, CLOUD_SYNC_AVAILABLE } from './session.ts';

test('a guest session is allowed full, unrestricted access without an account', () => {
  const session = guestSession();

  assert.deepEqual(session, { mode: 'guest' });
  assert.equal(canUseApp(session), true);
  assert.equal(Object.hasOwn(session, 'email'), false);
});

test('a legacy account-shaped local record is not treated as an authenticated session', () => {
  assert.equal(canUseApp({ mode: 'account', email: 'a@b.com' }), false);
});

test('cloud sync is off until a host is named, so there is no credential-based account feature', () => {
  assert.equal(CLOUD_SYNC_AVAILABLE, false);
});
