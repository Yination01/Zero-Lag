import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getJson, setJson } from './storage.ts';

test('storage returns its fallback for a missing value and round-trips JSON', async () => {
  const key = `storage.test.${Date.now()}`;
  const fallback = { saved: false };

  assert.deepEqual(await getJson(key, fallback), fallback);
  await setJson(key, { saved: true, samples: [1, 2, 3] });
  assert.deepEqual(await getJson(key, fallback), { saved: true, samples: [1, 2, 3] });
});
