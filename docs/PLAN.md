# Zero-Lag — Product & Technical Plan

> Mobile app that **measures network lag in real time** and **boosts device
> performance**, aimed at mobile gamers and users on slow networks / low-end
> devices.
>
> Status: **planning** — this document is the source of truth for v1 scope.

---

## 1. What Zero-Lag is

A single-tap "make my phone faster for this game" app with two engines:

1. **Network intelligence** — measures latency, jitter, packet loss and
   throughput; watches the connection *while you play* and warns you before
   lag spikes hit; optionally routes traffic through an optimized local-VPN
   profile (fast DNS, ad/tracker blocking that frees bandwidth).
2. **Performance boost** — monitors RAM, CPU, thermal state, battery and
   storage; frees memory where the OS allows, detects background hogs, and
   applies a "Game Mode" profile (Do-Not-Disturb, brightness/performance
   settings, stop background sync).

**Tagline direction:** *See the lag. Kill the lag.*

### Target users
- Mobile gamers (COD Mobile, FIFA, MLBB, Free Fire, etc. — huge audience in
  West Africa / NG market on budget Android phones and patchy networks).
- Users on 3G/4G with unstable connections who want to know *why* their
  network feels slow.
- People with entry-level devices (2–4 GB RAM) that stutter under load.

---

## 2. Platform reality check (read this before scoping)

Modern mobile OSes heavily restrict what "booster" apps can do. We must
build features that actually work and market honestly — Google Play and Apple
both reject apps with deceptive "RAM cleaner / 200% faster" claims.

| Capability | Android | iOS |
|---|---|---|
| Ping / jitter / packet loss test | ✅ Full | ✅ Full |
| Speed test (down/up) | ✅ Full | ✅ Full |
| Continuous background connection monitor | ✅ Foreground service | ⚠️ Limited (short background windows) |
| Local VPN for DNS optimization / ad-block | ✅ VpnService | ✅ NEPacketTunnelProvider (Network Extension) |
| Read RAM / CPU / thermal / battery stats | ✅ Via `ActivityManager` / `proc` / native module | ⚠️ Only memory footprint of *this* app; no system-wide CPU/RAM |
| Detect other apps' usage | ✅ Usage Access permission (`UsageStatsManager`) | ❌ Not possible |
| Kill background apps / free system RAM | ⚠️ Only own background tasks; system kills others automatically. Can show "hogs" and deep-link settings | ❌ Impossible |
| Clear app caches | ⚠️ Can only clear *own* cache; can deep-link users to settings | ❌ Impossible |
| Toggle DND / brightness / game mode | ✅ Do Not Disturb access + settings writes | ⚠️ Focus mode suggestions only; no programmatic toggles |
| Home-screen widget / overlay meter | ✅ Overlay + widgets | ⚠️ Widgets only (Live Activity possible on iOS 16+) |

**Consequence:** v1 is **Android-first**, with iOS shipping the network
toolset (ping/speed/VPN-DNS/widgets) and the dashboard. Android gets the deep
performance features. This matches the target market (budget Android).

**Honesty principle:** Every "boost" action must do something real or clearly
frame itself as guidance ("Tap to stop these apps yourself"). No fake
progress bars, no invented percentages.

---

## 3. Feature pillars

### Pillar A — Network (works on both OSes)
- **Quick Lag Test:** one tap → latency + jitter + packet loss + loss burst
  detection against regional targets (and later, game-server hosts).
