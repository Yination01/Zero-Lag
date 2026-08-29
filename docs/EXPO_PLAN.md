# Zero-Lag Expo plan

Plan for the Expo / React Native Android app. This is a plan, not a
scaffold. Nothing here creates an Expo project until the maintainer names
that work. Stack facts come from `CLAUDE.md`. Poise facts in
`docs/poise-architecture.json` are reference only.

## Goal

An Android app for mobile gamers in Nigeria. It measures network lag
before a match, shows ping live in-game, and applies safe pre-match
optimizations. Two modes stay separate:

- Pre-match: guided network refresh, gaming DNS, readiness test.
- In-game: read-only ping HUD and spike logging. Never reset a connection
  during a live match.

## Stack (from project law)

- Expo, React Native, TypeScript, Android target. iOS is not a ship target
  until named.
- `android/` is generated and gitignored. Native work goes in `plugins/`.
- Budget zero. No paid tier, no live host until named. Missing secrets
  mean shut.
- No `expo prebuild` or scaffold until the work is named in a turn.

## Proposed layout (when scaffolded)

```
app/ or src/            # Expo Router screens: home, network, hud, settings
src/net/                # ping probe, readiness math, signal types
src/state/              # stores for sessions and settings
plugins/zerolag-net/    # config plugin + native module: telephony dBm, ping
plugins/zerolag-hud/    # config plugin + foreground overlay service
plugins/zerolag-vpn/    # later: DNS only VpnService
.audit/                 # agent audits already here; add app unit tests beside
```

The exact screen set is decided at scaffold time, not invented here.

## Port order (test first)

Each item ships with a failing check first, then the minimum code to pass,
then a mutation test that kills the check, then restore.

1. **Readiness math (pure TS, fully unit testable, no device).**
   Port `ReadinessChecker` thresholds from the Kotlin reference:
   avg ping, jitter, loss percent, then MATCH READY (<80 ms, <15 ms
   jitter, 0% loss), PLAYABLE (<130 ms, <35 ms, loss <= 10%), RISKY,
   NO CONNECTION. This is the first real code because it needs no device
   and locks the product promise in tests.
2. **Ping probe.** Replicate TCP connect RTT in TS where possible; wrap
   native socket timing in `plugins/zerolag-net` if RN cannot do it.
3. **Signal reader.** Telephony dBm, carrier, network tech via a native
   module. Location permission gate, graceful deny state.
4. **Floating ping HUD.** Foreground service plus overlay in
   `plugins/zerolag-hud`. Read only in-game.
5. **Guided refresh.** Deep link to airplane mode settings. No root, no
   radio toggle API (it does not exist for apps).
6. **Gaming DNS.** Later, DNS only VpnService in `plugins/zerolag-vpn`,
   explicit consent, Play justification.

## Testing

- Gate today: `npm test` runs `node .audit/agent-docs.cjs` and
  `node .audit/agent-rules.cjs`.
- At scaffold, add a TS unit test runner (Jest) and wire it into `npm test`
  so the audit and app tests run in one gate. Pure math (readiness) is
  covered first.
- Anything needing a real device, live data, or a cold-start race is
  stated as unverified until it runs there.

## Open before scaffold

- Confirm screen list and design tokens (DESIGN.md is empty by law until
  tokens are locked).
- Confirm readiness thresholds against a real game target in the region.
- Confirm the test runner and that it stays free on budget zero.
