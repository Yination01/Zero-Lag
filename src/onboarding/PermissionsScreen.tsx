import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../ui/theme';
import { PrimaryButton, GhostButton, Muted } from '../ui/components';
import { PERMISSIONS } from '../permissions/catalog';
import { hud } from '../plugins/hud';
import {
  openAndroidSettings,
  settingsLaunchFeedback,
  specialAccessGuide,
  type SettingsDestination,
} from '../permissions/settings';

const c = tokens.color;

export function PermissionsScreen({ onFinish }: { onFinish: () => void }) {
  async function requestRuntime() {
    try {
      const { PermissionsAndroid } = require('react-native');
      const map = [
        ['location', PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION],
        ['phone', PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE],
        ['notifications', PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS],
      ];
      for (const [, permission] of map) {
        if (permission) await PermissionsAndroid.request(permission);
      }
    } catch {
      Alert.alert(
        'Permission request did not open',
        'Open Android Settings, select Apps, select Zero-Lag, then select Permissions.',
      );
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
        label="ALLOW APP PERMISSIONS"
        onPress={requestRuntime}
        accessibilityLabel="Allow location phone state and notification permissions"
      />
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
