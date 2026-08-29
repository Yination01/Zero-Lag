import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOST_ACTIONS } from './actions.ts';

const LIE_PATTERN = /(increases? (your )?signal|boosts? (your )?signal|overclock|closes? other apps automatically|kills? background apps automatically|200% ?faster|defrag|cleans? RAM automatically)/i;

test('every boost action explains what it does and why it works', () => {
  for (const a of BOOST_ACTIONS) {
    assert.ok(a.doesWhat && a.doesWhat.length > 10, `${a.id} needs doesWhat`);
    assert.ok(a.whyItWorks && a.whyItWorks.length > 10, `${a.id} needs whyItWorks`);
  }
});

test('no boost action makes a claim Android cannot deliver', () => {
  for (const a of BOOST_ACTIONS) {
    const blob = `${a.label} ${a.doesWhat} ${a.whyItWorks}`;
    assert.ok(!LIE_PATTERN.test(blob), `${a.id} claims something blocked or false: ${blob}`);
  }
});

test('the hog action tells the user they stop the app themselves', () => {
  const hogs = BOOST_ACTIONS.find((a) => a.id === 'guided-hogs');
  assert.match(hogs!.doesWhat + hogs!.whyItWorks, /you (stop|force|tap)|yourself|one tap/i);
});
