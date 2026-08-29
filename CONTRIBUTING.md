# Contributing to Zero-Lag

Both humans and AI agents work in this repo. The rules are the same for
both, and they live in one place.

## Read first

| What | Where |
|---|---|
| Project law | `CLAUDE.md` |
| How agents pick skills | `AGENTS.md` |
| Skills catalog (v1.3.0, 60 skills) | `.agent/master-skills.json` |
| Quality bar (v40.0, 181 items) | `.agent/quality-bar.json` |
| Design | `DESIGN.md` |
| Map | `SITEMAP.md` |
| Decisions | `docs/DECISIONS.md` |

`CLAUDE.md` wins any tie.

## Setup

```bash
npm test
```

There is no app scaffold yet. Do not run Expo prebuild unless that work
is named.

## Before every commit

```bash
npm test
```

If you change agent-facing rules or `.agent/*.json`, that command is the
whole gate.

## House style

- No em-dash and no en-dash. Use a comma, a colon, or a full stop.
- The viewer-facing word is Admin, never superuser.
- Errors say what happened, why, and what to do next.
- Do not invent design tokens. Read `DESIGN.md`.
- Do not start an APK / EAS / Actions build unless the maintainer names
  the number.

## Budget

Zero extra paid services unless the maintainer names a purchase.
