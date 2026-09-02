# Play Data safety draft for Zero-Lag

Fill this into Play Console when a Play account exists. Keep it honest.
Last updated: 2026-09-02.

There is **no live host**. Answers below assume local-only processing.
If a host is named, rewrite this file before the store listing goes live.

## Data collected

| Type | Collected | Shared with others | On device only | Why |
|---|---|---|---|---|
| Location (approximate and precise) | Yes, if granted | No | Yes | Cell / Wi-Fi signal quality (dBm). Not maps. Not ads. |
| Device or other IDs | Yes (model, not an advertising ID) | No | Yes | Device tier. |
| App activity (apps on the device) | Yes, if Usage Access is granted | No | Yes | Foreground game package vs a small catalog. |
| Diagnostics (public-edge estimates, jitter, failed web probes, verdicts, timestamps) | Yes | No | Yes | Readiness test, local readiness history, and HUD. |
| Personal info (name, email) | No | No | n/a | No accounts. |
| Financial | No | No | n/a | No payments. |
| Photos, messages, contacts, audio | No | No | n/a | No those permissions. |

## Security

- Data is encrypted in transit: not applicable to Zero-Lag servers (none).
  OS backup of local files follows Google backup rules, not ours.
- Users can delete saved readiness results with Clear History in the app,
  or erase all local app data by clearing storage or uninstalling.
- Independent security review: no.

## Data safety declarations to tick

- Data is not sold.
- Data is not used for advertising in this version.
- Data is not used for fraud prevention on a server (there is no server).
- Committed to Play Families Policy: no (13+, not a kids app).

## Permissions that need a prominent disclosure

- Location (signal, not maps)
- Overlay (ping HUD)
- Usage Access (foreground game)
- Read phone state (network type only)

If any row above becomes false, change this file the same day. Do not
leave Play Console on a stale form.
