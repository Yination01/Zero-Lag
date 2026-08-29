# Zero-Lag sitemap

Orientation document. Read it before guessing a path.

State at the last update of this document:

| Thing | Value |
|---|---|
| Tip of this branch | Expo app scaffolded, readiness engine TDD green, native plugins drafted |
| App scaffold | Expo / React Native Android source present. `android/` generated, gitignored. |
| Live host | none named |
| Last APK | `build-1` recorded in `.build-state.json`. Cut on the maintainer machine. Not verified in this sandbox. |
| Suite | `npm test` (agent-docs + agent-rules + legal + TS app tests) |
| Legal | `TERMS.md`, `PRIVACY.md`, `COPYRIGHT.md`, `COMPLIANCE.md`, `PLAY_DATA_SAFETY.md`, `LICENSE` |

## Top level

| Path | What it is |
|---|---|
| `AGENTS.md` | How to work. |
| `CLAUDE.md` | Project law. Wins ties. |
| `DESIGN.md` | Locked tokens, once they exist. Empty on purpose. |
| `SITEMAP.md` | This file. |
| `.build-state.json` | The APK a tester is actually running. This branch records `build-1`. |
| `package.json` | Expo app deps and `npm test` (audits plus TS app tests). |
| `app.json` / `eas.json` | Expo config and EAS Android build profiles. |
| `App.tsx`, `index.ts` | Expo root component and entry. |
| `src/net/` | Readiness math, RTT probe, signal and refresh logic. |
| `src/game/` | Game catalog and per-game headline metric. |
| `src/device/` | Device tier classifier and performance tuning profiles. |
| `src/boost/` | Boost action catalog and permission gating. |
| `src/ui/` | Tab shell, Home/Game/Boost/Device screens, design tokens. |
| `src/state/` | React hooks (readiness, game detection, device). |
| `src/onboarding/` | First-launch flow: legal consent, guest/account, permissions. |
| `src/legal/`, `src/auth/`, `src/permissions/` | Consent, session (guests equal to accounts), permission catalog with reasons. |
| `plugins/` | Local React Native Android modules and config plugins: `zerolag-net`, `zerolag-device`, `zerolag-hud` (game bar overlay). Their `file:` dependencies let React Native autolink them. |
| `.github/workflows/apk.yml` | Manual EAS APK build. Requires a typed build number and an EXPO_TOKEN secret; fails closed otherwise. |
| `TERMS.md`, `PRIVACY.md`, `COPYRIGHT.md`, `COMPLIANCE.md`, `PLAY_DATA_SAFETY.md`, `LICENSE` | Official legal pack, enforced by `.audit/legal.cjs`. Not legal advice. |

## `.agent/`

| Path | What it is |
|---|---|
| `agent-pack.json` | Standing pack. How to store and retag. |
| `master-skills.json` | 60 skills, v1.3.0, `applies_to_project`. |
| `quality-bar.json` | 181 items, v40.0. `stack_exclusions` are not open work. |

## `.audit/`

| Path | What it is |
|---|---|
| `agent-docs.cjs` | Catalog parses, stubs delegate, no em-dash. |
| `agent-rules.cjs` | The eight hard rules stay stated. |
| `legal.cjs` | Honest booster claims, Nigeria courts, 13+, placeholder contact. |

## `docs/`

| Path | What it is |
|---|---|
| `DECISIONS.md` | Decisions written the day they are made. |
| `poise-architecture.json` | REFERENCE ONLY. How Poise is built. Not Zero-Lag law. |
| `EXPO_PLAN.md` | TDD plan for the Expo / React Native Android app. Not scaffolded yet. |
| `kotlin-reference/` | REFERENCE ONLY. Pre-law native Kotlin prototype. Behavior spec to port, not shipping code. |

## Not here yet

`backend/`, `.github/workflows/apk.yml`, a generated `android/` folder, and
a dispatched APK. Do not run prebuild in git and do not dispatch an APK
unless the maintainer names the build number in that turn.
