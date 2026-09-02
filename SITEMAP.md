# Zero-Lag sitemap

Orientation document. Read it before guessing a path.

## Current state

| Thing | Value |
|---|---|
| Tip of this branch | Expo React Native Android app with local readiness history, native HUD controls, truth-first permission flows, and selected text-free neon signal-pulse launcher and splash branding. Build 11 completed through the Poise-style GitHub-local APK workflow from the branding source and published an APK, but it has not yet been installed or device-tested. Build 10 predates the branding source. |
| App scaffold | Expo / React Native Android source present. `android/` is generated and gitignored. |
| Live host | None named. Local data does not upload to a Zero-Lag server. |
| Latest GitHub APK workflow | [Build 11 workflow run](https://github.com/Yination01/Zero-Lag/actions/runs/33694402846) completed successfully at `2026-09-02T23:22:26Z` from branding commit `e77c13e`. Its GitHub-local EAS job passed every required step and published [`zero-lag.apk`](https://github.com/Yination01/Zero-Lag/releases/download/preview-11/zero-lag.apk) in the [`preview-11` prerelease](https://github.com/Yination01/Zero-Lag/releases/tag/preview-11). The 62,737,907-byte APK passed archive integrity checks but is not installed or device-tested. |
| Separate EAS build | [Build 9](https://expo.dev/accounts/yination/projects/zero-lag/builds/7d6383fb-e857-421a-a1b7-738fd43216b0), EAS ID `7d6383fb-e857-421a-a1b7-738fd43216b0`, was directly submitted at `2026-09-02T19:35:04.675Z` from `477ca5e`. The fresh public status remains `IN_QUEUE`; no APK or Android compilation result exists yet. |
| Last finished APK | [Build 11 `zero-lag.apk`](https://github.com/Yination01/Zero-Lag/releases/download/preview-11/zero-lag.apk) finished successfully from branding commit `e77c13e` through GitHub-local EAS. It carries the new launcher, adaptive-icon, and splash branding source, passed archive checks, and is not installed or device-tested. Build 10 remains the prior successful APK and predates the branding. Build 8 remains installed, but its real-device Settings, permission, HUD, notification, and network checks have not run. |
| Prior EAS failure | Build 7, `f316f8b1-6030-40e0-af5f-abb26a9f887a`, errored during Gradle. Its terminal failure detail was not available. |
| Suite | `npm test` runs agent-docs, agent-rules, legal, dependency-lock, the GitHub APK workflow gate, TypeScript, and TS app tests. |
| Legal | `TERMS.md`, `PRIVACY.md`, `COPYRIGHT.md`, `COMPLIANCE.md`, `PLAY_DATA_SAFETY.md`, `LICENSE`. |

## Top level

| Path | What it is |
|---|---|
| `AGENTS.md` | How to work. |
| `CLAUDE.md` | Project law. Wins ties. |
| `DESIGN.md` | Locked visual tokens and accessibility direction. |
| `SITEMAP.md` | This file. |
| `BUILD.md` | Source gate, reproducible dependency install, and maintainer-only build routes. |
| `.build-state.json` | The most recently dispatched APK record. Currently finished Build 11 from branding commit `e77c13e`, with a verified prerelease APK but no installation or device evidence yet. Build 10 contains the prior finished prerelease asset but not the new branding. Build 9 queue state and Build 8 evidence remain in decisions and sitemap. |
| `package.json` | Expo dependencies and `npm test`, the local gate. |
| `app.json` / `eas.json` | Expo config and EAS Android build profiles. `app.json` binds the 1024 px launcher icon, dark contain-mode splash image, and Android adaptive foreground and background. |
| `assets/` | Editable SVG masters and 1024 px PNG delivery assets for the text-free neon signal-pulse launcher icon, transparent adaptive-icon foreground, and transparent splash mark. |
| `App.tsx`, `index.ts` | Expo root component and entry. |
| `src/net/` | Public-edge readiness math, RTT probes, signal, and refresh guidance. |
| `src/native/` | Source-level contracts for Android configuration and native integration, including the launcher, adaptive-icon, splash, and raster-branding guard. |
| `src/game/` | Supported game catalog and per-game headline metric. |
| `src/device/` | Device tier classifier and performance tuning profiles. |
| `src/boost/` | Guided Android settings actions and permission gating. |
| `src/history/` | Validated, bounded, serialized on-device readiness history. |
| `src/hud/` | Confirmed HUD lifecycle state and start or stop transitions. |
| `src/state/` | React hooks, local history adapter, single-flight action gate, and latest-request guard for asynchronous HUD status. |
| `src/ui/` | Tab shell, Home, Game, Boost, History, and Device screens with locked tokens. `navigation.ts` defines the tested primary destinations. |
| `src/plugins/` | Typed bridges to native modules. Absent, denied, malformed, or failed values stay conservative. |
| `src/onboarding/` | Legal consent, local start screen, and permissions flow. No fake account sign-in. |
| `src/legal/`, `src/auth/`, `src/permissions/` | Consent, guest-only local session, and permission catalogs and feedback. |
| `plugins/` | Local React Native Android modules and config plugins: `zerolag-net`, `zerolag-device`, `zerolag-hud`. Their `file:` dependencies let React Native autolink them. |
| `.github/workflows/apk.yml` | Manual Poise-style preview APK workflow. It requires a numeric unused build number of 10 or higher and `EXPO_TOKEN`, runs EAS locally on GitHub Ubuntu, then uploads `zero-lag.apk` as a workflow artifact and `preview-N` prerelease asset. |
| `TERMS.md`, `PRIVACY.md`, `COPYRIGHT.md`, `COMPLIANCE.md`, `PLAY_DATA_SAFETY.md`, `LICENSE` | Legal pack, enforced by `.audit/legal.cjs`. Not legal advice. |

## `.agent/`

| Path | What it is |
|---|---|
| `agent-pack.json` | Standing pack. How to store and retag. |
| `master-skills.json` | 60 skills, v1.3.0, with project applicability. |
| `quality-bar.json` | 181 items, v40.0. `stack_exclusions` are not open work. |

## `.audit/`

| Path | What it is |
|---|---|
| `agent-docs.cjs` | Catalog parses, stubs delegate, no em-dash or en-dash. |
| `agent-rules.cjs` | The eight hard rules stay stated. |
| `legal.cjs` | Honest product claims, Nigeria courts, 13+, placeholder contact, and legal-pack dates. |
| `dependency-lock.cjs` | Lockfile integrity and exact dependency installation in the manual APK workflow. |
| `apk-workflow.cjs` | Static gate for Poise-style GitHub-local APK delivery: named-number and tag guards, secret gate, ordered local EAS build, artifact, and prerelease asset. |

## `docs/`

| Path | What it is |
|---|---|
| `DECISIONS.md` | Decisions written the day they are made. |
| `DEVICE_TEST_PLAN.md` | Real Android device validation plan for the next finished preview APK. |
| `poise-architecture.json` | Reference only. How Poise is built, not Zero-Lag law. |
| `EXPO_PLAN.md` | Original Expo plan. Superseded where current source and decisions describe later work. |
| `kotlin-reference/` | Reference only. Pre-law Kotlin prototype and behavior source, not shipping code. |

## Not here yet

There is no backend, live host, real authentication service, cloud history,
generated `android/` folder in Git, or named iOS ship target. Do not add any
of them without user approval and the required security, privacy, and build
work.
