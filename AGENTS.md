# Agent instructions for Zero-Lag

Read this, then `CLAUDE.md`, before editing. Both bind.

## Priority (combine, do not pick one)

1. **User instruction for this turn** wins.
2. **`CLAUDE.md`** is Zero-Lag project law: read the **Hard rules** first,
   then secrets, a11y, budget zero, no live host until named.
   **Never start an APK / EAS / Actions build unless the build number
   appears in the user's own message this turn.**
3. **`.agent/master-skills.json`** is how you work (skills catalog v1.3.0,
   60 skills). Every skill carries `applies_to_project`: `yes` (22, use
   when the trigger fits), `on-request` (23, recommend when the trigger
   fits, then wait), `n-a-this-stack` (15, do not invoke).
4. **`.agent/quality-bar.json`** is the quality bar (list v40.0, 181 items).
   `stack_exclusions` are not open work.
5. **`DESIGN.md`** is the locked palette once tokens exist. Do not invent.
6. **`SITEMAP.md`** and **`docs/DECISIONS.md`** are the map and the
   decision log. Check them before guessing a path.

If a skill or quality-bar item fights `CLAUDE.md`, `CLAUDE.md` wins.

How to store and retag this pack: `.agent/agent-pack.json`.
Poise architecture is reference only: `docs/poise-architecture.json`.

## The eight hard rules, in one line each

Full text: `CLAUDE.md`, section **Hard rules**.
`.audit/agent-rules.cjs` fails the suite if the docs stop stating them.

1. **No APK / EAS / Actions build without a number in the user's message
   this turn.** Ready work waits, and you say so. **Mirror: work that
   lands after a build is not on anyone's phone.**
2. **Questionnaire, with a RECOMMENDED option and reasoning on every
   question.** **If you are unsure, ask.** Do not guess and proceed.
3. **Failing check first, then the fix.**
4. **Mutation-test every new check.** Restore from a copied backup, never
   `git checkout`, then `diff` to prove it.
5. **Assert the guarantee, not one spelling of a string.**
6. **No completion claim without a fresh `npm test`,** plus what stayed
   unverified.
7. **Copy the fixed values exactly:** commit identity, Admin not
   superuser, product name Zero-Lag, no em-dash or en-dash.
8. **Gates fail closed.** Missing secrets mean shut. No live host until
   named. A rule that lives only in conversation will be violated, so
   write it in `docs/DECISIONS.md` the day it is made.

## Global working rules

- Be concise. Use the domain's words.
- Ask as a **questionnaire** when the task is ambiguous or you are unsure.
- Confirm the approach on **new features**. On **bugs**, find root cause,
  add or extend a test, ship, commit, push.
- Check `applies_to_project` first. Invoke a `yes` skill when the trigger
  fits. When an `on-request` skill's trigger fits, recommend it in the
  questionnaire with reasoning and wait for yes. Do not invoke silently.
  Do not wait for the user to name the skill. Never invoke an
  `n-a-this-stack` skill (Figma, Tailwind, Sleek, Claw, OpenWork, resume,
  ads, Notion, ScrapeGraph, desktop-pet, arena-ai-agents, internal-comms).
- No em-dash and no en-dash. Use a comma, a colon, or a full stop.
  `.audit/agent-docs.cjs` enforces this.
- Do not scaffold Expo or dispatch an APK unless that work is named.
- After editing `.agent/*.json` or these rule files, run `npm test`.

## Which skill, when

| Situation | Skill |
|---|---|
| Bug, test failure, unexpected behaviour | `systematic-debugging` then `bugfix` |
| Hard / flaky bug | `structured-debugging` |
| New feature | `brainstorming` then `writing-plans` then `test-driven-development` |
| UI copy | `ux-writing` |
| Public landing | `design-taste-frontend` plus SEO items in the quality bar |
| Security change | `vercel-security-audit` plus `security_and_trust` |
| Passing a thread to another agent | `handoff` (no secrets, no tokens) |
| Any implementation code | `test-driven-development` |
| Editing `.agent/*.json` or these rule files | `writing-skills`, then `node .audit/agent-docs.cjs` |
| Before claiming done | `verification-before-completion` |
| Large feature, still fuzzy | `grill-me` (on-request: recommend it) |
| New module boundary | `design-an-interface` (on-request: recommend it) |
| Need a throwaway answer first | `prototype` (on-request: recommend it) |
| Existing e2e cannot reproduce | `agent-reproduce-feature` or `agent-browser` (on-request: recommend it) |
| Landing conversion | `page-cro` (on-request: recommend it) |
| After a major feature, before merge | `requesting-code-review` (on-request: recommend it) |
| Independent failures, no shared state | `dispatching-parallel-agents` (on-request: recommend it) |
| User asked for a Word, PDF or sheet | `docx` / `pdf` / `xlsx` (on-request: recommend it) |

## Git / identity

Workspace snapshots drop `.git/config`. Recreate each turn:
`user.name=Yination01`, `user.email=johnpaulonovo@gmail.com`, origin
`https://github.com/Yination01/Zero-Lag.git`. Copy those values exactly.
Push via `GIT_ASKPASS`. Never write a token into the repo, a commit, or
`.git/config`. Check `git log -1 --format='%an <%ae>'` after committing.

## Resume protocol

To append more video or image lessons: user says `Resume` plus a video
link, file, or picture batch.
