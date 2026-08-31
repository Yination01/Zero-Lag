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
