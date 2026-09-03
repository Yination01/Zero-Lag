# Zero-Lag decisions

A rule that lives only in conversation will be violated. Write it here
the day it is made, and put a check beside it.

## 2026-08-29: standing AI law, Expo intent, no scaffold

- Stack intent is Expo / React Native Android, same shape as Poise.
- No APK / EAS / Actions build unless the user names the number in that turn.
- Commit identity is `Yination01 <johnpaulonovo@gmail.com>`.
- Budget zero. No live host until named. Missing secrets mean shut.
- Viewer-facing word is Admin. Superuser is not a product role here.
- Install agent law plus `docs/poise-architecture.json` as a Poise
  reference. Do not copy Poise hosts, amounts, or package names blindly.
- Do not scaffold the Expo app, and do not add `apk.yml`, until named.

Check: `.audit/agent-rules.cjs` and `.audit/agent-docs.cjs`.

## 2026-08-29: native prototype archived, Expo plan drafted, no scaffold

- The early native Kotlin/Compose prototype predates the stack law. It is
  moved to `docs/kotlin-reference/` as a behavior spec to port. It is not
  shipping code and the repo reads as not scaffolded.
- Shipping stack stays Expo / React Native Android. Do not scaffold or run
  prebuild until the maintainer names that work.
- Plan for the port lives in `docs/EXPO_PLAN.md`. First code is the pure TS
  readiness math, test first, no device needed.
- No APK / EAS / Actions build. `.build-state.json` lastBuild stays null
  until a build number is named in the turn that dispatches it.

Check: `npm test` (agent-docs and agent-rules both green this turn).

## 2026-08-29: Expo app scaffolded, engine TDD, native plugins drafted

- The user named the scaffold work. Expo / React Native Android source now
  exists: `App.tsx`, `src/net`, `src/ui`, `src/state`, `app.json`, `eas.json`.
- Design tokens are locked in `DESIGN.md` and `src/ui/theme.ts`. No hardcoded
  hex in screens.
- Readiness math and the RTT probe are pure TS, written failing test first,
  with a mutation kill confirmed. 15 app tests green.
- Native telephony (`plugins/zerolag-net`) and the floating HUD
  (`plugins/zerolag-hud`) are drafted as Kotlin plus an Expo config plugin.
  They compile only during a prebuild / EAS build and are NOT verified until
  a build runs on a device.
- No APK / EAS / Actions build was dispatched. `.build-state.json`
  lastBuild stays null until the user names a build number in that turn.

Check: `npm test` (agent-docs 52, agent-rules 34, app tests 15, all green).

## 2026-08-29: Build 1 named, dispatched locally

- The maintainer named the first build: Build 1. versionName 0.1.0,
  versionCode 1, EAS profile preview, artifact APK, channel local.
- `.build-state.json` lastBuild records build-1. The audit now accepts a
  documented post-dispatch object that carries a build number, and still
  rejects a missing-number state.
- The APK is cut on the maintainer machine (Expo/EAS or Android Studio),
  not in the authoring sandbox, which has no Android SDK or EAS token.
  Compilation and device behaviour are NOT verified here.

Check: `npm test` after this edit.

## 2026-08-29: scope confirmed, game and boost and device engines built

- Maintainer confirmed the full feature set. Truth table lives in
  docs/SCOPE.md. Android blocks silent background-app killing, overclocking
  and signal boosting, so those ship as guided/estimated equivalents only.
- Built and tested: game catalog with per-game headline metric, device
  tier and tuning profiles, boost action catalog with permission gating.
  35 app tests green, mutation kills confirmed.
- Added Game, Boost, Device screens and a four-tab shell. Native sources
  for foreground detection and device facts added plus a native-package
  config plugin. All native code compiles only at prebuild and is NOT
  verified until a device build runs.
- Background analytics stay local until a host is named. No host named.

Check: npm test (agent-docs 52, agent-rules 34, app tests 35, all green).

## 2026-08-29: onboarding, legal, accounts/guests, game bar, EAS workflow

- First launch flow added: legal consent (terms, privacy, EULA), then guest
  or account, then permissions. Guests have full unrestricted access. An
  account is optional and local only until a backend host is named; cloud
  sync is off (CLOUD_SYNC_AVAILABLE false).
- Legal documents added under docs/legal/ and shown in-app. Drafts, not a
  substitute for legal review before Play launch.
- Every Boost action now states exactly what it does and why it works, and
  an honesty test fails the build on claims Android cannot deliver.
- Game bar overlay upgraded to show live ping and used RAM on the floating
  pill and in the ongoing notification. Native, verified only at a device build.
- GitHub Actions workflow .github/workflows/apk.yml added. It is manual
  only, requires a build number typed at dispatch, and fails closed without
  EXPO_TOKEN. No workflow run dispatched this turn.

Check: npm test (agent-docs 52, agent-rules 34, app tests 56, all green).
## 2026-08-29: legal pack, Nigeria courts, placeholder contact

- TERMS.md, PRIVACY.md, COPYRIGHT.md, COMPLIANCE.md, PLAY_DATA_SAFETY.md
  and LICENSE land on this branch. They describe the built app (ping,
  HUD, Usage Access, guided boosts), not Poise.
