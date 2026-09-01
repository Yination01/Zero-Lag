import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as tier from './tier.ts';
import { classifyDevice, recommendProfile, ALL_TUNING } from './tier.ts';

test('a high end device classifies as flagship', () => {
  const t = classifyDevice({ ramMb: 12000, cores: 8, model: 'Pixel 9 Pro' });
  assert.equal(t.tier, 'flagship');
});

test('a mid range device classifies as midrange', () => {
  const t = classifyDevice({ ramMb: 6000, cores: 8, model: 'Generic A' });
  assert.equal(t.tier, 'midrange');
});

test('a low ram device classifies as entry', () => {
  const t = classifyDevice({ ramMb: 2048, cores: 4, model: 'Budget X' });
  assert.equal(t.tier, 'entry');
});

test('missing data defaults to entry, never guessed high', () => {
  const t = classifyDevice({ ramMb: null, cores: null, model: 'Unknown' });
  assert.equal(t.tier, 'entry');
});

test('recommended profile tunes behavior lighter on entry devices', () => {
  const entry = recommendProfile(classifyDevice({ ramMb: 2048, cores: 4, model: 'x' }), 'auto');
  const flag = recommendProfile(classifyDevice({ ramMb: 12000, cores: 8, model: 'y' }), 'auto');
  assert.ok(entry.hudIntervalMs >= flag.hudIntervalMs, 'entry HUD updates no more often than flagship');
  assert.ok(entry.sampleCount <= flag.sampleCount, 'entry uses no more samples than flagship');
});

test('user preference overrides the recommended tier', () => {
  const device = classifyDevice({ ramMb: 12000, cores: 8, model: 'y' });
  const forced = recommendProfile(device, 'battery');
  assert.equal(forced.profile, 'battery');
});

test('every tuning profile has the keys the HUD and test loop need', () => {
  for (const p of ALL_TUNING) {
    assert.ok(p.hudIntervalMs > 0);
    assert.ok(p.sampleCount > 0);
    assert.ok(p.overlaysEnabled !== undefined);
  }
});

test('auto recommendation names an explicit performance level for every device tier', () => {
  const getRecommendedPerformance = (tier as {
    getRecommendedPerformance?: (device: ReturnType<typeof classifyDevice>) => {
      profile: { profile: string };
      reason: string;
    };
  }).getRecommendedPerformance;
  assert.equal(typeof getRecommendedPerformance, 'function');

  const entry = getRecommendedPerformance!(classifyDevice({ ramMb: 2048, cores: 4, model: 'Entry' }));
  const midrange = getRecommendedPerformance!(classifyDevice({ ramMb: 6000, cores: 8, model: 'Mid' }));
  const flagship = getRecommendedPerformance!(classifyDevice({ ramMb: 12000, cores: 8, model: 'Flag' }));

  assert.equal(entry.profile.profile, 'battery');
  assert.equal(midrange.profile.profile, 'balanced');
  assert.equal(flagship.profile.profile, 'performance');
  assert.ok(entry.reason.length > 10);
  assert.ok(midrange.reason.length > 10);
  assert.ok(flagship.reason.length > 10);
});
