/*
 * GitHub-preview APK workflow contract.
 *
 * Zero-Lag uses the local EAS executor on a GitHub Ubuntu runner, matching
 * the proven Poise delivery path without using the EAS cloud queue. This
 * static gate protects the delivery guarantees before a named build is run.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const workflowPath = path.join(ROOT, '.github', 'workflows', 'apk.yml');
let passed = 0;
let failed = 0;

function check(label, condition, hint = '') {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${label}`);
    return;
  }
  failed += 1;
  console.log(`  XX  ${label}${hint ? `\n        ${hint}` : ''}`);
}

console.log('\n- GitHub preview APK workflow -');
check('APK workflow exists', fs.existsSync(workflowPath));

if (!fs.existsSync(workflowPath)) {
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(1);
}

const workflow = fs.readFileSync(workflowPath, 'utf8');
const position = (needle) => workflow.indexOf(needle);
const inOrder = (...needles) => needles
  .map(position)
  .every((item, index, items) => item >= 0 && (index === 0 || items[index - 1] < item));

check('workflow is manual only',
  /^on:\s*\n\s*workflow_dispatch:/m.test(workflow)
    && !/^\s*(push|pull_request|schedule):/m.test(workflow),
  'Preview delivery must not consume build capacity on every push.');
check('workflow can publish the named prerelease asset',
  /^permissions:\s*\n\s*contents:\s*write\s*$/m.test(workflow),
  'The release step needs contents: write.');
check('build number is required at dispatch',
  /build_number:\s*\n(?:.*\n){0,6}\s*required:\s*true\b/m.test(workflow),
  'The manual form must require a build number.');
check('build number rejects non-digits and reserves the next Zero-Lag number',
  /\^\[0-9\]\+\$/.test(workflow)
    && /BUILD_N\s*<\s*10/.test(workflow),
  'Reject malformed values and do not let the queued Build 9 be reused.');
check('existing preview tag fails closed before the build',
  /git\s+ls-remote\s+--exit-code\s+--tags\s+origin/.test(workflow)
    && /preview-\$\{BUILD_N\}/.test(workflow),
  'A rerun must never overwrite an existing preview tag.');
check('EXPO_TOKEN is required before any dependency or build work',
  /-z\s+"\$EXPO_TOKEN"/.test(workflow)
    && /EXPO_TOKEN/.test(workflow)
    && inOrder('Fail closed if EXPO_TOKEN is not configured', 'Install exact locked dependencies'),
  'A missing secret must stop the job before build work.');
check('workflow uses the exact locked dependency tree and source gate',
  /\brun:\s*npm ci\b/.test(workflow)
    && /\brun:\s*npm test\b/.test(workflow),
  'The APK must be built from the dependency tree that passed the test gate.');
check('test gate runs before build metadata is stamped',
  inOrder('Run the source gate', 'Stamp this named preview build'),
  'Stamping must follow the tests so the tracked app config stays source truth.');
check('stamp writes only this build metadata, not Android versionCode',
  /extra\.buildNumber\s*=\s*buildNumber/.test(workflow)
    && !/versionCode\s*=/.test(workflow),
  'Build metadata is transient. Android versionCode must not be changed in CI.');
check('GitHub runner has Expo and cached Gradle prerequisites',
  /expo\/expo-github-action@v8/.test(workflow)
    && /actions\/cache@v4/.test(workflow)
    && /~\/\.gradle\/caches/.test(workflow)
    && /org\.gradle\.caching=true/.test(workflow),
  'The local EAS executor needs the Expo CLI and reproducible Gradle setup.');
check('APK uses local EAS, not the EAS cloud queue',
  /eas\s+build\s+--platform\s+android\s+--profile\s+preview\s+--local/.test(workflow)
    && /--output\s+zero-lag\.apk/.test(workflow)
    && !/eas\s+build[^\n]*--no-wait/.test(workflow),
  'The build must run on GitHub Ubuntu and write the named APK locally.');
check('APK is retained as a GitHub Actions artifact',
  /actions\/upload-artifact@v4/.test(workflow)
    && /zero-lag\.apk/.test(workflow),
  'A successful job must expose its APK from the workflow run.');
check('APK is published as a numbered GitHub prerelease asset',
  /softprops\/action-gh-release@v2/.test(workflow)
    && /tag_name:\s*preview-\$\{\{\s*env\.BUILD_N\s*\}\}/.test(workflow)
    && /prerelease:\s*true/.test(workflow)
    && /files:\s*zero-lag\.apk/.test(workflow),
  'A successful job must publish a stable preview-N release asset.');
check('source gate, stamp, local build, artifact, and release are ordered',
  inOrder(
    'Run the source gate',
    'Stamp this named preview build',
    'Build installable APK on this GitHub runner',
    'Upload APK workflow artifact',
    'Publish preview release asset',
  ),
  'The artifact and release must only follow a passing local build.');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) {
  console.log('GitHub preview APK workflow gate FAILED');
  process.exit(1);
}
console.log('GitHub preview APK workflow gate green');