- Governing law is Nigeria. Disputes go to courts. No arbitration.
- Age floor is 13. Licence is all rights reserved, not MIT.
- Legal contact is the placeholder `legal-contact-placeholder@example.com`
  until a real inbox is named. Do not invent a domain we do not own.
- This pack is not legal advice. `.audit/legal.cjs` fails if booster
  lies, a fake inbox, or em-dashes return.

Check: `npm test` including `.audit/legal.cjs`.

## 2026-08-29: local native packages use React Native autolinking

- `@zerolag/net`, `@zerolag/device`, and `@zerolag/hud` are root `file:`
  dependencies. Each provides an Android library, manifest, and standard
  React Native autolinking metadata.
- The generated Android app receives the three `ReactPackage` classes from
  React Native autolinking. The old hand-written MainApplication injector is
  removed, preventing duplicate registration and unresolved local sources.
- The HUD manifest plugin remains, because its overlay service and special-use
  foreground-service declaration are app configuration, not package discovery.
- No APK / EAS / Actions build was dispatched. Native compilation and device
  behavior remain unverified until a named build runs.

Check: `npm test`, including `src/native/autolinking.test.ts`.

## 2026-08-29: typed native bridges and compile gate

- App source uses typed bridge modules in `src/plugins/`, not unresolved paths
  into the native-plugin directory. The bridges treat absent, denied, malformed,
  and failed native reads conservatively.
- The HUD bridge now exports the `hud` controller consumed by Boost, so the
  game-bar controls resolve at bundle time and do not dereference an absent
  named export.
- `npm test` now runs `tsc --noEmit` before its runtime tests. This prevents
  unresolved source imports and unsafe storage-driver shapes from reaching an
  Android build.
- No APK / EAS / Actions build was dispatched. Native behavior still needs a
  named Android build and real-device check.

Check: `npm test`, `npx expo export --platform android`, and bridge tests.

## 2026-09-01: Build 3 dispatched to EAS preview

- The maintainer named Build 3 in the dispatch turn. The GitHub Actions
  preview APK workflow was dispatched from commit `c9e97f8` with input
  `build-3`.
- The workflow run is `33451734687`. Its checkout, named-build gate,
  EXPO_TOKEN gate, dependency install, and test gate passed. EAS accepted the
  project upload but rejected the build request because the Free-plan Android
  quota was still exhausted. It reported a reset in about one hour.
- `.build-state.json` records the build number, source commit, UTC dispatch
  time, workflow URL, and submission failure. The Android versionCode remains
  unchanged. No APK was created.
- A new user-named retry is required after the EAS reset. A real Android device
  still must verify telephony, Usage Access, overlay, foreground service,
  notifications, and game detection after an APK exists.

Check: GitHub Actions run `33451734687`, then a newly named EAS retry and device test.

## 2026-09-01: Build 3 retry errored after EAS acceptance

- The maintainer explicitly named a Build 3 retry. GitHub Actions workflow
  `33453738183` ran from commit `f693008` with the `build-3` and `preview`
  inputs, and completed successfully.
- This retry follows workflow `33451734687`, which reached EAS but was rejected
  before an APK existed. The retry passed checkout, named-build and EXPO_TOKEN
  gates, dependency install, the full test gate, and EAS project upload.
- EAS accepted the retry as Build `7cebb8e9-8786-4fb8-b9a0-dba77147642f` at
  `2026-09-01T00:12:21Z`, then its public build page reported `Errored`. The
  internal-distribution route confirms that no APK artifact exists. The GitHub
  workflow used `--no-wait`, so its success proves EAS submission rather than
  EAS build completion.
- The detailed failure log is restricted to the Expo account. It cannot be read
  from this sandbox because the Expo credential is stored only as a GitHub
  Actions secret. The root cause must not be guessed from the workflow result.
- `.build-state.json` records the prior workflow as retry context, the successful
  workflow, EAS build ID and URL, and the EAS errored status. A real Android
  device test remains required only after a successful APK installation.

Check: GitHub Actions run `33453738183`, EAS Build `7cebb8e9-8786-4fb8-b9a0-dba77147642f`, detailed EAS log, then device test.

## 2026-09-01: Build 3 EAS failures diagnosed and corrected in source

- The protected EAS log showed two separate prebuild blockers. Expo Doctor
  rejected `expo.newArchEnabled` as an additional `app.json` property for this
  SDK 51 project. The property is removed.
- The HUD config plugin addressed `cfg.modResults` as though `application` were
  at its top level. Expo Android manifest mods instead place it under
  `cfg.modResults.manifest`. The plugin now transforms that nested manifest,
  verifies an application element exists, and adds the HUD service and required
  permissions idempotently.
- `src/native/hud-config-plugin.test.ts` covers the nested manifest shape,
  required service and permissions, idempotence, and the rejected config field.
  A manifest-root mutant and a reintroduced-config-field mutant both failed the
  named checks, then the copied backups were restored byte-for-byte.
- Local Expo Doctor now passes its app-config schema check. Its only remaining
  advisory is the repository's pre-existing absence of a package lockfile. No
  dependency versions or lockfile were changed as part of this focused fix.
