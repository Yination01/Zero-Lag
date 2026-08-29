# Standing rules for AI agents working on Zero-Lag

These are project rules, not suggestions. Read this before editing.
Also read `AGENTS.md`. Skills: `.agent/master-skills.json` (v1.3.0).
Quality bar: `.agent/quality-bar.json` (v40.0, 181 items). If a skill or
checklist item fights this file, **this file wins**.

**Where things are:** `SITEMAP.md`.
**Decisions:** `docs/DECISIONS.md`. Write a decision the day it is made.
**Design:** `DESIGN.md`. Do not invent tokens.
**Poise reference only:** `docs/poise-architecture.json`. Not law here.

The app has not been scaffolded yet. Do not invent screens, a product
pitch, or a live host. Stack intent is Expo / React Native Android.

## Hard rules

### 1. Never start a build the user did not name

A build number must be named in the user's own message this turn.
Never start an APK / EAS / Actions build unless it is. Not implied by
"fix it", not carried over from a previous turn, not inferred from
"and ship".
"Start the next build" authorises exactly one build, the next one, once.

If work is ready and no number was given, stop and say: the work is on
`main`, the suite is green, name the build number and I will dispatch.
Then wait.

**Mirror:** work that lands after a build is not on anyone's phone. Say
so, and say whether it changes the APK or only the docs.
Update `.build-state.json` at every dispatch.

### 2. Ask as a questionnaire, and recommend on every question

When the task is ambiguous, ask with discrete options, never an open essay.
**Every question carries an explicit RECOMMENDED option and the reasoning.**
A questionnaire without a recommendation on each question is incomplete.

**If you are unsure, ask.** Uncertainty is a trigger in its own right.
Do not guess and proceed.

### 3. Test first, then fix

For any implementation code: write the failing check first, watch it fail
by the right name, then write the minimum that makes it pass.

### 4. Mutation-test every new check

A passing test proves nothing until a mutant kills it. Break the real code,
confirm the failure names the right thing, restore it, and confirm green
again. Restore from a copied backup, never `git checkout`, then `diff`
to prove the restore was exact.

### 5. Assert the guarantee, never one spelling of it

Do not pin an exact user-facing string. Strip comments before scanning
source for a forbidden string. Pair every negative check with a positive one.

### 6. Never claim done without fresh verification

Run `npm test` and read the exit code in the same turn as the claim.
State plainly what was NOT verified: anything that needs a real device,
live data, or a cold-start race is unproven until it runs there.

### 7. Copy, do not paraphrase, the fixed values

Commit identity is `Yination01 <johnpaulonovo@gmail.com>`, exactly.
The viewer-facing word is **Admin**, never "superuser".
Product name is **Zero-Lag**.
No em-dash and no en-dash in code, copy, comments or docs. Use a comma,
a colon, or a full stop.

### 8. A rule that lives only in conversation is not enforced

If a decision is worth keeping, it lands in `docs/DECISIONS.md` and in a
check the same day. Gates fail **closed**. Absent config means shut.
Empty or missing secrets mean shut. There is **no live host** until the
user names one.

## Security, non-negotiable

- No secrets client-side. A public SDK key that is an identifier may stay
  in client config. Everything else is server env.
- Every public endpoint gets a rate limit.
- Authentication is not authorisation (CWE-639).
- Validate with a schema and reject unknown fields.
- Never interpolate a value into `innerHTML`. Use `textContent` or DOM nodes.
- Never return internals in an error. Log the stack server-side. Return one
  plain sentence.
- Parameterised queries only.
- Verify webhook signatures before trusting any payment event.

## Accessibility and UI

WCAG 2.1 AA. `DESIGN.md` is the brief once tokens exist. Do not invent them.

- Every `Pressable` needs `accessibilityRole`.
- Touch targets 44 pt minimum.
- Four states on every screen: loading, empty, error, success.
- Irreversible actions (pay, delete) never optimistic.
- Red is a budget: destruction and warnings only.
- No emoji as feature icons. No AI-default purple.
- No hardcoded hex in screens once a token file exists.

## Testing

- `npm test` is the gate today: `node .audit/agent-docs.cjs` and
  `node .audit/agent-rules.cjs`. Expand it when app code exists.
- Commit as `Yination01 <johnpaulonovo@gmail.com>`.
- After committing, check `git log -1 --format='%an <%ae>'`.

## Platform facts

- Intended stack: Expo, React Native Android. iOS is not a ship target
  until named.
- `android/` will be generated and gitignored. Never edit it by hand.
  Native work goes in `plugins/` once that folder exists.
- Do not bump Android `versionCode` on push.
- Do not run `expo prebuild` or scaffold the app unless the user names
  that work.
- Budget zero. No paid tiers, no domain purchases, no Blaze plan.
- Poise procedures in `docs/poise-architecture.json` are a reference.
  Rewrite every Poise-specific host, amount, and package name before use.
- firebase-admin, if added, stays pinned until a named upgrade. Poise
  pinned 11.11.1 after v14 500ed production.

## Git

Workspace snapshots drop `.git/config`. Recreate each turn:
`user.name=Yination01`, `user.email=johnpaulonovo@gmail.com`, origin
`https://github.com/Yination01/Zero-Lag.git`. Push via `GIT_ASKPASS`.
Never write a token into the repo, a commit, or `.git/config`.
