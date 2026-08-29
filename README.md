# ZeroLag

An **Android app** that helps Nigerian mobile gamers (eFootball, COD Mobile,
PUBG, MLBB, Free Fire) get the best possible connection out of their phone —
measure lag before a match, watch ping live in-game, and apply safe
pre-match network optimizations.

- **Platform:** Android only · native **Kotlin + Jetpack Compose**
- **Status:** M0 + M1 built (diagnostics, signal reader, floating ping HUD)

## What works now

- 🎯 **Match-readiness test** — real RTT probes to Cloudflare/Google anycast →
  ping, jitter, packet loss, and a *MATCH READY / PLAYABLE / RISKY* verdict
- 📶 **Signal card** — carrier, network tech (5G/4G/3G/Wi-Fi), real RSRP in dBm
- 🎮 **Floating ping HUD** — a passive, color-coded ping meter over your game
  (never interrupts a match)
- 🔄 **One-tap network refresh** — guided airplane-mode toggle that forces the
  phone to re-register on the strongest nearby tower

## Build & run

Open this folder in **Android Studio**, let Gradle sync, connect a phone
(Android 8.0+) with USB debugging, and press Run. Full steps in
[BUILD.md](BUILD.md).

## Docs

- [Product & Technical Plan](docs/PLAN.md) — vision, gamer-safe design,
  roadmap (M0–M6), monetization, and platform constraints.

## Roadmap

M2 Gaming DNS boost (VpnService) · M3 lag logging & post-match reports ·
M4 crowdsourced coverage map (MTN/Airtel/Glo/9mobile) · M5 dual-SIM advisor
· M6 monetization & Play Store launch.
