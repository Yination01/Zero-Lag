# Zero-Lag confirmed scope and platform truth

Scope confirmed by the maintainer on 2026-08-29. Each capability is marked
with what we can actually ship. Do not promise anything in the "blocked"
column. Gates fail closed and Play policy is a hard limit.

## Build status today (Build 1 source)

- Generic match-readiness test (ping, jitter, loss, verdict). Built and
  unit tested.
- Guided network refresh (deep link to airplane mode). Built.
- Telephony dBm reader and floating ping HUD. Drafted as native plugins,
  NOT verified on a device until a build runs them.

## Confirmed feature set and truth table

| Capability | Ship status | How it actually works |
|---|---|---|
| Multi-game recognition | Planned | Usage Access permission plus UsageStatsManager to detect the foreground game. Known package map: COD Mobile, eFootball, PUBG, Free Fire, MLBB. |
| Per-game UI | Planned | COD shows estimated in-game ping (twitch shooter, low ping critical). eFootball shows network strength plus jitter and loss (desync driven). Others get a generic profile until mapped. |
| Per-game reliability | Planned, estimate only | Ping regional anycast and nearby game hosts. Game server IPs are not published, so the number is an estimate. |
| Network boost | Partial | Guided radio refresh built. Gaming DNS VPN (DNS only) planned. No app can raise tower signal. |
| Device performance boost | Partial | Allowed: Game Mode DND, keep screen awake, brightness, clear own cache, RAM/thermal/storage readout, deep-link force-stop of hogs. |
| Disable background apps | Blocked as worded | Android 7 and up blocks killing other apps. Play bans task killer claims. Ship a guided hog list that deep links to App Info for a one-tap user force stop. No silent kill, no root. |
| Device recognition and tiers | Planned | Read Build model, RAM, CPU cores, map to a tier. The tier tunes Zero-Lag behavior (HUD rate, test cadence, settings applied). It cannot overclock CPU or change in-game graphics. |
| Background analytics | Partial | Foreground service logs locally now. Cloud upload needs a named host (none yet), a privacy policy, and consent. Missing host means shut. |

## Hard constraints (never cross)

- Never reset the network or change VPN state during a live match.
- Never claim to kill background apps, raise signal, overclock, or change
  another app's settings. Show real numbers and guide the user.
- No live host, no cloud upload, no analytics send until the maintainer
  names the host. Local only until then.
- Every restricted permission (Usage Access, overlay, notifications) gets
  an explicit why screen and a graceful denied state.
