import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../ui/theme';
import { PrimaryButton, GhostButton, Muted } from '../ui/components';
import { PERMISSIONS } from '../permissions/catalog';
import { hud } from '../plugins/hud';
import { createRunGate } from '../state/runGate';
import {
  summarizeRuntimePermissionResults,
  type RuntimePermissionSummary,
} from '../permissions/runtime';
import {
  openAndroidSettings,
  settingsLaunchFeedback,
  specialAccessGuide,
  type SettingsDestination,
} from '../permissions/settings';

const c = tokens.color;

type RuntimeRequestState =
  | { kind: 'idle' | 'requesting' | 'error' }
  | { kind: 'complete' | 'partial'; summary: RuntimePermissionSummary };

export function PermissionsScreen({ onFinish }: { onFinish: () => void }) {
  const [runtimeRequest, setRuntimeRequest] = useState<RuntimeRequestState>({ kind: 'idle' });
  const requestGate = useRef(createRunGate()).current;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function requestRuntime() {
    if (!requestGate.tryAcquire()) return;
    setRuntimeRequest({ kind: 'requesting' });
    try {
      const { PermissionsAndroid } = require('react-native');
      const runtimePermissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ].filter((permission): permission is string => typeof permission === 'string');
      const results: unknown[] = [];
      for (const permission of runtimePermissions) {
        results.push(await PermissionsAndroid.request(permission));
      }
      const summary = summarizeRuntimePermissionResults(results);
      if (mounted.current) {
        setRuntimeRequest({ kind: summary.complete ? 'complete' : 'partial', summary });
      }
    } catch {
      if (mounted.current) setRuntimeRequest({ kind: 'error' });
    } finally {
      requestGate.release();
    }
  }

  async function openSpecial(destination: SettingsDestination) {
    if (destination === 'display-over-other-apps' && await hud.openOverlaySettings()) {
      return;
    }
    const result = await openAndroidSettings(Linking, destination);
    if (result !== 'opened') {
      const guide = specialAccessGuide(destination);
      Alert.alert(guide?.title ?? 'Open Android settings', settingsLaunchFeedback(destination, result));
    }
  }

  const requestingRuntime = runtimeRequest.kind === 'requesting';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Permissions</Text>
      <Muted text="Choose only the access you want to use. Nothing is uploaded. The two special settings below use Android Settings and include every step." />

      {PERMISSIONS.map((permission) => {
        const guide = permission.settingsDestination
          ? specialAccessGuide(permission.settingsDestination)
          : null;
        return (
          <View key={permission.key} style={styles.card}>
            <Text style={styles.name}>{permission.label}</Text>
            <Text style={styles.why}>{permission.why}</Text>
            {permission.kind === 'runtime' && (
              <Muted text="Tap Allow app permissions below, then choose Allow in the Android prompt." />
            )}
            {guide && permission.settingsDestination && (
              <>
                <Text style={styles.steps}>{[...guide.steps, guide.returnToAppStep].join('\n')}</Text>
                <GhostButton
                  label={guide.openLabel}
                  onPress={() => { void openSpecial(permission.settingsDestination!); }}
                  accessibilityLabel={guide.openLabel}
                />
              </>
            )}
          </View>
        );
      })}

      <PrimaryButton
        label={requestingRuntime ? 'REQUESTING PERMISSIONS' : 'ALLOW APP PERMISSIONS'}
        disabled={requestingRuntime}
        onPress={() => { void requestRuntime(); }}
        accessibilityLabel="Allow location phone state and notification permissions"
      />
      {runtimeRequest.kind === 'requesting' && (
        <Muted text="Waiting for Android permission choices." />
      )}
      {runtimeRequest.kind === 'complete' && (
        <Muted color={c.good} text={`Android allowed ${runtimeRequest.summary.granted} of ${runtimeRequest.summary.requested} requested app permissions.`} />
      )}
      {runtimeRequest.kind === 'partial' && (
        <Muted color={c.warn} text={`Android allowed ${runtimeRequest.summary.granted} of ${runtimeRequest.summary.requested} requested app permissions. You can continue, and unavailable data stays clearly labelled.`} />
      )}
      {runtimeRequest.kind === 'error' && (
        <Muted color={c.warn} text="Android did not open the permission request. Open Settings, Apps, Zero-Lag, then Permissions, and try again." />
      )}
      <GhostButton label="ENTER ZERO-LAG" onPress={onFinish} accessibilityLabel="Finish permissions and enter Zero-Lag" />
      <Muted text="You can skip any permission and enable it later. Zero-Lag shows unavailable data instead of guessing." />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 56, paddingBottom: 48 },
  brand: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  card: { backgroundColor: c.surface, borderRadius: tokens.radius.card, padding: tokens.space.lg, gap: tokens.space.sm },
  name: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  why: { color: c.muted, fontSize: tokens.font.body, lineHeight: 21 },
  steps: { color: c.onSurface, fontSize: tokens.font.secondary, lineHeight: 22 },
});
