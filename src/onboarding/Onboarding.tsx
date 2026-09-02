import React, { useEffect, useState } from 'react';
import { LegalScreen } from './LegalScreen';
import { StartScreen } from './StartScreen';
import { PermissionsScreen } from './PermissionsScreen';
import { LEGAL_VERSION } from '../legal/consent';
import { nextOnboardingStep, type OnboardingStep } from './flow';
import { getJson, setJson, KEYS } from '../storage';
import type { Session } from '../auth/session';

type Step = 'loading' | OnboardingStep;

export function Onboarding({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>('loading');

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const acceptedLegalVersion = await getJson<string | null>(KEYS.legalVersion, null);
        const session = await getJson<unknown>(KEYS.session, null);
        const permissionsComplete = await getJson<unknown>(KEYS.onboardingComplete, false);
        if (active) setStep(nextOnboardingStep({ acceptedLegalVersion, session, permissionsComplete }));
      } catch {
        // A damaged local store must not bypass legal consent or setup.
        if (active) setStep('legal');
      }
    })();
    return () => { active = false; };
  }, []);

  if (step === 'loading') return null;

  if (step === 'legal') {
    return (
      <LegalScreen
        onAccept={async () => {
          try {
            await setJson(KEYS.legalVersion, LEGAL_VERSION);
            setStep('start');
          } catch {
            setStep('legal');
          }
        }}
        onDecline={() => {
          // No forced continuation, the user stays on the screen.
          setStep('legal');
        }}
      />
    );
  }

  if (step === 'start') {
    return (
      <StartScreen
        onContinue={async (session: Session) => {
          try {
            await setJson(KEYS.session, session);
          } finally {
            setStep('permissions');
          }
        }}
      />
    );
  }

  if (step === 'permissions') {
    return (
      <PermissionsScreen
        onFinish={() => {
          void (async () => {
            try {
              await setJson(KEYS.onboardingComplete, true);
            } finally {
              setStep('done');
            }
          })();
        }}
      />
    );
  }

  return <>{children}</>;
}
