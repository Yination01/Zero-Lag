import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const projectRoot = process.cwd();
const nativeModulePath = join(
  projectRoot,
  'plugins',
  'zerolag-net',
  'android',
  'src',
  'main',
  'java',
  'com',
  'yination01',
  'zerolag',
  'net',
  'ZeroLagNetModule.kt',
);

test('foreground-game detection passes a UsageEvents.Event to getNextEvent', () => {
  const source = readFileSync(nativeModulePath, 'utf8');
  const eventDeclaration = source.match(
    /val\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*android\.app\.usage\.UsageEvents\.Event\(\)/,
  );

  assert.ok(eventDeclaration, 'the Android API requires a UsageEvents.Event instance');
  const eventName = eventDeclaration[1];
  assert.match(source, new RegExp(`events\\.getNextEvent\\(${eventName}\\)`));
  assert.match(source, new RegExp(`${eventName}\\.eventType`));
  assert.match(source, new RegExp(`${eventName}\\.packageName`));
  assert.doesNotMatch(
    source,
    /val\s+[A-Za-z_][A-Za-z0-9_]*\s*=\s*android\.app\.usage\.UsageEvents\(\)/,
  );
});

test('foreground-game detection skips Zero-Lag itself and keeps a recent app event', () => {
  const source = readFileSync(nativeModulePath, 'utf8');

  assert.match(
    source,
    /packageName\s*!=\s*appContext\.packageName/,
    'returning to Zero-Lag must not overwrite the recently opened game package',
  );
  assert.match(
    source,
    /queryEvents\(now\s*-\s*120_000,\s*now\)/,
    'the user needs enough time to return from a game before detection refreshes',
  );
});