- No new EAS or APK build was started for this source correction. It is not in
  an APK, and Android compilation plus real-device behaviour remain unverified
  until the maintainer names another build.

Check: Node 22 `npm test` with 66 app tests, and verbose Expo Doctor app-config
schema check. A named EAS APK build and Android device test remain required.

## 2026-09-01: Build 4 reached Gradle and revealed the net-module type error

- The maintainer explicitly named Build 4 for an EAS preview APK. GitHub Actions
  workflow `33455409072` ran from source correction commit `4de4432` with the
  `build-4` and `preview` inputs, and completed successfully.
- The workflow passed checkout, named-build and EXPO_TOKEN gates, dependency
  install, the full test gate, EAS CLI install, and EAS project upload. EAS
  accepted Build `46faa278-da3a-4cd0-926f-9e847d344a61` at
  `2026-09-01T00:37:04Z`.
- EAS passed Expo Doctor and Android prebuild, confirming that the prior app
  config and HUD-manifest defects no longer blocked the build. It then failed at
  `:zerolag_net:compileReleaseKotlin` with a concrete Android API type error.
- `getForegroundPackage` constructed `UsageEvents`, which is an event collection,
  then supplied it to `getNextEvent`. The Android API requires one
  `UsageEvents.Event` object, which owns `eventType` and `packageName`. The code
  now constructs `UsageEvents.Event` instead.
- `src/native/usage-events.test.ts` asserts that the declared event is passed to
  `getNextEvent`, exposes the needed event fields, and is not a collection. A
  collection-constructor mutant failed the named test, then a copied backup was
  restored byte-for-byte.
- No APK exists and this source correction has not had another EAS or local
  Android compilation. Android compilation plus real-device behaviour remain
  unverified until the maintainer names another build.

Check: Node 22 `npm test`, EAS Build `46faa278-da3a-4cd0-926f-9e847d344a61`, then a newly named EAS APK build and device test.

## 2026-09-01: Build 5 exposed a missing Android splash color resource

- The maintainer explicitly named Build 5 for an EAS preview APK. GitHub
  Actions workflow `33465572075` ran from commit `b447897` with `build-5`
  and `preview`, and completed successfully.
- The workflow passed checkout, named-build and EXPO_TOKEN gates, dependency
  installation, the full test gate, EAS CLI installation, and EAS project
  upload. EAS accepted Build `7711b779-6cfe-4ab6-8b8b-4a2095755c1e` at
  `2026-09-01T03:16:42.634Z`.
- The protected EAS log proves that the former `zerolag_net` Kotlin failure
  no longer stopped Gradle. The new terminal task was
  `:app:processReleaseResources`.
- Android resource linking failed because generated `drawable/splashscreen.xml`
  references `@color/splashscreen_background`, while the generated color
  resources contained no `splashscreen_background` entry. The app config had
  no explicit supported top-level `splash.backgroundColor`.
- The focused correction adds `splash.backgroundColor` as `#0A0F14` to
  `app.json`. A baseline isolated Expo prebuild reproduced the broken drawable
  reference without the color resource. The corrected isolated prebuild emits
  the matching color entry, so the generated resource link is now valid.
- `src/native/splash-config.test.ts` was written failing first against the
  absent configuration. The source correction makes it pass. Removing the
  splash config as a mutant failed the named test, then a copied app config
  backup was restored byte-for-byte. The check protects the explicit supported
  config that feeds the Android splash resource generator.
- No APK exists and no later EAS build has been started for this source
  correction. Android compilation after this resource change, APK
  installation, and real-device native behaviour remain unverified until the
  maintainer names another build.

Check: protected EAS Build `7711b779-6cfe-4ab6-8b8b-4a2095755c1e`, the isolated
Expo Android prebuild resource check, Node 22 `npm test`, then a newly named
EAS APK build and device test.

## 2026-09-01: Build 6 completed the Android preview APK

- The maintainer explicitly named Build 6 for an EAS preview APK. GitHub
  Actions workflow `33501773505` ran from source commit `9ee234f` with
  `build-6` and `preview`, and completed successfully.
- The workflow passed checkout, the named-build and EXPO_TOKEN gates,
  dependency installation, the full test gate, EAS CLI installation, and EAS
  project upload. It accepted EAS Build `c9aaa339-c91f-4061-b6db-06b3448d4c54`
  at `2026-09-01T11:19:04.361Z`.
- EAS completed Android compilation and resource linking at
  `2026-09-01T11:29:09.738Z`. Its logs recorded
  `android/app/build/outputs/apk/release/app-release.apk` as a 59.4 MB
  application archive before upload. This validates the previous
  UsageEvents.Event Kotlin correction and the splash color resource correction
  in an actual cloud Android Gradle build.
- The resulting internal-distribution APK was downloaded as
  `~/Zero-Lag-build-6.apk`, 62,309,425 bytes, SHA-256
  `8f9d6123555399668fa5ab4495bc4386e75dcdbde99335de351bd319f1270ad6`.
  ZIP integrity passed, and the archive contains the Android manifest,
  resources, classes.dex, and native libraries for arm64-v8a, armeabi-v7a,
  x86, and x86_64.
