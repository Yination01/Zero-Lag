/*
 * Google Play candidate Android App Bundle workflow contract.
 *
 * The workflow makes a reviewable AAB and GitHub prerelease asset. It never
 * submits to Google Play, because public policy, account, and Console work
 * remain separate approval gates.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const workflowPath = path.join(ROOT, '.github', 'workflows', 'play-aab.yml');
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

console.log('\n- Google Play candidate AAB workflow -');
check('Google Play candidate AAB workflow exists', fs.existsSync(workflowPath));

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
  'A release candidate must never consume build capacity on every push.');
check('workflow can publish the named candidate asset',
  /^permissions:\s*\n\s*contents:\s*write\s*$/m.test(workflow),
  'The candidate prerelease step needs contents: write.');
check('build number is required at dispatch',
  /build_number:\s*\n(?:.*\n){0,6}\s*required:\s*true\b/m.test(workflow),
  'The manual form must require a build number.');
check('build number rejects malformed values and reserves Build 12 or higher',
  /\^\[0-9\]\+\$/.test(workflow)
    && /BUILD_N\s*<\s*12/.test(workflow),
  'Build 11 is allocated to the preview APK, so candidate builds begin at 12.');
check('existing candidate tag fails closed before build work',
  /git\s+ls-remote\s+--exit-code\s+--tags\s+origin/.test(workflow)
    && /play-candidate-\$\{BUILD_N\}/.test(workflow),
  'A rerun must never overwrite a candidate release.');
check('EXPO_TOKEN is required before any dependency or build work',
  /-z\s+"\$EXPO_TOKEN"/.test(workflow)
    && /EXPO_TOKEN/.test(workflow)
    && inOrder('Fail closed if EXPO_TOKEN is not configured', 'Install exact locked dependencies'),
  'A missing Expo secret must stop before dependency or build work.');
check('workflow uses the locked dependencies and full source gate',
  /\brun:\s*npm ci\b/.test(workflow)
    && /\brun:\s*npm test\b/.test(workflow),
  'The AAB must come from the dependency tree that passed the source gate.');
check('test gate runs before build metadata is stamped',
  inOrder('Run the source gate', 'Stamp this named Play candidate'),
  'Tracked configuration must pass tests before CI adds transient metadata.');
check('build metadata is transient and does not mutate Android versionCode',
  /extra\.buildNumber\s*=\s*buildNumber/.test(workflow)
    && !/versionCode\s*=/.test(workflow),
  'CI must not silently change Android versionCode.');
check('GitHub runner has Expo and cached Gradle prerequisites',
  /expo\/expo-github-action@v8/.test(workflow)
    && /actions\/cache@v4/.test(workflow)
    && /~\/\.gradle\/caches/.test(workflow)
    && /org\.gradle\.caching=true/.test(workflow),
  'The local EAS executor needs reproducible Expo and Gradle setup.');
check('AAB uses production local EAS rather than the cloud queue',
  /eas\s+build\s+--platform\s+android\s+--profile\s+production\s+--local/.test(workflow)
    && /--output\s+zero-lag\.aab/.test(workflow)
    && !/eas\s+build[^\n]*--no-wait/.test(workflow),
  'The candidate must be a locally produced production AAB.');
check('candidate verifies its nonempty Android App Bundle output',
  /test\s+-s\s+zero-lag\.aab/.test(workflow)
    && /unzip\s+-t\s+zero-lag\.aab/.test(workflow),
  'The job must validate the actual generated bundle before publishing it.');
check('candidate verifies the Android App Bundle signature',
  /jarsigner\s+-verify(?:\s+-certs)?\s+zero-lag\.aab/.test(workflow),
  'A Play candidate must verify its signed AAB before publishing it.');
check('AAB is retained as a GitHub Actions artifact',
  /actions\/upload-artifact@v4/.test(workflow)
    && /zero-lag\.aab/.test(workflow),
  'A successful job must expose the bundle from the workflow run.');
check('AAB is published as a clearly named prerelease candidate',
  /softprops\/action-gh-release@v2/.test(workflow)
    && /tag_name:\s*play-candidate-\$\{\{\s*env\.BUILD_N\s*\}\}/.test(workflow)
    && /prerelease:\s*true/.test(workflow)
    && /files:\s*zero-lag\.aab/.test(workflow),
  'The AAB must be available for a later Play Console upload without claiming a public Play launch.');
check('workflow stops at the candidate artifact and never submits to Google Play',
  !/\beas\s+submit\b/i.test(workflow)
    && !/fastlane\s+supply\b/i.test(workflow),
  'Public-policy, Console, and account gates must be completed before submission.');
check('source gate, stamp, production build, artifact, and candidate release are ordered',
  inOrder(
    'Run the source gate',
    'Stamp this named Play candidate',
    'Build Play candidate AAB on this GitHub runner',
    'Upload AAB workflow artifact',
    'Publish Play candidate release asset',
  ),
  'The candidate can publish only after a passing source gate and local AAB build.');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) {
  console.log('Google Play candidate AAB workflow gate FAILED');
  process.exit(1);
}
console.log('Google Play candidate AAB workflow gate green');
