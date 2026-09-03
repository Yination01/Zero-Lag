# Zero-Lag Google Play closed-testing readiness

**Status: Build 12 technical candidate completed successfully. Public release blocked.**

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
| Android target | The completed Build 12 AAB manifest reports compile SDK 36 and target SDK 36. See `BUILD_12_EVIDENCE.md`. | Preserve built-manifest evidence for the Console upload |
| Artifact type | The production EAS route published a 39,137,186-byte `zero-lag.aab`, SHA-256 recorded in `BUILD_12_EVIDENCE.md`. | Upload only after the external gates below are complete |
| Candidate build route | The user-named GitHub-local workflow completed every source, local build, ZIP, signature, artifact, and prerelease gate successfully. It did not submit to Play. | Do not create another numbered candidate unless a later source change needs one |
| Store icon | `assets/play-store/zero-lag-play-icon.png`, 512 by 512 RGB PNG | Upload in Play Console |
| Feature graphic | `assets/play-store/zero-lag-feature-graphic.png`, 1024 by 500 RGB PNG | Upload if selected for listing surfaces |
| Listing copy | `docs/play/STORE_LISTING.md` | Review and paste into Play Console |
| Data disclosures | Existing local-only draft plus Console handoff | Validate against the exact built app and all SDK behavior |

## Build 12 technical evidence

[Build 12 evidence](BUILD_12_EVIDENCE.md) records the completed workflow,
prerelease AAB, SHA-256, archive, bundle structure, signature, and built
manifest checks. The AAB is a technical candidate only. It has not been
uploaded to the Google Play Console or installed on a real device.

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
