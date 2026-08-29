// Legal consent. Documents live in this repo and are shown in-app before
// first use. Consent is recorded against LEGAL_VERSION; bumping the version
// forces re-acceptance. This is not legal advice; a lawyer should review
// before Play launch.

export const LEGAL_VERSION = '1.0.0';

export interface LegalDoc {
  id: 'terms' | 'privacy' | 'eula';
  title: string;
  body: string;
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    body:
      'Zero-Lag is provided as is. It measures network quality and guides you ' +
      'to Android settings. It cannot increase tower signal, overclock your ' +
      'phone, or close other apps for you. Readings are estimates. You are ' +
      'responsible for how you use the guidance. Network and game names belong ' +
      'to their owners and are used only to identify them. Use of the app is ' +
      'voluntary and at your own risk.',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body:
      'Zero-Lag works offline and stores your test history and settings on your ' +
      'device only. We do not collect personal data in this version. Location ' +
      'is used only on-device to read signal strength and is not uploaded. No ' +
      'analytics are sent until a cloud host is named and you opt in. If cloud ' +
      'sync or analytics are added, they will be off by default and described ' +
      'here. You can clear all local data from Settings.',
  },
  {
    id: 'eula',
    title: 'End User License Agreement',
    body:
      'The app is licensed, not sold, for personal non-commercial use on your ' +
      'Android device. You may not reverse engineer the native plugins except as ' +
      'permitted by law, redistribute the app, or use it to break a game terms ' +
      'of service. We may stop updating the app. To the maximum extent allowed ' +
      'by law, our total liability for the app is zero. Some jurisdictions do ' +
      'not allow certain exclusions, in which case the law closest to this ' +
      'applies.',
  },
];

export function needsConsent(acceptedVersion: string | null | undefined): boolean {
  if (!acceptedVersion) return true;
  return acceptedVersion !== LEGAL_VERSION;
}
