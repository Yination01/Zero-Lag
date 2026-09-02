# Zero-Lag sitemap

Orientation document. Read it before guessing a path.

## Current state

| Thing | Value |
|---|---|
| Tip of this branch | Expo React Native Android app with local readiness history, native HUD controls, and truth-first permission flows. Build 9 was submitted from `477ca5e` and is awaiting EAS completion. |
| App scaffold | Expo / React Native Android source present. `android/` is generated and gitignored. |
| Live host | None named. Local data does not upload to a Zero-Lag server. |
| Current EAS build | [Build 9](https://expo.dev/accounts/yination/projects/zero-lag/builds/7d6383fb-e857-421a-a1b7-738fd43216b0), EAS ID `7d6383fb-e857-421a-a1b7-738fd43216b0`, was directly submitted at `2026-09-02T19:35:04.675Z` from `477ca5e`. The first authenticated status was `IN_QUEUE`; no APK or Android compilation result exists yet. |
| Last finished APK | [Build 8](https://expo.dev/accounts/yination/projects/zero-lag/builds/0a54b56a-01ad-47c4-98a7-0a4bd9fd0768) finished successfully from `f1071a3`. The maintainer reports it is installed, but the real-device Settings, permission, HUD, notification, and network checks have not run. |
| Prior EAS failure | Build 7, `f316f8b1-6030-40e0-af5f-abb26a9f887a`, errored during Gradle. Its terminal failure detail was not available. |
| Suite | `npm test` runs agent-docs, agent-rules, legal, dependency-lock, TypeScript, and TS app tests. |
| Legal | `TERMS.md`, `PRIVACY.md`, `COPYRIGHT.md`, `COMPLIANCE.md`, `PLAY_DATA_SAFETY.md`, `LICENSE`. |

## Top level

| Path | What it is |
|---|---|
| `AGENTS.md` | How to work. |
| `CLAUDE.md` | Project law. Wins ties. |
| `DESIGN.md` | Locked visual tokens and accessibility direction. |
| `SITEMAP.md` | This file. |
| `BUILD.md` | Source gate, reproducible dependency install, and maintainer-only build routes. |
| `.build-state.json` | The most recently dispatched APK record. Currently queued Build 9, with Build 8 evidence retained in decisions and sitemap. |
| `package.json` | Expo dependencies and `npm test`, the local gate. |
| `app.json` / `eas.json` | Expo config and EAS Android build profiles. |
| `App.tsx`, `index.ts` | Expo root component and entry. |
| `src/net/` | Public-edge readiness math, RTT probes, signal, and refresh guidance. |
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
| `.github/workflows/apk.yml` | Manual EAS APK workflow. Requires a named build number and the `EXPO_TOKEN` GitHub secret. |
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
