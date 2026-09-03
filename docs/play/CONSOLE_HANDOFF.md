# Google Play Console closed-testing handoff

Run these steps only after the external gates in `RELEASE_READINESS.md` are
complete. This is a handoff guide, not evidence that an action was performed.

## Inputs to have ready

- The verified Build 12 [`zero-lag.aab`](https://github.com/Yination01/Zero-Lag/releases/download/play-candidate-12/zero-lag.aab) and SHA-256 `dee12bc6a4adcfd6bc172a93d0afae724e80ce045fbd26dfc8df72896350448e`. See `BUILD_12_EVIDENCE.md` before upload.
- A verified developer or business name, support email, and privacy email.
- A live, public, non-editable privacy-policy URL with the same publisher name.
- The app icon, feature graphic, and authentic screenshots.
- Completed answers for Data safety, content rating, ads, app access, and every
  Android permission or special access the final build requests.
- Closed-test audience details for Nigeria, English, plus tester addresses or
  a test group managed by the maintainer.

## Console order

1. Create the Android app record with package `com.yination01.zerolag`.
2. Configure Play App Signing and keep upload-key material out of chat, source,
   screenshots, and issue trackers.
3. Add the approved app name, category, short description, full description,
   contact details, public privacy-policy URL, icon, feature graphic, and real
   screenshots from `docs/play/STORE_LISTING.md`.
4. Complete Data safety using the final release source, `PLAY_DATA_SAFETY.md`,
   and the behavior observed on a real device. Do not claim server-side data
   collection when the app is local only. Do not omit data or permissions that
   the app or a bundled SDK actually accesses.
5. Complete App content, content rating, target audience, ads declaration, and
   app-access disclosures. Keep each answer consistent with the final app.
6. Create the Nigeria English closed-test track, add the approved tester group,
   and upload the verified Build 12 AAB.
7. Confirm the Console reports the expected target SDK, package name, version,
   app signing status, and no unresolved policy declaration.
8. Invite testers, collect device evidence, fix any failure, and issue a new
   uniquely numbered candidate only after the source gate passes again.

## Never do these things

- Do not upload the Build 11 APK as a new Play app release.
- Do not deploy `privacy-policy-template.html` while required fields remain.
- Do not use a placeholder email, fabricated screenshots, inaccurate Data
  safety answers, or claims that Zero-Lag boosts a mobile network.
- Do not turn a GitHub candidate release into a public Play production launch
  without completed Console and real-device gates.
