# Building & running ZeroLag

This is a **native Android (Kotlin + Jetpack Compose)** project.

## Requirements
- **Android Studio** Jellyfish (2023.3.1) or newer
- **JDK 17** (bundled with recent Android Studio)
- An Android phone (Android 8.0 / API 26 or newer) with **USB debugging**
  enabled, or an emulator

## Run it
1. Open the **repo root folder** (`Zero-Lag`) in Android Studio.
2. Let Gradle sync (it downloads the Android SDK pieces automatically).
3. Plug in your phone (or start an emulator) and press the green **Run ▸**
   button.
4. On the phone, grant the **location** permission (needed to read real
   signal dBm) and allow notifications.

Command-line alternative (once the Android SDK is installed):
```bash
./gradlew assembleDebug          # builds app/build/outputs/apk/debug/app-debug.apk
./gradlew installDebug           # installs onto a connected device
```

## Permissions the app uses
| Permission | Why |
|---|---|
| Location (fine) | Android requires it to read cell signal strength (RSRP/dBm) |
| Read phone state | Carrier name + network type (5G/4G/3G) |
| Overlay ("display over other apps") | The floating ping HUD over games |
| Foreground service + notifications | Keeps the HUD alive while you play |

## What works in this version (M0 + M1)
- **Match-readiness test** — real RTT probes to Cloudflare/Google anycast →
  ping, jitter, packet loss, and a MATCH READY / PLAYABLE / RISKY verdict.
- **Signal card** — carrier, network tech, real dBm strength.
- **Floating ping HUD** — a passive, color-coded ping meter that floats over
  games (enable the toggle and grant overlay permission).
- **One-tap network refresh** — opens airplane-mode settings with a guided
  5-second toggle that forces re-registration on the strongest tower.

## Not yet built (see [docs/PLAN.md](docs/PLAN.md))
- M2 Gaming DNS VpnService · M3 lag logging/reports · M4 crowdsourced
  coverage map · M5 dual-SIM advisor · M6 monetization & store launch.
