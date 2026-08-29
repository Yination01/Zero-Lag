# Zero-Lag sitemap

Orientation document. Read it before guessing a path.

State at the last update of this document:

| Thing | Value |
|---|---|
| Tip of this branch | agent-pack law merged, native prototype archived, Expo plan drafted |
| App scaffold | not started. Stack intent is Expo / React Native Android. |
| Live host | none named |
| Last APK | none. `.build-state.json` lastBuild is null |
| Suite | `npm test` (agent-docs + agent-rules, both green) |

## Top level

| Path | What it is |
|---|---|
| `AGENTS.md` | How to work. |
| `CLAUDE.md` | Project law. Wins ties. |
| `DESIGN.md` | Locked tokens, once they exist. Empty on purpose. |
| `SITEMAP.md` | This file. |
| `.build-state.json` | The APK a tester is actually running. Null until a named dispatch. |
| `package.json` | `npm test` runs the two agent audits. |

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

Expo app, `src/`, `backend/`, `plugins/`, `.github/workflows/apk.yml`.
Do not scaffold them unless the user names that work. Do not dispatch an APK.
