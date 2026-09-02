// Dependency reproducibility gate. Preview builds must use the exact source
// dependency tree that passed the local suite, rather than resolving moving
// semver ranges during every GitHub Actions run.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
let passed = 0;
let failed = 0;

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }
  failed += 1;
  console.log(`  XX  ${name}${detail ? ` - ${detail}` : ''}`);
}

function sameEntries(expected = {}, actual = {}) {
  const expectedKeys = Object.keys(expected).sort();
  const actualKeys = Object.keys(actual).sort();
  return expectedKeys.length === actualKeys.length
    && expectedKeys.every((key, index) => key === actualKeys[index] && expected[key] === actual[key]);
}

console.log('\n- dependency lock -');
const lockPath = path.join(ROOT, 'package-lock.json');
check('package-lock.json exists', fs.existsSync(lockPath));

if (fs.existsSync(lockPath)) {
  try {
    const manifest = readJson('package.json');
    const lock = readJson('package-lock.json');
    const rootPackage = lock.packages?.[''];
    check('package lock has a supported lockfile version', Number.isInteger(lock.lockfileVersion) && lock.lockfileVersion >= 2);
    check('package lock names this app', lock.name === manifest.name, `${lock.name} !== ${manifest.name}`);
    check('package lock root dependencies match package.json', sameEntries(manifest.dependencies, rootPackage?.dependencies));
    check('package lock root dev dependencies match package.json', sameEntries(manifest.devDependencies, rootPackage?.devDependencies));
  } catch (error) {
    check('package-lock.json parses', false, error instanceof Error ? error.message : String(error));
  }
}

const workflowPath = path.join(ROOT, '.github', 'workflows', 'apk.yml');
check('manual APK workflow installs from the lockfile',
  fs.existsSync(workflowPath) && /\brun:\s*npm ci\b/.test(fs.readFileSync(workflowPath, 'utf8')));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
console.log('dependency-lock green');
