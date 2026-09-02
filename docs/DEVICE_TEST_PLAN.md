# Zero-Lag Android device test plan

Use this after a finished preview APK is installed. It is a real-device plan,
not proof that any item has passed. Record the phone model, Android version,
network type, test time, expected result, actual result, and any screenshot.

## Test setup

1. Install the named preview APK over Build 8, or uninstall the older preview
   first if Android rejects the update.
2. Use a real Wi-Fi or mobile-data connection. Do not run the guided network
   refresh during a live match.
3. Start with the app force stopped so onboarding and native service startup
   are exercised from a cold state.
4. Keep the notification shade available for the HUD notification test.

## 1. Consent and local-only start

| Step | Expected result |
|---|---|
| Open Build 9 after Build 8. | The updated legal consent screen appears once because legal version 1.1.0 replaces 1.0.0. |
| Accept the legal documents. | A local start screen appears. It does not offer create-account, login, email, or password controls. |
| Tap Continue. | Permissions setup appears. |
| Tap Enter Zero-Lag without granting optional access. | Home opens and the app continues with clear unavailable states. |
| Force stop and reopen. | The completed guest setup does not repeat. |

## 2. Ordinary Android permission feedback

| Step | Expected result |
|---|---|
| In Permissions, tap Allow app permissions and allow all prompts. | The screen reports the count Android allowed. It does not claim special Usage Access or overlay was granted. |
| Repeat after denying one prompt. | The screen reports partial access and the app remains usable. |
| Tap the button twice quickly. | Only one permission sequence starts. |

## 3. Usage Access routing and game detection

1. Tap Grant Usage Access from Game or Boost.
2. Android opens the Usage Access route or the explained general Settings
   fallback.
3. Select Zero-Lag, turn on Allow usage access, return to the app.
4. Open a supported game, then return to Game after a short delay.
5. Confirm the app either identifies only a supported foreground game or
   honestly says none is detected. It must not claim to list, close, or force
   stop other apps.

## 4. Overlay setup and HUD lifecycle

1. On Home or Boost, tap Set Up Floating HUD when its status needs setup.
2. Android opens the app-specific Display over other apps setting where
   available. Enable Zero-Lag, then return to the app.
3. Confirm HUD status refreshes from setup needed to stopped without closing
   and reopening the app.
4. Tap Start Floating HUD once. The app first waits for Android confirmation.
5. Confirm the small non-touchable Zero-Lag overlay appears over a game and
   game taps still work through it.
6. Pull down the notification shade. Confirm the ongoing HUD notification uses
   the Zero-Lag app icon and offers Stop HUD.
7. Tap Stop HUD from the notification. Return to Zero-Lag and confirm the HUD
   status refreshes to stopped.
8. Start the HUD again, then tap its app button rapidly twice. Confirm a
   duplicate start or stop race does not occur.
9. Deny notification permission and repeat. Record the actual Android behavior
   rather than assuming the foreground notification is visible.

## 5. Readiness test and local history

1. On Home, run Match-Readiness Test and wait for a result.
2. Confirm the result labels edge estimate, jitter, and failed web probes. It
   must not call probe failures in-game packet loss or claim exact game-server
   ping.
3. Confirm the completed result appears in the compact Home history card and
   in the full History tab.
4. Run a Game tab test with a detected supported game. Return to Home or
   History and confirm the entry uses the detected game label. Without a game,
   it must say Network check.
5. Force stop and reopen. Confirm saved entries persist locally and the History
   tab lists the newest timestamp first.
6. Tap Clear History, cancel once, then confirm once from Home or History.
   Verify cancellation keeps the entries and confirmation removes them. Run
   another test to confirm a new entry can still save.

## 6. Performance profile behavior

1. In Device, select Battery, Balanced, and Performance one at a time.
2. Confirm the displayed sample count and HUD rate change with the profile.
3. With the HUD running, change the profile and confirm the service remains
   running while its rate updates. Record the actual observed interval.
4. Select Auto and confirm its recommendation matches the reported device tier.
5. Confirm no screen claims to overclock the device, change a game graphic
   setting, boost tower signal, or close another app.

## Evidence to report

Send back the Build 9 EAS link, Android model/version, pass or fail against
each section, and screenshots or exact error text for failures. Do not send
account passwords, access tokens, or personal identifiers.
