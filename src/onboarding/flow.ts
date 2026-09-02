// First-launch routing, separated from the React screen so every persisted
// state combination has a deterministic and testable destination.

import { canUseApp } from '../auth/session.ts';
import { needsConsent } from '../legal/consent.ts';

export type OnboardingStep = 'legal' | 'start' | 'permissions' | 'done';

export interface OnboardingStateInput {
  acceptedLegalVersion: string | null | undefined;
  session: unknown;
  permissionsComplete: unknown;
}

export function nextOnboardingStep(input: OnboardingStateInput): OnboardingStep {
  if (needsConsent(input.acceptedLegalVersion)) return 'legal';
  if (!canUseApp(input.session)) return 'start';
  return input.permissionsComplete === true ? 'done' : 'permissions';
}
