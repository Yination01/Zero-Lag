# Zero-Lag Google Play closed-testing readiness

**Status: technical candidate source is ready for the named Build 12. Public release blocked.**

This record separates work that can be completed in source control from work
that needs a real public identity, real-device evidence, and access to the
Google Play Console. It is not legal advice and does not claim Play approval.

## Chosen release shape

| Item | Choice |
|---|---|
| First Play track | Closed testing |
| Initial market and language | Nigeria, English |
| Candidate build | Build 12 production Android App Bundle |
| Public policy host | GitHub Pages authorized, deployment held |
| Public contact | Placeholder retained at maintainer request |
| Console route | Prepare source and handoff materials only |
| Real screenshots | Maintainer will capture from an installed build |

## Technical gates

| Gate | Current source contract | Required before Play Console upload |
|---|---|---|
| Android target | Expo SDK 54, React Native 0.81, compile and target SDK 36 are explicit | Verify the built AAB manifest after Build 12 finishes |
| Artifact type | `production` EAS profile creates an `app-bundle` | Download and archive-check the Build 12 AAB |
| Candidate build route | Manual GitHub-local EAS workflow, numbered tag guard, Expo secret gate, source gate, bundle check, signature check, artifact, prerelease candidate | Run only the user-named Build 12 workflow |
| Store icon | `assets/play-store/zero-lag-play-icon.png`, 512 by 512 RGB PNG | Upload in Play Console |
| Feature graphic | `assets/play-store/zero-lag-feature-graphic.png`, 1024 by 500 RGB PNG | Upload if selected for listing surfaces |
| Listing copy | `docs/play/STORE_LISTING.md` | Review and paste into Play Console |
| Data disclosures | Existing local-only draft plus Console handoff | Validate against the exact built app and all SDK behavior |

## External gates that remain blocked

- A real developer or business name and working support email are required.
- A public, non-editable privacy-policy URL must replace the staged template.
  The template intentionally cannot be deployed while it contains a placeholder
  contact.
- A Google Play developer account and appropriately limited Console access are
  required to create the app record, choose testing availability, complete the
  declarations, and upload the AAB.
- Authentic screenshots must be captured from the app. Do not upload generated
  screen images or copyrighted game artwork.
- A real Android phone must run the device test plan, including consent,
  permissions, Usage Access, overlay, foreground notification, HUD lifecycle,
  history, game detection, network wording, launcher icon, adaptive-icon mask,
  and cold-start splash.

## Hard stop rules

Do not submit to Google Play, turn on GitHub Pages, claim policy compliance, or
mark a production release ready while the support email is a placeholder, the
policy URL is not public, screenshots are absent, or real-device results are
missing. A technically successful AAB is a candidate, not a Play launch.

## Evidence to retain

1. Build 12 GitHub workflow URL, source SHA, terminal result, artifact size,
   SHA-256, ZIP integrity result, and bundle-signature result.
2. Built-manifest target SDK inspection.
3. Complete tester roster and closed-test results, where Google requires them.
4. Original listing icon, feature graphic, and authentic phone screenshots.
5. Completed Play Console Data safety, content, ads, app access, and sensitive
   permissions declarations, matching the released app.
6. Public privacy-policy URL and working contact confirmation.
