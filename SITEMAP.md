# Zero-Lag sitemap

Orientation document. Read it before guessing a path.

State at the last update of this document:

| Thing | Value |
|---|---|
| Tip of this branch | Expo app scaffolded, readiness engine TDD green, native plugins drafted |
| App scaffold | Expo / React Native Android source present. `android/` generated, gitignored. |
| Live host | none named |
| Last APK | none. `.build-state.json` lastBuild is null. No build number named yet. |
| Suite | `npm test` (agent-docs + agent-rules + 15 TS app tests, all green) |

## Top level

| Path | What it is |
|---|---|
| `AGENTS.md` | How to work. |
| `CLAUDE.md` | Project law. Wins ties. |
| `DESIGN.md` | Locked tokens, once they exist. Empty on purpose. |
| `SITEMAP.md` | This file. |
| `.build-state.json` | The APK a tester is actually running. Null until a named dispatch. |
| `package.json` | Expo app deps and `npm test` (audits plus TS app tests). |
| `app.json` / `eas.json` | Expo config and EAS Android build profiles. |
| `App.tsx`, `index.ts` | Expo root component and entry. |
| `src/net/` | Readiness math, RTT probe, signal and refresh logic. |
| `src/ui/` | Home screen and locked design tokens (`theme.ts`). |
| `src/state/` | React hooks. |
| `plugins/` | Native Android modules: `zerolag-net` (telephony dBm), `zerolag-hud` (overlay service). |

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
