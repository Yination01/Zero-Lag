# Kotlin native prototype (reference only)

This folder holds a native Android (Kotlin + Jetpack Compose) prototype
built in an early session **before** the standing agent law set the stack
to Expo / React Native Android.

It is **not** shipping code and is **not** the app. The law says:

- The shipping stack is Expo / React Native Android (`CLAUDE.md`).
- `android/` is generated and gitignored. Native work goes in `plugins/`.
- Do not run these Gradle files. They are kept only as a behavior spec to
  port into the Expo app later.

## What is worth porting

| Behavior in this folder | Port target in the Expo app |
|---|---|
| `app/src/main/java/com/zerolag/app/net/PingProbe.kt` | A TCP connect RTT probe, replicated in TS, or in a small native plugin |
| `net/ReadinessChecker.kt` | Ping / jitter / loss math plus MATCH READY, PLAYABLE, RISKY thresholds |
| `net/SignalMonitor.kt` | Carrier, network tech, RSRP dBm via a telephony plugin |
| `hud/PingOverlayService.kt` | Floating in-game ping HUD via an overlay plugin |
| `boost/NetworkRefresher.kt` | Guided airplane mode refresh (deep link, not root) |
| `NATIVE_PLAN.md` | Background on the gamer two-mode rule (pre-match vs in-game) |

## Platform honesty (keep when porting)

- Apps cannot toggle airplane mode or reset the radio directly. Deep link
  the user to settings.
- Shell `ping` and `ip neighbor flush` are root only or OEM blocked. Use
  TCP connect timing for RTT.
- The ping HUD is read only in-game. It must never reset a connection or
  change VPN state during a live match.
- Cell dBm requires location permission. Degrade gracefully when denied.
