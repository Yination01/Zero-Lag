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
