import React, { useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { Card, SectionLabel, Muted, GhostButton } from './components';
import { buildBoostActions, type BoostAction } from '../boost/actions';

const c = tokens.color;

// Real permission/device state is supplied by native plugins at runtime.
// This starts from a safe, denied default so nothing is faked.
const DEFAULT_CTX = { tier: 'entry' as const, usagePermission: false, overlayPermission: false };

export function BoostScreen({
  onRequestUsage,
  usagePermission = false,
  tier = 'entry',
}: {
  onRequestUsage: () => void;
  usagePermission?: boolean;
  tier?: 'entry' | 'midrange' | 'flagship';
}) {
  const actions = useMemo(
    () => buildBoostActions({ ...DEFAULT_CTX, tier, usagePermission }),
    [tier, usagePermission],
  );

  function run(action: BoostAction) {
    if (action.gated) {
      if (action.requiresPermission === 'usage') {
        Alert.alert(
          action.label,
          'This needs Usage Access so Zero-Lag can list background hogs. It never closes them for you, it opens the stop screen.',
          [{ text: 'Grant access', onPress: onRequestUsage }, { text: 'Cancel', style: 'cancel' }],
        );
        return;
      }
      Alert.alert(action.label, 'Coming in a later build.');
      return;
    }
    if (action.kind === 'toggle' && action.id === 'wakelock') {
      // keep-awake is applied by the app itself while the HUD session runs
      Alert.alert(action.label, 'Screen stay-awake applies during an active HUD session.');
      return;
    }
    if (action.target) {
      Linking.openURL(action.target).catch(() => Alert.alert('Could not open settings', 'Open Settings manually and look for the matching option.'));
    }
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Boost</Text>
      <Muted text="Real, safe optimizations. Zero-Lag never kills apps silently or overclocks the phone." />

      {actions.map((a) => (
        <Card key={a.id} testID={`boost-${a.id}`}>
          <SectionLabel text={a.gated ? 'NEEDS PERMISSION / PENDING' : 'AVAILABLE'} />
          <Text style={styles.name}>{a.label}</Text>
          <Muted text={a.description} />
          <GhostButton
            label={a.gated && a.requiresPermission === 'usage' ? 'GRANT USAGE ACCESS' : 'OPEN'}
            onPress={() => run(a)}
            accessibilityLabel={`${a.label} action`}
          />
        </Card>
      ))}

      <View>
        <Muted
          color={c.warn}
          text="Android blocks apps from force-stopping other apps. The hog list opens each app's info screen so you stop it yourself. Do any refresh before matchmaking, never during a match."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 48, paddingBottom: 96 },
  title: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  name: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '700' },
});
