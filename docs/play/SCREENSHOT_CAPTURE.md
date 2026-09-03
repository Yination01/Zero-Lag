# Authentic Play Store screenshot capture

The maintainer chose to capture real screenshots from an installed Zero-Lag
build. Do not substitute generated screen images, mocked metrics, copyrighted
game logos, or edited permission dialogs for real app evidence.

## Before capture

1. Install the newest testable Zero-Lag APK. Build 11 is available for manual
   installation. Build 12 will be an AAB and cannot be installed directly.
2. Record phone model, Android version, build number, date, connection type,
   and whether optional permissions were granted.
3. Use a real test result only. If a network name, phone number, notification,
   game account, or other personal detail appears, redact that detail without
   altering product UI or metrics.
4. Capture PNG or JPG files at the phone's native portrait resolution. Keep the
   originals.

## Requested capture set

| File name | Screen or state | What it proves |
|---|---|---|
| `01-launcher.png` | Android launcher with Zero-Lag icon | Actual icon crop and system mask |
| `02-splash.png` | Cold start before the first app screen | Actual splash image and dark background |
| `03-consent.png` | First legal-consent screen | Consent appears before optional access |
| `04-home-result.png` | Home after a real readiness check | Honest public-edge result wording |
| `05-game-denied.png` | Game screen without Usage Access | Useful denied state, no invented foreground game |
| `06-boost-setup.png` | Boost or HUD setup state | Clear overlay and special-access guidance |
| `07-history.png` | History after a real saved result | On-device history and deletion controls |
| `08-device.png` | Device screen | Device tier and profile wording |

Capture the launcher and splash separately for device validation. The remaining
screens can be chosen for the eventual Play listing after reviewing their
clarity and accuracy.

## HUD evidence

If overlay access is granted, capture the HUD over a non-sensitive app or test
screen, plus the ongoing notification and its Stop action. Do not capture or
publish another game's private chat, account name, or copyrighted gameplay art
without permission.

## Return package

Attach the original screenshots in chat or upload them to the repository in a
reviewable path. Include a short result table: screenshot name, phone model,
Android version, pass or fail, and observed issue. Screenshots are evidence,
not a substitute for the full device test plan in `docs/DEVICE_TEST_PLAN.md`.
