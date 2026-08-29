/**
 * Agent-docs audit for Zero-Lag.
 *
 * Proves the catalog and quality bar still parse, still count what their
 * metadata claims, and that every entrypoint points at the same law.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const failures = [];

function ok(name, cond, got = '') {
  if (cond) { pass++; console.log(`  ok  ${name}`); }
  else {
    fail++;
    const l = `${name}${got ? ` - ${got}` : ''}`;
    failures.push(l);
    console.log(`  XX  ${l}`);
  }
}
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

console.log('\n- agent entrypoints -');
const ENTRYPOINTS = [
  'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules', '.clinerules',
  '.windsurfrules', '.github/copilot-instructions.md', 'CONTRIBUTING.md',
  'llms.txt', 'DESIGN.md', 'SITEMAP.md', '.agent/master-skills.json',
  '.agent/quality-bar.json', '.agent/agent-pack.json',
];
for (const f of ENTRYPOINTS) ok(`${f} exists`, exists(f));

console.log('\n- skills catalog -');
let skills = null;
try {
  skills = JSON.parse(read('.agent/master-skills.json')).master_skill_compilation;
  ok('master-skills.json parses', true);
} catch (e) {
  ok('master-skills.json parses', false, e.message);
}

if (skills) {
  const all = Object.values(skills.categories).flat();
  const names = all.map((s) => s.name);
  ok('total_skills matches the catalog', all.length === skills.total_skills,
    `counted ${all.length}, meta says ${skills.total_skills}`);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  ok('no duplicate skill names', dupes.length === 0, dupes.join(', '));
  const LEGAL = ['yes', 'on-request', 'n-a-this-stack'];
  const untagged = all.filter((s) => !LEGAL.includes(s.applies_to_project));
  ok('every skill carries a valid applies_to_project flag',
    untagged.length === 0, untagged.map((s) => s.name).join(', '));
  const unexplained = all.filter((s) => !s.project_note);
  ok('every skill explains its flag', unexplained.length === 0,
    unexplained.map((s) => s.name).join(', '));
  ok('poise_integration block present', !!skills.poise_integration);
  if (skills.poise_integration && skills.poise_integration.counts) {
    const declared = Object.values(skills.poise_integration.counts).reduce((a, b) => a + b, 0);
    ok('poise_integration counts add up to the catalog',
      declared === all.length, `declared ${declared}, counted ${all.length}`);
  }
  const agents = read('AGENTS.md');
  const referenced = [...agents.matchAll(/`([a-z0-9-]{4,})`/g)].map((m) => m[1]);
  const looksLikeSkill = referenced.filter((r) => r.includes('-') && !r.includes('.') && !r.includes('/'));
  const ghosts = [...new Set(looksLikeSkill)].filter((r) => {
    if (names.includes(r)) return false;
    return /^(systematic|structured|test-driven|verification|subagent|design-taste|vercel-security|ux-writing|writing-plans|receiving-code|requesting-code|dispatching-parallel|using-superpowers|executing-plans|agent-browser|extract-design|tailwind-design|redesign-existing|sleek-design|ui-ux|memory-leak|docs-update|docs-audit|feat-dev|agent-reproduce|e2e-testing|prepare-pr|create-issue|openwork-desktop|design-an|marketing-|pricing-|page-cro|ad-creative|internal-comms|just-scrape|qwen-code|desktop-pet|arena-ai|resume-ats|interview-prep|notion-research|vibe-coding|grill-me|writing-skills|handoff|brainstorming|prototype|research|bugfix|social|ads|copywriting|figma-use)/.test(r);
  });
  ok('every skill named in AGENTS.md exists in the catalog',
    ghosts.length === 0, ghosts.join(', '));
  const na = all.filter((s) => s.applies_to_project === 'n-a-this-stack').map((s) => s.name);
  const table = agents.split('## Which skill, when')[1] || '';
  const routed = na.filter((n) => table.includes('`' + n + '`'));
  ok('no n-a-this-stack skill sits in the routing table',
    routed.length === 0, routed.join(', '));
}

console.log('\n- quality bar -');
let bar = null;
try {
  bar = JSON.parse(read('.agent/quality-bar.json'));
  ok('quality-bar.json parses', true);
} catch (e) {
  ok('quality-bar.json parses', false, e.message);
}
if (bar) {
  const items = Object.values(bar.categories).flat();
  ok('total_items matches the list', items.length === bar.meta.total_items,
    `counted ${items.length}, meta says ${bar.meta.total_items}`);
  ok('how_agents_use_this present',
    Array.isArray(bar.how_agents_use_this) && bar.how_agents_use_this.length > 0);
  ok('stack_exclusions present and explained',
    !!bar.stack_exclusions && Array.isArray(bar.stack_exclusions.items) &&
    bar.stack_exclusions.items.every((x) => x.item && x.reason));
}

console.log('\n- entrypoints delegate, not duplicate -');
{
  const STUBS = ['.cursorrules', '.clinerules', '.windsurfrules', 'GEMINI.md', '.github/copilot-instructions.md'];
  for (const f of STUBS) {
    if (!exists(f)) continue;
    const t = read(f);
    ok(`${f} points at AGENTS.md and CLAUDE.md`,
      t.includes('AGENTS.md') && t.includes('CLAUDE.md'));
    ok(`${f} stays a stub (under 60 lines)`,
      t.split('\n').length < 60, `${t.split('\n').length} lines`);
  }
  for (const f of ['AGENTS.md', 'CLAUDE.md', 'llms.txt', 'CONTRIBUTING.md']) {
    const t = read(f);
    ok(`${f} references the skills catalog`, t.includes('.agent/master-skills.json'));
    ok(`${f} references the quality bar`, t.includes('.agent/quality-bar.json'));
  }
  if (bar) {
    const v = bar.meta.list_version;
    for (const f of ['AGENTS.md', 'CLAUDE.md', 'llms.txt', 'CONTRIBUTING.md']) {
      ok(`${f} cites quality-bar v${v}`, read(f).includes(`v${v}`));
    }
  }
  if (skills) {
    ok('AGENTS.md cites the catalog version', read('AGENTS.md').includes(skills.version));
  }
}

console.log('\n- house style -');
{
  const scope = [
    'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'CONTRIBUTING.md', 'DESIGN.md',
    'SITEMAP.md', 'llms.txt', '.cursorrules', '.clinerules', '.windsurfrules',
    '.github/copilot-instructions.md', '.agent/master-skills.json',
    '.agent/quality-bar.json', '.agent/agent-pack.json',
  ];
  const dirty = scope.filter((f) => exists(f) && /[\u2014\u2013]/.test(read(f)));
  ok('no em-dash or en-dash in agent-facing docs', dirty.length === 0, dirty.join(', '));
}

{
  const { execSync } = require('child_process');
  const GOOD_EMAIL = 'johnpaulonovo@gmail.com';
  let authors = '';
  try {
    authors = execSync('git log -1 --format=%ae', { cwd: ROOT, encoding: 'utf8' });
  } catch { authors = ''; }
  if (authors) {
    ok('the deploying identity is documented in AGENTS.md',
      read('AGENTS.md').includes(GOOD_EMAIL));
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log('  x ' + f));
  process.exit(1);
}
console.log('agent-docs green');
