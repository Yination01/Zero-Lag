# ZeroLag — Product & Technical Plan

> **ZeroLag** is an Android app that helps Nigerian mobile gamers (and anyone
> on a bad network) get the best possible connection out of their phone:
> measure lag before a match, watch ping live in-game, and apply safe
> pre-match network optimizations.
>
> Status: **M0–M1 scaffold built** (native Android project in this repo).

---

## 1. Vision

Nigerians pay for data but suffer slow/unstable networks. An app **cannot
make a tower broadcast a stronger signal** — radio coverage is physics. But
software *can*:

- measure what's wrong (signal bars lie; dBm/ping/jitter don't),
- tell the gamer **when it's safe to start a ranked match**,
- force a fresh tower lock via a guided quick airplane-mode toggle,
- route DNS through fast resolvers (gaming VPN profile) to cut matchmaking
  lag,
- show a floating ping HUD over games like **eFootball**, COD Mobile, PUBG,
  MLBB, Free Fire,
- and (later) map which carrier is best where, from crowdsourced data.

**Honesty principle:** every action must do something real. No fake progress
bars, no root-only shell commands dressed up as features, no "200% faster"
claims. This keeps us on the Play Store and builds trust with gamers.

## 2. Platform

**Android only, native Kotlin + Jetpack Compose** (minSdk 26 / Android 8.0+).
Rationale vs cross-platform: the core features are deep Android APIs
(TelephonyManager cell metrics, VpnService, overlay foreground service,
usage stats) — native Kotlin is the most reliable path and matches the
target market (budget Android phones in Nigeria). iOS is out of scope.

## 3. Target users & market

- **Primary:** mobile gamers, especially eFootball players (one frame of
  lag = one conceded goal), on MTN / Airtel / Glo / 9mobile.
- **Secondary:** anyone frustrated with slow 3G/4G who wants to know *why*
  and what to do (switch SIM? move? toggle radio?).

## 4. The golden rule for gamers: two modes

ZeroLag must **never** reset a connection while a match is live (instant
forfeit). So:

| **Pre-Match Mode** (aggressive fixes) | **In-Game Mode** (passive only) |
|---|---|
| Guided radio/airplane refresh | Floating ping HUD (read-only) |
| Gaming DNS activation (VpnService) | Silent lag-spike logging |
| Match-readiness test (ping/jitter/loss) | Zero resets, zero VPN changes |
| SIM/network recommendation | Post-match lag report |

## 5. Feature roadmap

### M0 — Foundation ✅ (this scaffold)
- Native Gradle project, Jetpack Compose, dark neon theme (#00FF88),
  single dashboard screen, permission flow skeleton.

### M1 — Diagnostics ✅ (in this scaffold)
- **Match-readiness test:** real RTT samples (TCP-connect probe to
  1.1.1.1/8.8.8.8:443 — no root, works on all devices) → avg ping, jitter,
  packet loss %, verdict: **MATCH READY** (<80ms, <15ms jitter, 0% loss)
  vs **RISKY**.
- **Signal card:** carrier name, network tech (5G/4G/3G/Wi-Fi), real RSRP
  in dBm from `TelephonyManager.allCellInfo`, quality label.
- **Floating ping HUD:** foreground service + `TYPE_APPLICATION_OVERLAY`
  window that sits over games, updates every 2s, color-coded.
- **One-tap network refresh (honest):** Android forbids apps toggling
  airplane mode/radio directly, so ZeroLag opens the right settings screen
  with a clear 5-second instruction (ON → wait → OFF) which forces the
  phone to re-register on the strongest nearby tower.

### M2 — Gaming DNS "Network Boost"
- Local `VpnService` that routes **only DNS queries** (zero payload
  overhead) through Cloudflare/Google resolvers + blocks ad/tracker hosts;
  big explicit consent screen; Play Console VpnService justification form.
- Toggle lives in **pre-match** only; HUD shows "DNS boost active".

### M3 — Lag intelligence
- Continuous background logging (WorkManager, battery-friendly) of drops &
  spikes; post-match report card ("Airtel lost 12 packets at 12:04").
- Per-game / per-region ping targets (eFootball EU/ME servers, etc.).

### M4 — Crowdsourced coverage map
- Anonymous (lat/lng rounded, carrier, tech, dBm, speed) telemetry upload
  with explicit opt-in.
- Backend: Node/Go + PostgreSQL/PostGIS; heatmap per carrier
  (MTN/Airtel/Glo/9mobile). Privacy-first, no personal identifiers.

### M5 — Dual-SIM assistant
- Monitor both SIMs; notify "MTN is 3x faster here — switch data SIM"
  (deep-link to settings; Android blocks silent data-SIM switching).

### M6 — Polish, launch & monetization
- Onboarding with permission education, OEM autostart guides (Tecno,
  Infinix, Xiaomi, Samsung kill background services aggressively),
  widgets, crash reporting, Play Store listing & internal testing.

## 6. Monetization (from the Gemini strategy, adopted)

- **Free tier:** manual refresh guide, signal reader, basic readiness test,
  public coverage map.
- **Pro Gamer (~₦1,000–1,500/month):** gaming DNS profiles per game,
  floating HUD, auto-advisor, history/insights.
- **Rewarded ads:** "Watch 10s to run a deep DNS/socket refresh session."
- **B2B telemetry (later):** sell anonymized coverage intelligence to
  tower companies / ISPs.
- **Affiliate:** contextual SIM offers ("MTN is 95% 4G here — order a
  SIM").

## 7. Technical notes / corrections to early sketches

- ❌ `Runtime.exec("ip neighbor flush all")` — needs **root**, silently
  fails on normal phones. Removed. ZeroLag uses guided airplane toggle +
  (M2) DNS-level optimization instead.
- ❌ Apps **cannot** toggle airplane mode / re-register radio directly on
  modern Android (only system apps). We deep-link the user — takes 5
  seconds and genuinely works.
- ❌ Raw ICMP via `ping` shell command is blocked/unreliable on many OEM
  builds. ✅ We measure RTT with TCP-connect timing to well-known anycast
  endpoints — no root, deterministic.
- Android 14+ requires a declared foreground-service type — the HUD uses
  `specialUse` with a Play-justified subtype, plus POST_NOTIFICATIONS.
- Cell metrics (`allCellInfo`) require **location permission** granted;
  degrade gracefully when denied.

## 8. Project layout (native Android)

```
app/src/main/java/com/zerolag/app/
  MainActivity.kt          # Compose host + permission flow
  ZeroLagApplication.kt    # notification channels
  ui/        HomeScreen.kt, theme/ (Color, Theme, Type)
  net/       PingProbe.kt, ReadinessChecker.kt, SignalMonitor.kt
  boost/     NetworkRefresher.kt        # honest guided refresh
  hud/       PingOverlayService.kt      # floating in-game ping
  (M2) vpn/  GamingDnsVpnService.kt     # not yet built
```

## 9. Build & run

Open the repo root in **Android Studio (Jellyfish or newer)**, JDK 17, let
Gradle sync, plug in an Android phone with USB debugging, press Run.
See [BUILD.md](BUILD.md) for details.

## 10. Open questions

1. Confirmed pricing ~₦1,000–1,500/mo for Pro? Any preferred Paystack/
   Flutterwave/Google Play billing split?
2. Ship English-only first, or Pidgin mode for fun ("Network dey kampe")?
3. Which game server hosts should M3 ping for eFootball in Africa/EU?
