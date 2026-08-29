import React, { useEffect, useState } from 'react';
import { LegalScreen } from './LegalScreen';
import { AuthScreen } from './AuthScreen';
import { PermissionsScreen } from './PermissionsScreen';
import { LEGAL_VERSION, needsConsent } from '../legal/consent';
import { getJson, setJson, KEYS } from '../storage';
import type { Session } from '../auth/session';

type Step = 'loading' | 'legal' | 'auth' | 'permissions' | 'done';

export function Onboarding({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>('loading');

  useEffect(() => {
    (async () => {
      const accepted = await getJson<string | null>(KEYS.legalVersion, null);
      if (needsConsent(accepted)) {
        setStep('legal');
        return;
      }
      const session = await getJson<Session | null>(KEYS.session, null);
      if (!session) {
        setStep('auth');
        return;
      }
      setStep('permissions'); // permissions screen also has "enter app", so repeat visits can skip
    })();
  }, []);

  if (step === 'loading') return null;

  if (step === 'legal') {
    return (
      <LegalScreen
        onAccept={async () => {
          await setJson(KEYS.legalVersion, LEGAL_VERSION);
          setStep('auth');
        }}
        onDecline={() => {
          // No forced continuation; user stays on the screen.
          setStep('legal');
        }}
      />
    );
  }

  if (step === 'auth') {
    return (
      <AuthScreen
        onContinue={async (session: Session) => {
          await setJson(KEYS.session, session);
          setStep('permissions');
        }}
      />
    );
  }

  if (step === 'permissions') {
    return <PermissionsScreen onFinish={() => setStep('done')} />;
  }

  return <>{children}</>;
}
