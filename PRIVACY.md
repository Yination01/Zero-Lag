# Privacy Policy for Zero-Lag

**Last updated: 2026-09-02**
**Copyright © 2026 Yination / Zero-Lag. All rights reserved.**

This policy is a product draft. It is not legal advice. Nigeria's NDPR applies.
The data controller is Yination, operating Zero-Lag.

The legal contact inbox has not been named yet. Until it is, the placeholder
`legal-contact-placeholder@example.com` appears here. Mail sent there will not
reach us.

## 1. What this app is

Zero-Lag measures network lag on your Android phone and offers guided device
boosts for mobile games. There is **no live host**. Missing host means shut:
nothing is uploaded to a Zero-Lag server because none exists.

## 2. Data we handle (on the device)

Until a host is named, processing is **local only**.

- **Network tests and readiness history:** public-edge estimates, jitter,
  failed web probes, verdicts, timestamps, and a recognized supported-game
  label when one is available. Stored on device. Failed web probes are not
  confirmed in-game packet loss.
- **HUD session:** current ping shown over other apps, if overlay is granted.
- **Foreground game (if Usage Access is granted):** the package name of the
  app in the foreground, matched to a small catalog (COD Mobile, eFootball,
  PUBG, Free Fire, MLBB). We do not scrape other apps' content.
- **Device facts:** model, RAM, CPU cores, used to pick a tier (entry,
  mid-range, flagship). The tier only tunes Zero-Lag (HUD rate, test cadence).
- **Permissions state:** which settings you granted, so the UI can stay honest.
- **Boost actions you run:** which guided action you tapped, not a silent
  kill log of other apps.

We do **not** currently collect: name, email, account, contacts, payment
cards, precise maps of where you walk, message contents, or photos.

Android backups (`allowBackup`) may copy local files off the device onto
your Google account if you use system backup. That is the OS, not a Zero-Lag
server.

## 3. Permissions, why we ask

Every restricted permission gets a why screen and a usable denied state.

- **ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION:** cell and Wi-Fi related
  signal quality (dBm). This is **not for maps**, not for advertising, and
  not a navigation feature.
- **READ_PHONE_STATE:** network type (for example LTE vs Wi-Fi) so the
  readiness test can label the path. Not for reading your call log or SMS.
- **ACCESS_NETWORK_STATE:** whether you are online.
- **SYSTEM_ALERT_WINDOW:** floating ping HUD over a game.
- **FOREGROUND_SERVICE / SPECIAL_USE:** keep the HUD and probes alive while
  you play, with a visible notification.
- **POST_NOTIFICATIONS:** the ongoing foreground HUD notification, including
  its Stop HUD control.
- **Usage Access (UsageStatsManager):** detect the foreground game package.
  Optional. Denied means the Game tab stays generic.

Zero-Lag does not use a Notification Listener. It does not read WhatsApp,
SMS, or mail.

## 4. What we do not do

- We do not sell personal data.
- We do not run a third-party advertising or analytics SDK in this version.
- We do not upload diagnostics until a host is named and you consent.
- We cannot raise tower signal, overclock the CPU, or silently kill other
  apps. Boost only opens Android settings pages that you control.

## 5. Planned features that would change this policy

If a **local DNS VPN** is added, DNS queries would be processed on device
(or sent to a resolver you chose, such as Cloudflare or Google). Traffic
would not be sent to a Zero-Lag server unless a host is named and this
policy is updated.

If **cloud history** is added, it stays shut until the maintainer names a
host, a retention period, and a consent switch. Absent config means shut.

## 6. Retention and your controls

Local readiness history lasts until you use Clear History in Zero-Lag, clear
app storage, or uninstall. Clear History permanently removes saved readiness
results from this device. There is no account to delete on a server today.

**Access / portability / erasure:** while data is local only, Clear History,
Android settings (clear storage), and uninstall are the erasure paths. When a
host exists, this section must name an in-app export and delete path the same
day.

## 7. Children

Not for under 13. We do not knowingly collect data from children. If you
believe we have, use the contact below once a real inbox exists.

## 8. Your NDPR rights

You may request access, correction, deletion, or a copy of personal data
we hold. Today that data lives on your phone. After a host exists, email
the legal contact. No sale of data.

## 9. Security

No Zero-Lag backend yet. Native modules run in the app process. Do not
grant Usage Access or overlay on a shared phone if you do not want the
other person to see which game is in the foreground or the HUD.

## 10. Changes

The date at the top is the version. A material change (new host, new SDK,
new permission) needs a new date and an in-app notice once the app can
show one.

## 11. Contact

Placeholder: `legal-contact-placeholder@example.com`.
Name a real inbox in `docs/DECISIONS.md` before any public listing.

---
© 2026 Yination / Zero-Lag. All rights reserved.
