// Legal consent. The authoritative legal pack lives at the repo root
// (TERMS.md, PRIVACY.md, COPYRIGHT.md, COMPLIANCE.md, PLAY_DATA_SAFETY.md,
// LICENSE) and is enforced by .audit/legal.cjs. This module mirrors those
// documents for the in-app consent screen. Keep the claims honest and in
// line with the legal pack: Nigeria courts, no arbitration, age 13+, no live
// host, and no claim to raise signal, kill apps, or overclock.

export const LEGAL_VERSION = '1.0.0';

export interface LegalDoc {
  id: 'terms' | 'privacy' | 'eula';
  title: string;
  body: string;
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: 'terms',
    title: 'Terms of Use',
    body:
      'By using Zero-Lag you agree to the full Terms of Use (TERMS.md) and ' +
      'Privacy Policy (PRIVACY.md). You must be 13 or older. Disputes are ' +
      'resolved in the courts in Nigeria, without arbitration. Zero-Lag ' +
      'cannot raise tower signal, overclock your phone, or silently close ' +
      'other apps; it measures your network and guides you to Android ' +
      'settings. Game names are third-party marks and Zero-Lag is not ' +
      'affiliated with their owners.',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body:
      'In this version everything stays on your device. There is no live ' +
      'host and nothing is uploaded until one is named and you opt in. The ' +
      'Nigeria Data Protection Regulation (NDPR) applies. Location is used ' +
      'on-device to read signal strength, not for maps. Usage Access detects ' +
      'the open game. The overlay draws the game bar. Permissions are ' +
      'optional and each has a working denied state.',
  },
  {
    id: 'eula',
    title: 'End User License Agreement',
    body:
      'Zero-Lag is licensed, not sold, for personal lawful use on Android ' +
      'devices you own or control. Copyright 2026 Yination / Zero-Lag. All ' +
      'rights reserved. Do not reverse engineer the native plugins except ' +
      'as allowed by law, redistribute the app, or use it to break another ' +
      'app or a network terms of service. The app is provided as is, to the ' +
      'maximum extent permitted by law.',
  },
];

export function needsConsent(acceptedVersion: string | null | undefined): boolean {
  if (!acceptedVersion) return true;
  return acceptedVersion !== LEGAL_VERSION;
}