- A real SIM-enabled Android device has not installed this APK. Runtime
  registration, onboarding, permission and overlay flows, Usage Access,
  telephony facts, foreground-game detection, HUD behavior, and real network
  measurements remain unverified until that device test occurs.

Check: GitHub Actions run `33501773505`, EAS Build
`c9aaa339-c91f-4061-b6db-06b3448d4c54`, APK archive checks, and a real Android
device test.

## 2026-09-01: Android special access, HUD status, and network estimates clarified

- Usage access and Display over other apps are launched as Android intents,
  never as URL strings. The HUD first requests the app-specific overlay page
  with `ACTION_MANAGE_OVERLAY_PERMISSION` and its `package:` URI. Every
  special-access flow states what to select in Settings, what to enable, and
  what to do after returning to Zero-Lag.
- The floating HUD has start, stop, and native running-status controls. It
  shows a non-touchable overlay with public-edge delay and used RAM, keeps a
  foreground notification, respects the selected update interval, and stops
  its coroutine when the service is destroyed. A missing or partial native
  bridge fails closed as unavailable instead of promising a broken HUD.
- Usage-event lookup distinguishes denied Usage access from no recent app
  event, skips Zero-Lag itself, and retains enough recent history for a user
  returning from a game. It does not fabricate a game when no supported
  package is found.
- Connection results are described as regional pre-match public-edge estimates.
  Failed HTTP checks are labelled probe failures, not game packet loss. The app
  does not claim exact game-server ping, game routing, UDP behavior, server
  load, frame rate, or in-game packet loss.
- Auto performance selects Battery for entry devices, Balanced for mid-range,
  and Performance for flagship devices. The saved selection changes actual
  readiness sample count and HUD refresh interval. It does not overclock the
  device or change game settings.
- No new APK, EAS build, or Android Gradle build was started for these source
  changes. They are not present in Build 6. Real-device checks of Settings
  routing, overlay permission, foreground notification, HUD visibility and
  status, and Usage-event timing remain required after the maintainer names a
  new build.

Check: Node 22 `npm test`, including `settings.test.ts`, `bridges.test.ts`,
`usage-events.test.ts`, `hud-overlay.test.ts`, `probe.test.ts`, and
`tier.test.ts`; targeted copied-backup mutants; `npx expo export --platform
android`; and isolated Expo Android prebuild/autolinking inspection.

## 2026-09-02: local-only access and recoverable readiness history

- The former local-only email, password, account-creation, and login surface is
  removed. It suggested credentials or an account service that Zero-Lag does
  not provide. There is no backend, cloud backup, account requirement, or
  authentication claim in this release.
- App access is an unrestricted local guest session. A legacy stored value that
  resembles the former account state is not accepted as an authenticated user;
  it returns the person to the current local setup flow instead.
- Consent remains the first required destination. After consent, the local
  start screen truthfully explains that no account is needed. Android runtime
  permissions follow, and the completed onboarding marker prevents the setup
  flow from repeating on every ordinary launch. Damaged local bootstrap data
  fails closed to consent.
- Completed readiness checks are stored in bounded on-device history. Writes
  are serialized, invalid or duplicate local values are rejected, a temporary
  storage read or write can recover on a later local action, completion order
  cannot make an older result appear above a newer timestamp, and an explicit
  no-connection verdict rather than a numeric zero determines no response.
- The app now exposes the compact Home history card and a full History tab. Both
  show local-only retention and allow irreversible local deletion. No history,
  permissions result, or usage data is uploaded as part of this decision.
- HUD controls refresh Android status after returning to the app, ignore stale
  asynchronous status checks after a newer check or confirmed action, avoid
  overlapping operations, provide an app-icon foreground notification with a
  Stop HUD action, and keep wording clear that Zero-Lag or the notification can
  stop the overlay. Native compilation and device behavior for this source are
  still unverified.
- A checked-in npm lockfile now records the dependency graph that passed this
  source gate, and the manual APK workflow uses `npm ci` rather than resolving
  moving dependency ranges on every dispatch. The new audit verifies the lock's
  root package data and the exact-install workflow step.
- The locked Expo 51 and React Native 0.74 toolchain still reports 31 npm audit
  advisories, including one critical transitive advisory. npm's proposed remedy
  is a major Expo and React Native migration, so it is deliberately not applied
  as an unverified automatic patch during this focused release. It needs its own
  compatibility, Android build, and real-device verification work.
- Build 8 remains the most recent finished preview APK and is recorded as
  installed but not device-tested. The maintainer later explicitly superseded
  the manual-only Build 9 route and authorized an agent EAS submission.
- Build 9 was submitted directly to EAS from `477ca5e` after a fresh Node 22
  `npm ci` and full test gate. Its EAS ID is
  `7d6383fb-e857-421a-a1b7-738fd43216b0`; the first authenticated status was
  `IN_QUEUE`. It has no APK, Android compilation result, or device evidence yet.

Check: targeted test-first checks and mutation restores, a clean `npm ci`, the
final Node 22 suite, Android export/config validation, generated-native
inspection, authenticated EAS monitoring, and the manual
`docs/DEVICE_TEST_PLAN.md`.

## 2026-09-02: Poise-style GitHub-local preview delivery

