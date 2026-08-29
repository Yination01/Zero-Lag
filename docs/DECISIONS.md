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
