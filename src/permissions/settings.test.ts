import assert from 'node:assert/strict';
import { test } from 'node:test';

test('special access launches Android intents instead of treating actions as URLs', async () => {
  const settings = await import('./settings.ts');
  const calls: string[] = [];
  const launcher = {
    async sendIntent(action: string) {
      calls.push(action);
    },
  };

  const usageResult = await settings.openAndroidSettings(launcher, 'usage-access');
  const overlayResult = await settings.openAndroidSettings(launcher, 'display-over-other-apps');

  assert.equal(usageResult, 'opened');
  assert.equal(overlayResult, 'opened');
  assert.deepEqual(calls, [
    settings.ANDROID_SETTINGS_ACTIONS['usage-access'],
    settings.ANDROID_SETTINGS_ACTIONS['display-over-other-apps'],
  ]);
});

test('a vendor-missing settings page falls back once to general Android settings', async () => {
  const settings = await import('./settings.ts');
  const calls: string[] = [];
  const launcher = {
    async sendIntent(action: string) {
      calls.push(action);
      if (calls.length === 1) throw new Error('not available on this phone');
    },
  };

  const result = await settings.openAndroidSettings(launcher, 'usage-access');

  assert.equal(result, 'opened-general-settings');
  assert.deepEqual(calls, [
    settings.ANDROID_SETTINGS_ACTIONS['usage-access'],
    settings.GENERAL_SETTINGS_ACTION,
  ]);
});

test('each special access guide gives a direct action and sequential return-to-app steps', async () => {
  const settings = await import('./settings.ts');

  for (const destination of ['usage-access', 'display-over-other-apps'] as const) {
    const guide = settings.SPECIAL_ACCESS_GUIDES[destination];
    assert.ok(guide.openLabel.length > 0);
    assert.ok(guide.steps.length >= 3, `${destination} needs clear sequential steps`);
    assert.ok(guide.returnToAppStep.length > 0, `${destination} needs a return-to-app instruction`);
    assert.ok(guide.manualFallback.length > 0, `${destination} needs a manual fallback`);
  }
  assert.match(
    settings.SPECIAL_ACCESS_GUIDES['display-over-other-apps'].returnToAppStep,
    /Notifications/i,
    'the HUD guide explains the foreground-service notification requirement',
  );
});
