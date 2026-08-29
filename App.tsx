import { StatusBar } from 'expo-status-bar';
import { Root } from './src/ui/Root';
import { Onboarding } from './src/onboarding/Onboarding';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Onboarding>
        <Root />
      </Onboarding>
    </>
  );
}
