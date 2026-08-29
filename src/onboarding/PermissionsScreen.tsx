import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../ui/theme';
import { PrimaryButton, GhostButton, Muted } from '../ui/components';
import { PERMISSIONS } from '../permissions/catalog';

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
      for (const [, perm] of map) {
        if (perm) await PermissionsAndroid.request(perm);
      }
    } catch {
      // permission prompts are best effort; special perms use settings below
    }
  }

  async function openSpecial(uri?: string) {
    if (uri) await Linking.openURL(uri).catch(() => undefined);
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Permissions</Text>
      <Muted text="Zero-Lag asks for each permission only for the reason shown. Nothing is uploaded. You can skip and grant later from the app." />

      {PERMISSIONS.map((p) => (
        <View key={p.key} style={styles.card}>
          <Text style={styles.name}>{p.label}</Text>
          <Text style={styles.why}>{p.why}</Text>
          {p.kind === 'special' && (
            <GhostButton
              label={`OPEN ${p.label.toUpperCase()} SETTINGS`}
              onPress={() => openSpecial(p.settingsUri)}
              accessibilityLabel={`Grant ${p.label} in settings`}
            />
          )}
        </View>
      ))}

      <PrimaryButton
        label="ALLOW APP PERMISSIONS"
        onPress={requestRuntime}
        accessibilityLabel="Allow runtime permissions"
      />
      <GhostButton label="ENTER APP" onPress={onFinish} accessibilityLabel="Finish and enter app" />
      <Muted text="The floating game bar needs overlay and notifications. Usage access lets us detect the open game. You can enable these at any time." />
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
});
