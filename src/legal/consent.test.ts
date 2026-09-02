import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEGAL_VERSION, LEGAL_DOCS, needsConsent } from './consent.ts';

test('a null or old acceptance requires consent', () => {
  assert.equal(needsConsent(null), true);
  assert.equal(needsConsent('0.9.0'), true);
});

test('the previous consent version must be renewed after the local history disclosure update', () => {
  assert.equal(needsConsent('1.0.0'), true);
});

test('accepting the current version clears the gate', () => {
  assert.equal(needsConsent(LEGAL_VERSION), false);
});

test('every legal doc has an id, title and body text', () => {
  for (const d of LEGAL_DOCS) {
    assert.ok(d.id.length > 0);
    assert.ok(d.title.length > 0);
    assert.ok(d.body.length > 40, `${d.id} body must be real text`);
  }
});

test('legal docs include terms, privacy and eula', () => {
  const ids = LEGAL_DOCS.map((d) => d.id);
  assert.ok(ids.includes('terms'));
  assert.ok(ids.includes('privacy'));
  assert.ok(ids.includes('eula'));
});
