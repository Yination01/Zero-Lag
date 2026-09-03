# Build 12 Play candidate evidence

**Status: technical Android App Bundle candidate built successfully. This is not
Google Play submission, approval, or release readiness evidence.**

Build 12 is the single user-authorized production Android App Bundle candidate
for the API 36 source cut. It was built by the GitHub-local EAS workflow. The
workflow never contacted Google Play to create an app, upload an artifact, or
submit a release.

## Source and workflow result

| Field | Verified value |
|---|---|
| Source cut | `df205cf58f061cea4a608d6a53a84413f3b8fd7e` |
| Workflow | [Build Zero-Lag Play candidate AAB, run 33731736686](https://github.com/Yination01/Zero-Lag/actions/runs/33731736686) |
| Workflow ID and run number | `349139383`, run `1` |
| Dispatch | `2026-09-03T08:08:15Z` by manual workflow dispatch with numeric input `12` |
| Terminal result | `completed/success` at `2026-09-03T08:16:47Z` |
| Completed workflow gates | named source checkout, Node 22 setup, candidate and release-tag guard, Expo secret gate, locked dependency install, source gate, candidate stamp, Gradle setup, local production AAB build, AAB verification, artifact upload, prerelease publication |
| Play interaction | None. The workflow has no Play submission step. |

The Build 12 source gate had already passed from the exact source cut: Node
`v22.23.2`, all seven source audits, TypeScript, and `123/123` application
tests. Expo Doctor passed `18/18`; resolved Expo configuration reported compile
SDK 36, target SDK 36, and build tools 36.0.0; Android Metro export bundled.

## Published AAB and workflow artifact

| Field | Verified value |
|---|---|
| GitHub prerelease | [play-candidate-12](https://github.com/Yination01/Zero-Lag/releases/tag/play-candidate-12), marked prerelease |
| Release target | `df205cf58f061cea4a608d6a53a84413f3b8fd7e` |
| Release asset | [`zero-lag.aab`](https://github.com/Yination01/Zero-Lag/releases/download/play-candidate-12/zero-lag.aab) |
| Release asset publication | `2026-09-03T08:16:30Z` |
| Release asset size | 39,137,186 bytes |
| SHA-256 | `dee12bc6a4adcfd6bc172a93d0afae724e80ce045fbd26dfc8df72896350448e` |
| Actions artifact | `zero-lag-play-candidate-aab-12`, ID `9884377528` |
| Actions artifact state | present and not expired when checked; ZIP download is scheduled to expire `2026-09-17T08:16:25Z` |

The Actions artifact is a GitHub workflow-artifact ZIP with API-reported size
38,789,773 bytes. The separately published raw AAB above was the file
independently downloaded and inspected. Preserve the SHA-256 with any later
Console handoff.

## Independent AAB inspection

The published release asset was downloaded after workflow completion. The checks
below were run against that downloaded file, not inferred only from source
configuration.

| Check | Result |
|---|---|
| Downloaded file length | 39,137,186 bytes, matching GitHub release metadata |
| SHA-256 | Matches the GitHub release digest and the value above |
| ZIP integrity | `unzip -tqq` passed |
| Expected AAB entries | `BundleConfig.pb`, `base/manifest/AndroidManifest.xml`, `base/dex/classes.dex`, and JAR signature metadata were present among 718 entries |
| Bundle structure | Bundletool `1.18.2` validation exited successfully |
| Built package | `com.yination01.zerolag` |
| Built version | version name `0.1.0`, version code `1` |
| Built SDK values | minimum SDK `24`; target SDK `36`; compile SDK `36` |
| JAR signature | `jarsigner -verify -certs -verbose` exited 0 and reported `jar verified` with SHA-256/RSA, 2048-bit signing material |

The signer certificate has SHA-256 fingerprint
`8C:A9:40:25:8D:A0:6F:61:46:5F:C1:8F:AC:9A:E5:3F:3B:F7:AE:DD:60:00:4C:01:40:FD:F8:F7:4C:56:0F:9B`.
It is self-signed with no timestamp, so strict JAR verification exits with the
expected untrusted-PKIX-chain warning. Ordinary signature verification passed.
This does not establish Play App Signing enrollment or an approved upload key;
those are Google Play Console actions still owned by the maintainer.

## Still blocked outside source control

- No Google Play Console account, app record, Play App Signing setup, closed
  testing track, tester group, or AAB upload has been created.
- The public contact remains a placeholder. No public, non-editable privacy
  policy URL exists, and the staged template must not be deployed yet.
- No authentic screenshots have been captured from an installed build.
- No real device has installed or tested this AAB or Build 11. An AAB is not a
  directly installable phone artifact.
- Data safety, content, ads, app access, sensitive-permission, and testing
  declarations must be completed truthfully in the Console against the final
  tested app.

Use `RELEASE_READINESS.md`, `CONSOLE_HANDOFF.md`, and
`SCREENSHOT_CAPTURE.md` only after these external gates are available. A
successful Build 12 means the technical candidate exists; it does not mean the
app is ready to publish to Google Play.
