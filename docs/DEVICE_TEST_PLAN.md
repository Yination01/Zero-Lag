# Zero-Lag Android device test plan

Use this plan after a testable Zero-Lag Android package is installed. It records
real-device evidence. It is not proof that any item has passed.

- Build 11 is an installable preview APK for manual testing.
- Build 12 will be an Android App Bundle candidate. An AAB is installed only
  after Google Play delivers it through an internal or closed testing track.
- Record phone model, Android version, build number, source SHA, network type,
  date, expected result, actual result, and an original screenshot for every
  failure.

## Test setup

1. Start with the app force stopped to exercise the launcher and cold-start
   path.
2. Use real Wi-Fi or mobile data. Do not run a guided network refresh during a
   live match.
3. Keep the notification shade available for the HUD notification check.
4. Do not include phone numbers, account names, private game chat, or other
   personal data in shared screenshots.

## 1. Launcher, adaptive icon, and splash

| Step | Expected result |
|---|---|
| Find Zero-Lag on the Android launcher. | The text-free green and blue signal-pulse icon is visible and not visibly cropped by the launcher mask. |
| Long-press or view the icon on the device's launcher. | The adaptive icon remains legible under that launcher's shape and background treatment. |
| Force stop Zero-Lag, then open it. | The dark `#0A0F14` branded splash appears before the first screen. |
| Repeat from a cold state. | No flash of an unrelated default icon, blank white surface, or stale splash is observed. |

Record what the particular phone and launcher actually show. Android launchers
may apply different adaptive masks.

## 2. Consent and local-only start

| Step | Expected result |
|---|---|
| Clear app storage only if a first-run check is intended. | The legal consent route appears before optional access. |
| Accept the legal documents. | A local start screen appears without account creation, login, email, or password controls. |
| Continue without optional access. | Home opens with useful unavailable states instead of fabricated data. |
| Force stop and reopen after completing setup. | Ordinary completed setup does not repeat on every launch. |

## 3. Ordinary Android permission feedback

| Step | Expected result |
|---|---|
| Grant available runtime permissions. | The screen reports only what Android allowed. It does not treat Usage Access or overlay as ordinary runtime grants. |
| Deny one available runtime permission. | The UI reports partial access and remains usable. |
| Tap a permission action twice quickly. | Only one permission sequence begins. |

## 4. Usage Access and game detection

1. Open the Usage Access guidance from Game or Boost.
2. Confirm Android opens the expected Usage Access route or a truthful general
   Settings fallback.
3. Grant access, open a supported game, return to Zero-Lag, and wait briefly.
4. Confirm the app identifies only a supported foreground game or truthfully
   states that none is detected.
5. Revoke Usage Access and confirm the denied state returns without a crash or
   invented game result.

## 5. Overlay and HUD lifecycle

1. Open the floating-HUD setup flow and confirm the app-specific overlay route
   or a clear Settings fallback.
2. Grant overlay access, return, and verify status refreshes without requiring
   a full app restart.
3. Start the HUD once. Confirm the non-touchable overlay is visible over a
   non-sensitive test app and touch still reaches the underlying app.
4. Open the notification shade. Confirm the ongoing notification uses the
   Zero-Lag icon and includes a Stop HUD action.
5. Stop the HUD from the notification, return to Zero-Lag, and verify status
   returns to stopped.
6. Repeat with notification access denied and record Android's actual behavior.

## 6. Readiness, history, and profiles

1. Run a Match-Readiness Test on a real connection.
2. Confirm results are labeled public-edge estimates, jitter, failed web probes,
   and readiness. They must not claim exact game-server ping or in-game packet
   loss.
3. Confirm a completed result appears on Home and in History.
4. Force stop, reopen, and confirm valid local history persists in newest-first
   order.
5. Cancel Clear History once, then confirm it once. Verify cancel keeps entries
   and confirm removes them.
6. Change Battery, Balanced, Performance, and Auto profiles. Confirm only
   Zero-Lag sampling and HUD behavior change. The app must not claim to
   overclock hardware, change game graphics, raise signal, or silently close
   other apps.

## Evidence to return

Attach the relevant original screenshots from `docs/play/SCREENSHOT_CAPTURE.md`
and provide a result table with: test section, phone model, Android version,
build, pass or fail, observed result, and exact error text if any. Do not send
account passwords, access tokens, or personal identifiers.