- The maintainer asked for Zero-Lag APK delivery to work like Poise. The manual
  GitHub workflow now runs the EAS local executor on a GitHub Ubuntu runner,
  rather than submitting another job to the EAS cloud queue.
- The workflow requires a numeric preview number of 10 or higher. Build 9 is
  already allocated to the existing EAS job, and the workflow fails before any
  build work if the matching `preview-N` tag already exists. This prevents a
  tag or build-number overwrite.
- It fails closed when `EXPO_TOKEN` is missing, installs with `npm ci`, runs
  `npm test`, then stamps only transient `expo.extra.buildNumber` metadata.
  It never changes Android `versionCode` in CI.
- A successful local build writes `zero-lag.apk`, verifies it is non-empty,
  uploads it as the GitHub Actions artifact, and publishes it as the
  `preview-N` GitHub prerelease asset. Repository access rules control who can
  download either location.
- `.audit/apk-workflow.cjs` statically checks manual-only dispatch, named
  number and tag gates, secret gate, ordering, local EAS mode, Gradle setup,
  artifact upload, and prerelease publication. Targeted mutations removed the
  manual, permission, numeric, tag, secret, metadata, Gradle, local-build,
  artifact, and prerelease guarantees. Each failed its named check, then the
  workflow was restored from a copied backup and checked byte-for-byte.
- No GitHub Actions build was dispatched during this workflow change because
  the maintainer did not name a build number in this turn. Build 9 remains in
  the EAS free-tier queue and has no APK artifact as of the fresh public status
  check. The new GitHub-local path still needs a named manual run and real
  Android device validation.

Check: `node .audit/apk-workflow.cjs`, the copied-backup cloud-mode mutation,
and `npm test` after the workflow audit is included in the source gate.

## 2026-09-02: Build 10 dispatched through the GitHub-local APK route

- The maintainer explicitly named Build 10 in the dispatch turn. Its source cut
  is `48417680f839ec7e80c288ede5a2a1c14adace91`, the Poise-style GitHub-local
  preview-delivery commit.
- A fresh Node 22 `npm test` passed before dispatch, including the 15-check
  workflow contract and all 117 app tests. The source was then pushed to
  `main` as that exact commit.