- **Speed Test:** download/upload/throughput with a live graph.
- **Live Monitor (Android foreground service):** ping every second while
  gaming; overlay/HUD shows current ping; alerts on spike ("Network unstable
  320 ms — switch network?").
- **Connection history:** per-session stats, best/worst ping, reliability
  score per Wi-Fi network / SIM.
- **Smart DNS / Ad-block "Network Boost":** local VPN profile that uses
  fast resolvers (e.g. Cloudflare/Google) and blocks ad/tracker hosts —
  reduces bandwidth use and connection setup time. User explicitly consents;
  one tap to enable/disable; no traffic leaves the device to our servers.
- **Wi-Fi vs cellular comparison** and recommendation.

### Pillar B — Device performance (Android-deep, iOS-dashboard)
- **Device vitals dashboard:** RAM used/available, CPU load, battery temp &
  level, thermal throttling state, storage free.
- **Memory boost:** release our own caches + list top background apps (via
  Usage Access) with a one-tap deep link to App Info so the user force-stops;
  show real before/after *available RAM* numbers.
- **Storage finder:** flag big files, duplicate/junk, old downloads
(Android: MediaStore access; iOS: limited to own container + open Settings).
- **Game Mode profile:** with user-granted permissions — DND on, sync paused,
  screen stays awake, performance/brightness set; auto-ends when the game
  closes (Android Usage Events).
- **Boost report card:** after each session: avg ping, packet loss, RAM
  freed, thermal headroom, stability score 0–100.

### Pillar C — Product shell
- Onboarding + permission flow with clear "why we ask" screens.
- Home dashboard: big **BOOST** button, live ping ring, vitals strip.
- History/insights tab, settings (VPN, themes, units, servers).
- Local-first: everything works offline / without an account.

---

## 4. Tech stack (chosen)

**Mobile:** React Native + **Expo (dev client)**, TypeScript.
- Rationale: one codebase for Android + iOS, fast iteration, Expo Router for
  navigation, EAS Build for store binaries; native gaps (RAM/CPU/thermal,
  VpnService, UsageStats, foreground service, overlay) covered via small
  custom native modules through an Expo dev build + config plugins.
- State: **Zustand**; navigation: **Expo Router**; charts: react-native-svg
  + victory-native (or skia).
- Background work: Android foreground service (native module); iOS relies on
  in-app sessions + Live Activity/widget.

**Backend (thin, optional at launch):**
- Ping/speed **target endpoints** are just public anycast hosts + our own
  small reflector if needed. No account required for v1.
- Later: lightweight server (Node/Fastify or FastAPI) for leaderboards,
  server-region ping matrix, sync of history. Not in MVP.

**Testing/QA:** Jest + React Native Testing Library; Detox or Maestro for
on-device flows; manual test matrix on a low-end Android device.

---

## 5. App architecture

```
app/                        # Expo Router screens
  (tabs)/index.tsx          # Home dashboard: BOOST button + ping ring
  (tabs)/network.tsx        # Lag/speed tests, live monitor
  (tabs)/boost.tsx          # Memory/storage/game-mode actions
  (tabs)/history.tsx        # Session history & scores
  (tabs)/settings.tsx
  onboarding/               # Permissions + education

src/
  net/                      # Network engine
    ping.ts                 # ICMP-like / TCP-connect / UDP probe abstraction
    jitter.ts, loss.ts
    speedtest.ts            # Download/upload sampling
    vpn.ts                  # Local VPN lifecycle (Android VpnService / iOS NE)
    monitor.ts              # Foreground sampling loop + spike detection
  perf/                     # Device engine (native-module backed)
    vitals.ts               # RAM/CPU/thermal/battery
    memoryBoost.ts
    storage.ts
    gameMode.ts             # DND, brightness, wakelock, usage events
  store/                    # Zustand stores
  components/               # Gauges, rings, cards, charts
  lib/                      # Formatters, scoring, logging

modules/android/            # Custom native code (Kotlin)
  zerolag-vitals/           # ActivityManager / proc stat / thermal
  zerolag-vpn/              # VpnService wrapper
  zerolag-usage/            # UsageStatsManager
  zerolag-boost/            # DND access, settings, foreground svc
modules/ios/                # Swift (later phase)
```

**Key data model (local, SQLite/WatermelonDB or MMKV):**
- `Session { id, startedAt, networkType, avgPing, jitterMs, lossPct,
  downMbps, upMbps, ramBefore, ramAfter, thermalState, score }`
- `NetworkSample { t, pingMs, lost }` — time-series for charts.
- `BoostAction { type, result, timestamp }`.

---

## 6. Milestones

| # | Milestone | Deliverable |
|---|---|---|
| **M0** | Foundation | Expo + TS project, Expo Router, design system (dark, gamer aesthetic), tab navigation, Zustand, CI lint/test, this plan |
| **M1** | Network core | Quick lag test (ping/jitter/loss), speed test with live graph, results card + history stored locally |
| **M2** | Live monitor (Android) | Foreground service + ping HUD/overlay, spike notifications, session recording; iOS in-app version |
| **M3** | Device vitals | Native module: RAM/CPU/temp/battery dashboard with real numbers |
| **M4** | Boost actions | Memory boost w/ usage stats, Game Mode (DND + wakelock), storage finder; boost report card |
| **M5** | Network Boost VPN | Android VpnService: fast DNS + host blocklist; consent UI; iOS NE later |
| **M6** | Polish & launch | Onboarding/permission education, widgets, scores/insights, crash reporting, store assets, Play Store internal testing |

**MVP definition (M0–M4):** a user can open Zero-Lag, run a lag test, watch
live ping over a game session, see device vitals, tap BOOST, and get a real
before/after report — on Android.

---

## 7. Risks & constraints
- **Store policy:** Google Play restricts VpnService usage (must be
  purpose-justified), task-killer claims, and accessibility abuse. Apple
  restricts performance claims. Mitigation: honest copy, consent-first
  permissions, real measured numbers only.
- **OS variance:** Android OEM skins (Xiaomi, Tecno, Samsung, Infinix —
  common in NG) kill background services aggressively; need OEM-specific
  autostart instructions in onboarding.
- **Ping accuracy:** true ICMP needs raw sockets (restricted); use TCP-connect
  / HTTP-based probes with clear methodology; offer ICMP via VPN on Android.
- **Thermal/CPU APIs** differ by API level; degrade gracefully.

---

## 8. Open questions for you
1. **Launch region first?** Nigeria/Africa-only at start (cheaper servers,
   relevant targets) or global?
2. **Monetization:** free + ads? one-time Pro? subscription for VPN/boost?
3. **Game-specific targeting:** should we hardcode popular game server hosts
   (COD, MLBB, Free Fire…) for per-game ping?
4. **Brand look:** dark neon "gamer" style, or clean/light utility style?
5. App name confirmed as **Zero-Lag** for the Play Store listing?

---

*Next step after sign-off: build **M0** (project scaffold + design system) and
then **M1** (working lag test).*
