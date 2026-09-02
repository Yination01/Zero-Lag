import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextOnboardingStep } from './flow.ts';

test('a missing or outdated legal acceptance always returns to consent first', () => {
  assert.equal(nextOnboardingStep({ acceptedLegalVersion: null, session: { mode: 'guest' }, permissionsComplete: true }), 'legal');
  assert.equal(nextOnboardingStep({ acceptedLegalVersion: '1.0.0', session: { mode: 'guest' }, permissionsComplete: true }), 'legal');
});

test('a malformed or legacy account-shaped session returns to the local start screen', () => {
  assert.equal(nextOnboardingStep({
    acceptedLegalVersion: '1.1.0',
    session: { mode: 'account', email: 'old@example.com' },
    permissionsComplete: true,
  }), 'start');
});

test('a valid guest revisits permission setup only until they have completed the onboarding choice', () => {
  assert.equal(nextOnboardingStep({
    acceptedLegalVersion: '1.1.0',
    session: { mode: 'guest' },
    permissionsComplete: false,
  }), 'permissions');
  assert.equal(nextOnboardingStep({
    acceptedLegalVersion: '1.1.0',
    session: { mode: 'guest' },
    permissionsComplete: true,
  }), 'done');
});
