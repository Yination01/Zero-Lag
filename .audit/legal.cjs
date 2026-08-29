/**
 * Legal pack audit for Zero-Lag.
 *
 * Asserts the guarantee (honest booster claims, Nigeria courts, 13+,
 * placeholder contact, no live host) not one spelling of a heading.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let pass = 0;
const fails = [];
function ok(label, cond, hint) {
  if (cond) { pass++; console.log('  ok  ' + label); }
  else { fails.push(label); console.log('  x   ' + label + (hint ? '\n        ' + hint : '')); }
}
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const strip = (t) => t.replace(/<!--[\s\S]*?-->/g, '');

console.log('\n- legal pack -');
const FILES = [
  'TERMS.md', 'PRIVACY.md', 'COPYRIGHT.md', 'COMPLIANCE.md',
  'PLAY_DATA_SAFETY.md', 'LICENSE',
];
for (const f of FILES) ok(f + ' exists', exists(f));

const terms = exists('TERMS.md') ? strip(read('TERMS.md')) : '';
const privacy = exists('PRIVACY.md') ? strip(read('PRIVACY.md')) : '';
const copyright = exists('COPYRIGHT.md') ? strip(read('COPYRIGHT.md')) : '';
const compliance = exists('COMPLIANCE.md') ? strip(read('COMPLIANCE.md')) : '';
const play = exists('PLAY_DATA_SAFETY.md') ? strip(read('PLAY_DATA_SAFETY.md')) : '';
const license = exists('LICENSE') ? strip(read('LICENSE')) : '';
const all = [terms, privacy, copyright, compliance, play, license].join('\n');

ok('Terms name Nigeria as governing law', /Nigeria/i.test(terms));
ok('Terms send disputes to courts', /court/i.test(terms));
ok('Terms reject arbitration as the dispute path',
  /no arbitration|not.*arbitration|without arbitration/i.test(terms));
ok('Terms set the age floor at 13', /\b13\b/.test(terms));
ok('Privacy states NDPR applies', /NDPR/i.test(privacy));
ok('contact is the named placeholder, not a domain we do not own',
  /legal-contact-placeholder@example\.com/.test(all) &&
  !/@zero-lag\.(app|com|dev)/i.test(all) &&
  !/admin\.poise@gmail\.com/.test(all));
ok('copyright is all rights reserved', /all rights reserved/i.test(license) && /all rights reserved/i.test(copyright));
ok('pack is dated 2026-08-29',
  /2026-08-29/.test(terms) && /2026-08-29/.test(privacy));

ok('does not claim to raise tower signal',
  /no app can raise|cannot raise tower|does not raise/i.test(all) &&
  !/\bwe raise (your |the )?(tower )?signal/i.test(all) &&
  !/Zero-Lag raises (your )?signal/i.test(all));
ok('does not claim to silently kill other apps',
  !/we (will |can )?kill (background|other) apps/i.test(all) &&
  /force stop|guided hog|does not kill/i.test(all));
ok('does not claim to overclock',
  /cannot overclock|does not overclock|no overclock/i.test(all));
ok('game names are third-party marks, not ours',
  /not affiliated/i.test(terms) && /Call of Duty|COD/i.test(terms));
ok('Usage Access purpose is stated', /Usage Access|UsageStats/i.test(privacy));
ok('overlay purpose is the ping HUD', /overlay|SYSTEM_ALERT_WINDOW|HUD/i.test(privacy));
ok('location is for signal, not maps',
  /location/i.test(privacy) && /not (for )?maps|not a (map|navigation)|cell|signal/i.test(privacy));
ok('no live host means no cloud upload',
  /no live host|until (a |the )?host is named|local only/i.test(privacy));
ok('COMPLIANCE says this is not legal advice',
  /not legal advice/i.test(compliance));
ok('Play data safety names location, app activity, and diagnostics',
  /location/i.test(play) && /app activity|usage/i.test(play) && /diagnostic/i.test(play));

const dashed = FILES.filter((f) => exists(f) && /[\u2014\u2013]/.test(read(f)));
ok('no em-dash or en-dash in the legal pack', dashed.length === 0, dashed.join(', '));

console.log('\n' + pass + ' passed, ' + fails.length + ' failed');
if (fails.length) { console.log('legal pack FAILED'); process.exit(1); }
console.log('legal pack green');
