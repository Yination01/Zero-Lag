# Compliance notes for Zero-Lag

This file is for the maintainer and for agents. **It is not legal advice.**
It is not a substitute for counsel before a Play listing or a public launch.

Last updated: 2026-08-29.

## Product honesty (Play and advertising)

Google Play rejects deceptive booster claims. Zero-Lag must not say it:

- raises tower signal
- kills background apps silently
- overclocks the CPU
- makes a device a round-number percent faster

Allowed: real ping / jitter / loss, an estimated game ping, a guided hog
list that opens App Info, Game Mode DND, brightness, keep-awake, and a
clear denied state when a permission is off.

`docs/SCOPE.md` is the truth table. Marketing copy must not outrun it.

## Third-party games

Nominative fair use only. Do not use official art, sounds, or logos from
COD, eFootball, PUBG, Free Fire, or MLBB. Package names in a detection map
are identifiers, not a partnership.

## Privacy and NDPR

`PRIVACY.md` is the public policy. Local-only until a host is named.
Location is for signal quality, not maps. Usage Access is for the
foreground game package only.

A public listing without a reachable privacy contact is incomplete. The
inbox is still `legal-contact-placeholder@example.com`. Name a real one
before Play or a download page.

## Children

13+. Not a kids app. Do not put it in the Designed for Families programme.

## Overlay, Usage Access, location, phone state

Each needs an in-app why screen. Play Data safety must match
`PLAY_DATA_SAFETY.md`. If a permission is added or dropped, update that
file the same day.

## No live host

Cloud analytics, accounts, and payments stay shut. Adding any of them is
a material privacy change: new policy date, consent re-prompt, and a
named host in `docs/DECISIONS.md`.

## Jurisdiction

Nigeria. Courts, no arbitration. See `TERMS.md`.

## UGC

This version has no public feed and no user-generated posts. If chat,
clips, or a community board are added, add a notice-and-takedown path
the same day. Do not claim DMCA or a US statute we do not use.

## AI

This version does not send your packets to an AI model to draft messages.
If an AI feature is added, disclose it in Terms and on the screen that
runs it, the same day.

## What this file does not do

It does not make Zero-Lag "compliant". It records the rules we have
already chosen so they cannot live only in chat.
