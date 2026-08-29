/**
 * The eight hard rules must stay stated in the files an agent might read.
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

console.log('\n- agent hard rules -');
const claude = read('CLAUDE.md');
const agents = read('AGENTS.md');

ok('CLAUDE.md has a Hard rules section', /## Hard rules/.test(claude));
ok('AGENTS.md points at it', /Hard rules/.test(agents));
ok('AGENTS.md lists all eight', /1\./.test(agents) && /2\./.test(agents) && /8\./.test(agents));

ok('rule 1 requires the build number in the user message',
  /named in the user's own\s+message this turn/i.test(claude));
ok('rule 1 names APK, EAS, and Actions',
  /APK/i.test(claude) && /EAS/i.test(claude) && /Actions/i.test(claude));
ok('AGENTS.md restates the APK rule', /APK/i.test(agents));

ok('rule 2 requires a questionnaire', /discrete options, never an\s*\n?open essay/i.test(claude));
ok('rule 2 requires a recommendation on EVERY question',
  /explicit\s+RECOMMENDED option/i.test(claude));
ok('rule 2 fires on uncertainty', /If you are unsure, ask/i.test(claude));
ok('AGENTS.md carries the uncertainty trigger', /unsure/i.test(agents));

ok('rule 3 puts the failing check first', /failing check first/i.test(claude));
ok('rule 4 requires mutation testing', /Break the real code/i.test(claude));
ok('rule 4 bans git checkout as a restore', /never `git checkout`/i.test(claude));
ok('rule 5 bans pinning an exact user-facing string', /exact user-facing string/i.test(claude));
ok('rule 6 requires a fresh npm test', /npm test/i.test(claude));
ok('rule 6 requires naming what stayed unverified', /NOT verified/i.test(claude));

ok('rule 7 states the commit identity exactly',
  /Yination01 <johnpaulonovo@gmail\.com>/.test(claude));
ok('rule 7 uses Admin as the viewer-facing word',
  /viewer-facing word is \*\*Admin\*\*|viewer word is \*\*Admin\*\*|The viewer-facing word is \*\*Admin\*\*/i.test(claude)
  || /viewer-facing word is \*\*Admin\*\*/.test(claude)
  || /The viewer-facing word is \*\*Admin\*\*/.test(claude));
ok('rule 7 does not make Superuser a product role',
  !/Superuser is a\s*\n?real role/i.test(claude));
ok('AGENTS.md names Admin', /Admin/.test(agents));

ok('rule 8 states gates fail closed', /fail \*\*closed\*\*|Gates fail closed|fail closed/i.test(claude));
ok('rule 8 says missing secrets mean shut', /missing secrets mean shut|Absent config means shut|empty secrets mean shut/i.test(claude));
ok('rule 8 says there is no live host until one is named',
  /no live host/i.test(claude));
ok('AGENTS.md carries fail closed', /fail closed/i.test(agents));

ok('docs/DECISIONS.md exists', exists('docs/DECISIONS.md'));
ok('SITEMAP.md exists', exists('SITEMAP.md'));
ok('DESIGN.md exists', exists('DESIGN.md'));
ok('.build-state.json exists', exists('.build-state.json'));
ok('AGENTS.md links DECISIONS.md', /DECISIONS\.md/.test(agents));
ok('CLAUDE.md links DECISIONS.md', /DECISIONS\.md/.test(claude));
ok('docs/poise-architecture.json is marked as a reference',
  exists('docs/poise-architecture.json') &&
  /REFERENCE ONLY/.test(read('docs/poise-architecture.json')));

const STUBS = [
  'GEMINI.md', '.cursorrules', '.clinerules', '.windsurfrules',
  '.github/copilot-instructions.md', 'llms.txt', 'CONTRIBUTING.md',
];
const blind = STUBS.filter((f) => exists(f) && !/CLAUDE\.md/.test(read(f)));
ok('every agent entry point points at CLAUDE.md', blind.length === 0, blind.join(', '));

const RULE_FILES = ['CLAUDE.md', 'AGENTS.md'];
const dashed = RULE_FILES.filter((f) => /[\u2014\u2013]/.test(read(f)));
ok('the rules obey their own dash ban', dashed.length === 0, dashed.join(', '));

ok('.build-state.json lastBuild is null until a named dispatch',
  exists('.build-state.json') && (() => {
    const st = JSON.parse(read('.build-state.json'));
    // Pre-dispatch: null. Post-dispatch: an object that must carry a build
    // number so no silent/unnamed build can be recorded.
    if (st.lastBuild === null) return true;
    return typeof st.lastBuild === 'object' &&
      typeof st.lastBuild.number === 'string' &&
      st.lastBuild.number.length > 0;
  })(), 'lastBuild must be null or an object naming a build number');

console.log('\n' + pass + ' passed, ' + fails.length + ' failed');
if (fails.length) { console.log('agent hard rules FAILED'); process.exit(1); }
console.log('agent hard rules green');
