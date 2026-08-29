import React, { useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { Card, SectionLabel, Muted, GhostButton, PrimaryButton } from './components';
import { buildBoostActions, type BoostAction } from '../boost/actions';
import { hud } from '../plugins/hud';

const c = tokens.color;

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
  const [barOn, setBarOn] = useState(false);

  async function toggleGameBar() {
    if (!hud.isSupported()) {
      Alert.alert('Game bar', 'Available after the app is built to your phone. The overlay is a native feature.');
      return;
    }
    const can = await hud.canDrawOverlays();
    if (!can) {
      Linking.openURL('android.settings.action.MANAGE_OVERLAY_PERMISSION').catch(() => undefined);
      Alert.alert('Display over other apps', 'Grant overlay permission, then tap the game bar button again.');
      return;
    }
    if (barOn) {
      await hud.stop();
      setBarOn(false);
    } else {
      await hud.start();
      setBarOn(true);
    }
  }

  function run(action: BoostAction) {
    if (action.gated) {
      if (action.requiresPermission === 'usage') {
        Alert.alert(
          action.label,
          `${action.doesWhat}\n\nWhy: ${action.whyItWorks}`,
          [{ text: 'Grant usage access', onPress: onRequestUsage }, { text: 'Cancel', style: 'cancel' }],
        );
        return;
      }
      Alert.alert(action.label, `${action.doesWhat}\n\nWhy: ${action.whyItWorks}`);
      return;
    }
    if (action.kind === 'toggle' && action.id === 'wakelock') {
      Alert.alert(action.label, `${action.doesWhat}\n\nWhy: ${action.whyItWorks}`);
      return;
    }
    if (action.target) {
      Linking.openURL(action.target).catch(() =>
        Alert.alert('Open settings', 'Could not open that screen directly. Open Settings and find the matching option.'),
      );
    }
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Boost</Text>

      <Card testID="game-bar-card">
        <SectionLabel text="GAME BAR (ALWAYS-VISIBLE OVERLAY)" />
        <Text style={styles.name}>Floating ping and RAM bar</Text>
        <Muted text="Shows live ping and used RAM as a small pill over games and apps, plus the same line in the notifications shade so it is always visible. It only reads, it never resets your connection." />
        <PrimaryButton
          label={barOn ? 'STOP GAME BAR' : 'START GAME BAR'}
          onPress={toggleGameBar}
          accessibilityLabel="Toggle the floating game bar"
        />
      </Card>

      <Muted text="Each action below states exactly what happens and why it works. Zero-Lag never silently closes apps, overclocks, or boosts tower signal, because Android does not allow it." />

      {actions.map((a) => (
        <Card key={a.id} testID={`boost-${a.id}`}>
          <SectionLabel text={a.gated ? 'NEEDS PERMISSION / PENDING' : 'AVAILABLE'} />
          <Text style={styles.name}>{a.label}</Text>
          <Text style={styles.body}>What it does: {a.doesWhat}</Text>
          <Text style={styles.why}>Why it works: {a.whyItWorks}</Text>
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
          text="Always do network refresh before matchmaking, never during a live match."
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
  body: { color: c.onSurface, fontSize: tokens.font.body, lineHeight: 21 },
  why: { color: c.muted, fontSize: tokens.font.secondary, lineHeight: 20 },
});