- GitHub Actions workflow `345554094`, **Preview Zero-Lag APK**, was dispatched
  on `main` with numeric input `10`. GitHub registered run `33688703597` at
  `2026-09-02T22:06:38Z`: [Build 10 workflow run](https://github.com/Yination01/Zero-Lag/actions/runs/33688703597).
  Its initial state is `in_progress` and its recorded head SHA is the source
  cut above.
- The workflow uses the EAS local executor on a GitHub Ubuntu runner. If it
  completes successfully, it will create `zero-lag.apk`, upload a workflow
  artifact, and publish the `preview-10` prerelease asset. It does not submit a
  new job to the EAS cloud queue.
- At this record point there is no terminal Gradle result, GitHub artifact,
  release asset, APK archive evidence, installation, or real-device result.
  The pre-existing separate EAS Build 9 remains queued without an artifact.
- This decision record is post-dispatch evidence only. It is not part of the
  Build 10 source cut and cannot change the APK running in that workflow.

Check: GitHub Actions run `33688703597`, the terminal artifact or failure log,
and `docs/DEVICE_TEST_PLAN.md` after a successful installation.

## 2026-09-02: Build 10 stopped at the Expo secret gate

- GitHub Actions run `33688703597` completed with conclusion `failure` at
  `2026-09-02T22:07:16Z`. Checkout, Node 22 setup, the numeric Build 10 and
  unused-tag checks, and the explicit repository-secret presence check passed.
- The next **Set up Expo and EAS** action ran `eas whoami` and EAS rejected the
  repository `EXPO_TOKEN` secret as invalid. This is a secret configuration
  failure, not a Zero-Lag source, Gradle, Android resource, or APK failure.
- `npm ci`, the workflow source gate, metadata stamp, Gradle setup, local EAS
  build, artifact upload, and GitHub prerelease step were skipped. Therefore no
  `zero-lag.apk`, `preview-10` asset, Android compilation result, or device
  test exists for this run.
- A valid Expo access token must replace the repository Actions `EXPO_TOKEN`
  secret before retrying. The failed run did not create the `preview-10` tag,
  so the same source can be retried only after the maintainer explicitly names
  a Build 10 retry. The unrelated EAS Build 9 remains queued with no artifact.
- The failure is recorded in `.build-state.json` and this post-dispatch record
  is not part of the Build 10 source cut.

Check: [GitHub Actions run 33688703597](https://github.com/Yination01/Zero-Lag/actions/runs/33688703597), a valid repository Expo secret, a newly authorized retry,
and `docs/DEVICE_TEST_PLAN.md` after an APK installs.

## 2026-09-02: Build 10 retry dispatched after Expo-secret correction

- The maintainer explicitly named a **Retry Build 10** after updating the
  repository Expo credential. A fresh Node 22 `npm test` gate passed again
  before the retry.
- GitHub accepted workflow `345554094` dispatch on `main` with numeric input
  `10`. The new GitHub Actions run is `33689536556`, created at
  `2026-09-02T22:16:17Z`: [Build 10 retry workflow run](https://github.com/Yination01/Zero-Lag/actions/runs/33689536556).
- The retry source cut is `1fd1b72cced1d1cf7de859b9b7caf71aebbef767`. Relative
  to the initial Build 10 source cut, it contains only truthful prior-dispatch
  and failure evidence, not an application or workflow behavior change.
- At dispatch time the retry is queued. It will use EAS local build on GitHub
  Ubuntu, and it will only create `zero-lag.apk` plus the `preview-10` release
  asset if its Expo authentication, source gate, and Android build all pass.
- There is not yet a terminal workflow result, Gradle compilation result, APK,
  release asset, installation, or device validation. The unrelated EAS Build 9
  remains queued without an artifact.
- This is post-dispatch evidence only, not part of the retry source cut.

Check: GitHub Actions run `33689536556`, its terminal local EAS output, the
`preview-10` release asset if successful, and `docs/DEVICE_TEST_PLAN.md` after
installation.

## 2026-09-02: Build 10 GitHub-local APK completed

- Build 10 retry GitHub Actions run `33689536556` completed with `success` at
  `2026-09-02T22:25:01Z`. The run retained its `1fd1b72` source cut. Its
  required workflow steps succeeded, including Expo authentication, `npm ci`,
  `npm test`, the transient build stamp, local EAS Android build, APK-output
  check, artifact upload, and prerelease publication.
- The installable release asset is
  [`zero-lag.apk`](https://github.com/Yination01/Zero-Lag/releases/download/preview-10/zero-lag.apk),
  published in the [`preview-10` prerelease](https://github.com/Yination01/Zero-Lag/releases/tag/preview-10).
  It is 62,328,280 bytes and has SHA-256
  `9fdb6e182b055a3dfe9b607d94c97cbba10916c30b1c3ecf71a68dd93c82cc27`.
- A fresh ZIP integrity check passed. The artifact contains `AndroidManifest.xml`,
  `resources.arsc`, `classes.dex`, and native libraries for `arm64-v8a`,
  `armeabi-v7a`, `x86`, and `x86_64`.
- This proves the Poise-style GitHub-local EAS route can compile and publish this
  source without waiting in the EAS cloud queue. It does not prove installation
  or behavior on a real Android device.
- Real-device validation remains outstanding for consent, runtime permissions,
  Usage Access, overlay, foreground notification and Stop action, HUD lifecycle,
  history persistence, foreground-game detection, and network behavior. The
  separate EAS Build 9 job remains queued without an artifact.
- The updated build state and this record are post-build evidence only. They are
  not part of the Build 10 APK source cut.

Check: [Build 10 run 33689536556](https://github.com/Yination01/Zero-Lag/actions/runs/33689536556),
[preview-10 release](https://github.com/Yination01/Zero-Lag/releases/tag/preview-10),
APK SHA-256 and archive checks, then `docs/DEVICE_TEST_PLAN.md` on a real phone.

## 2026-09-02: launcher, adaptive icon, and splash branding source

- The maintainer selected launcher-and-splash scope only, with no in-app logo or
  screen-layout change. The chosen direction is a text-free neon signal-pulse
  mark on the locked `#0A0F14` background, using the Zero-Lag `good` green and
  `info` blue token values.
- `assets/` now retains editable SVG masters plus 1024 by 1024 PNG delivery
  assets: an opaque launcher icon, a transparent Android adaptive-icon
  foreground, and a transparent splash mark. The adaptive artwork is centered
  inside its intended safe area instead of relying on launcher-icon cropping.
- `app.json` binds `zero-lag-icon.png` as the launcher icon,
  `zero-lag-splash.png` as the contain-mode splash image, and
  `zero-lag-adaptive-foreground.png` plus `#0A0F14` as the Android adaptive
  icon configuration. The splash and adaptive surfaces therefore use the same
  locked dark background.
- `src/native/brand-assets.test.ts` was written before the missing config and
  PNG bindings were added. Its initial run failed on the absent launcher-icon
  config and asset. It now checks all required bindings, the locked background,
  PNG signatures, 1024 by 1024 dimensions, and non-placeholder file sizes.
  Nine copied-backup mutations removed or changed each config guarantee,
  reduced each of the three rasters to a placeholder, or changed both dark
  surfaces together. Each failed the intended named check, and every restore
  was byte-for-byte exact.
- Build 10 was cut from `1fd1b72` before this source work. Its published APK
  does not contain this launcher, adaptive icon, or splash image. No new APK
  build, installation, or real-device icon and splash validation has started.
  A newly named build is required to put the branding on a phone.

Check: Node 22 `npm test` passed with all 119 tests, the resolved Expo config
returned all six launcher, splash, and adaptive-icon values, and Android export
bundled successfully. A newly named APK build and real-device cold-start check
remain required.

## 2026-09-03: Build 11 dispatched with launcher and splash branding

- The maintainer explicitly named **Build 11**. The source cut is
  `e77c13ea7927d6fb3fee4f0af00002de023969f8`, which includes the selected
  text-free neon signal-pulse launcher icon, Android adaptive-icon foreground,
  and contain-mode splash image. This is the first named APK build that can
  carry that branding to a phone.
- Before dispatch, a fresh Node 22 `npm ci` and `npm test` gate passed with all
  119 TypeScript app tests plus the documentation, rules, legal, dependency,
  and GitHub-local APK workflow audits. Public preflight confirmed remote
  `main` matched `e77c13e` and `preview-11` did not exist.
- GitHub accepted manual workflow `345554094`, **Preview Zero-Lag APK**, on
  `main` with numeric input `11` at `2026-09-02T23:17:28Z`. It registered
  [run `33694402846`](https://github.com/Yination01/Zero-Lag/actions/runs/33694402846),
  run number 14, from the exact source cut above.
- GitHub initially queued the workflow and then reported it in progress. It will
  use the GitHub-local EAS executor, not the EAS cloud queue. There is no
  terminal Gradle result, APK, prerelease asset, archive check, installation,
  launcher rendering, adaptive mask rendering, splash cold-start result, or
  other real-device evidence yet.
- Build 10 remains the last finished APK. It predates the branding source and
  cannot change after publication. This evidence record is post-dispatch only,
  so it is not part of the Build 11 source cut.

Check: GitHub Actions run `33694402846`, then the `preview-11` release asset,
archive inspection, and a real Android cold-start check after successful
installation.

## 2026-09-03: Build 11 branded preview APK completed

- [Build 11 GitHub Actions run `33694402846`](https://github.com/Yination01/Zero-Lag/actions/runs/33694402846)
  completed with `success` at `2026-09-02T23:22:26Z`, retaining its exact
  `e77c13e` branding source cut. The completed job confirms checkout, Node 22,
  numbered-tag guard, Expo authentication, locked dependency install, full
  source gate, preview stamp, Gradle setup, GitHub-local EAS Android build, APK
  output verification, workflow artifact upload, and prerelease publication.
- The installable result is [`zero-lag.apk`](https://github.com/Yination01/Zero-Lag/releases/download/preview-11/zero-lag.apk),
  published in the [`preview-11` prerelease](https://github.com/Yination01/Zero-Lag/releases/tag/preview-11).
  GitHub reports 62,737,907 bytes. A fresh download has SHA-256
  `d3df918c71ed6b4114880145b87c6cc74df210272240c9b2ebfbeddb18f184db`.
- ZIP integrity passed. The release archive contains `AndroidManifest.xml`,
  `resources.arsc`, `classes.dex`, and native libraries for `arm64-v8a`,
  `armeabi-v7a`, `x86`, and `x86_64`. Its compiled Android resource table also
  contains `ic_launcher`, `ic_launcher_foreground`, `splashscreen_image`,
  `splashscreen_background`, and `expo_splash_screen_resize_mode`, consistent
  with the launcher, adaptive-icon, and splash configuration in the source cut.
- This validates a packaged APK from the new branding source. It does not prove
  launcher cropping or masking on a particular Android launcher, nor splash
  rendering during a real cold start. No person has installed Build 11 or run
  the consent, permissions, HUD, network, history, or other device checks.
- The completion state and this record are post-build evidence only. They are
  not part of the Build 11 APK source cut.

Check: the Build 11 run, prerelease asset, SHA-256, archive inspection, and a
real Android installation with a cold-start launcher and splash check.

## 2026-09-03: Play closed-testing candidate preparation and Build 12 plan

- The maintainer selected a Nigeria, English closed-testing path, authorized
  GitHub Pages as a future policy host, explicitly named Build 12 for one
  production Android App Bundle, and chose source preparation before any Play
  Console action. The maintainer also instructed that the placeholder contact
  remain for now. Therefore no public policy page, Console record, testing
  track, or Play submission may be created in this work.
- Google Play currently requires Android API 36 for new app submissions. The
  source moves in controlled SDK 51 to 52 to 53 to 54 steps, landing on Expo
  54 and React Native 0.81. Expo 54 supports compile and target SDK 36. The
  `expo-build-properties` configuration explicitly applies compile SDK 36,
  target SDK 36, and build tools 36.0.0. Each local native Android library
  inherits the generated values and now carries API 36 fallback values.
- `.github/workflows/play-aab.yml` is a separate manual-only candidate route.
  It accepts a unique numeric Build 12 or higher, fails closed for an existing
  `play-candidate-N` tag or missing Expo secret, installs the lockfile, runs
  the full source gate, stamps only transient metadata, builds the production
  profile locally on GitHub, verifies the AAB ZIP and signature, preserves an
  artifact, and publishes a clearly named candidate release asset. It does not
  submit to Google Play.
- `docs/play/` now holds the blocked readiness record, truthful listing copy,
  authentic screenshot instructions, a non-deployable privacy-policy template,
  and the Console handoff. The 512 by 512 RGB Play icon and 1024 by 500 RGB
  feature graphic are in `assets/play-store/`. No invented app screenshots or
  public contact were created.
- Test-first evidence: the API-contract test initially failed because the
  build-properties configuration was absent; the native fallback test then
  failed at the former API 34 values; the candidate-workflow audit initially
  failed because no workflow existed; its signature check then failed before
  the signature command was added; and the listing-artwork test initially
  failed because both deliverable files were absent. Eleven API and profile
  mutants, six artwork mutants, and eighteen AAB-workflow mutants all failed
  their intended named checks. Copied backups were restored byte-for-byte.
- A fresh production-dependency audit now reports 16 advisories: 7 moderate,
  9 high, and no critical. The available remediation requires a major Expo 57
  upgrade. It is deliberately not forced into this API 36 release candidate.
- Build 11 remains the last finished APK and predates this Expo 54 and API 36
  source work. Build 12 must use the pushed final source only after the full
  source and Expo checks pass. A successful candidate AAB will still not make
  the app Play ready without a real contact, public policy URL, Console work,
  authentic screenshots, and real-device results.

Check: fresh Node 22 `npm ci` and `npm test` passed all 123 app tests plus all
seven source audits. Expo Doctor passed 18 of 18 checks, the resolved Expo
configuration returned compile SDK 36, target SDK 36, and build tools 36.0.0,
and Android export bundled successfully. Source commit and push, then the
user-named Build 12 candidate workflow and artifact inspection remain.

## 2026-09-03: Build 12 API 36 Play candidate dispatched

- The maintainer explicitly named Build 12 for the approved production Android
  App Bundle candidate route. The source cut is
  `df205cf58f061cea4a608d6a53a84413f3b8fd7e`, containing the Expo 54,
  React Native 0.81, explicit Android API 36, store-artwork, documentation,
  source-gate, and no-submit workflow preparation.
- Before dispatch, a fresh Node 22 source gate passed all 123 tests, including
  the 18-check candidate workflow gate. Expo Doctor passed 18 of 18 checks;
  resolved Expo configuration confirmed compile SDK 36, target SDK 36, and
  build tools 36.0.0; Android export bundled successfully. The source cut was
  pushed to `main` before dispatch, and `play-candidate-12` was confirmed
  unused.
- GitHub accepted manual workflow `349139383`, **Build Zero-Lag Play candidate
  AAB**, on `main` with numeric input `12` at `2026-09-03T08:08:15Z`. It
  registered [run `33731736686`](https://github.com/Yination01/Zero-Lag/actions/runs/33731736686),
  run number 1, from the exact source cut. The run was then observed in
  progress.
- The workflow will build a `zero-lag.aab` locally through EAS on GitHub and
  only publish a `play-candidate-12` prerelease asset after its secret,
  dependency, source, Android build, ZIP, and signature gates pass. It does
  not submit to Google Play.
- No AAB, Console upload, policy URL, real support contact, screenshots,
  installation, launcher or splash rendering, permission result, or device
  test is available at this record point. Build 11 remains the last successful
  installable preview APK and predates this source cut. This dispatch evidence
  is post-dispatch only, not part of the Build 12 source cut.

Check: GitHub Actions run `33731736686`, the candidate release asset if green,
AAB archive and signature inspection, built-manifest API inspection, and the
blocked external gates in `docs/play/RELEASE_READINESS.md`.

## 2026-09-03: Build 12 technical AAB candidate succeeded

- [GitHub Actions run `33731736686`](https://github.com/Yination01/Zero-Lag/actions/runs/33731736686)
  completed successfully at `2026-09-03T08:16:47Z`, eight minutes and
  thirty-one seconds after its manual dispatch. Every required workflow step
  succeeded: exact-source checkout, candidate and tag guards, Expo secret
  gate, locked dependencies, source gate, local EAS production bundle, ZIP and
  JAR signature checks, Actions artifact upload, and prerelease publication.
  The source remains the pre-dispatch API 36 cut
  `df205cf58f061cea4a608d6a53a84413f3b8fd7e`; later evidence commits do not
  alter that output.
- GitHub published the [`play-candidate-12` prerelease](https://github.com/Yination01/Zero-Lag/releases/tag/play-candidate-12)
  with [`zero-lag.aab`](https://github.com/Yination01/Zero-Lag/releases/download/play-candidate-12/zero-lag.aab).
  The asset is 39,137,186 bytes and SHA-256
  `dee12bc6a4adcfd6bc172a93d0afae724e80ce045fbd26dfc8df72896350448e`.
  Its Actions artifact is `zero-lag-play-candidate-aab-12`, ID `9884377528`.
- Independent post-publication checks downloaded the release asset and passed
  ZIP integrity and Bundletool validation. The decoded built manifest names
  package `com.yination01.zerolag`, version `0.1.0` code `1`, minimum SDK 24,
  target SDK 36, and compile SDK 36. Ordinary `jarsigner` verification passed
  and verified a SHA-256/RSA 2048-bit signature. Strict JAR verification warns
  correctly that the certificate is self-signed, lacks a trusted PKIX chain,
  and has no timestamp. That is a signing-identity fact, not proof of Play App
  Signing enrollment; Console setup remains external work.
- This milestone establishes a technically built API 36 candidate only. It did
  not create a Play Console app, upload an AAB, enroll Play App Signing, deploy
  the blocked placeholder policy, establish a real support contact, create
  screenshots, install the AAB, or perform a real-device test. It must never
  be described as Play approval or public-release readiness.

Check: `docs/play/BUILD_12_EVIDENCE.md`, `.build-state.json`, the GitHub run,
the prerelease asset checksum, and the external hard-stop gates in
`docs/play/RELEASE_READINESS.md`.
