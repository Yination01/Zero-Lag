import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guestSession, canUseApp, validateEmail, validatePassword, CLOUD_SYNC_AVAILABLE } from './session.ts';

test('guest session is allowed full, unrestricted access', () => {
  const g = guestSession();
  assert.equal(g.mode, 'guest');
  assert.equal(canUseApp(g), true);
});

test('an account session is also allowed access', () => {
  assert.equal(canUseApp({ mode: 'account', email: 'a@b.com' }), true);
});

test('email validation accepts real addresses and rejects junk', () => {
  assert.equal(validateEmail('user@example.com'), true);
  assert.equal(validateEmail('nope'), false);
  assert.equal(validateEmail('a@b'), false);
});

test('password requires at least 8 characters', () => {
  assert.equal(validatePassword('12345678'), true);
  assert.equal(validatePassword('short'), false);
});

test('cloud sync is off until a host is named (budget zero, no live host)', () => {
  assert.equal(CLOUD_SYNC_AVAILABLE, false);
});
