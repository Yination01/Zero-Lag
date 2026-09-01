import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { Card, SectionLabel, Muted, GhostButton, PrimaryButton } from './components';
import { buildBoostActions, type BoostAction } from '../boost/actions';
import { hud } from '../plugins/hud';
import { openAndroidSettings, settingsLaunchFeedback } from '../permissions/settings';
import { REFRESH_INSTRUCTIONS } from '../net/refresh';
import type { TuningProfile } from '../device/tier';

const c = tokens.color;

const DEFAULT_CTX = { tier: 'entry' as const, usagePermission: false, overlayPermission: false };

function profileLabel(profile: TuningProfile['profile']): string {
  return profile.charAt(0).toUpperCase() + profile.slice(1);
}

export function BoostScreen({
  onRequestUsage,
  onRequestOverlay,
  usagePermission = false,
  tier = 'entry',
  hudIntervalMs = 3000,
  performanceLevel = 'balanced',
}: {
  onRequestUsage: () => void;
  onRequestOverlay: () => void;
  usagePermission?: boolean;
  tier?: 'entry' | 'midrange' | 'flagship';
  hudIntervalMs?: number;
  performanceLevel?: TuningProfile['profile'];
}) {
  const actions = useMemo(
    () => buildBoostActions({ ...DEFAULT_CTX, tier, usagePermission }),
    [tier, usagePermission],
  );
  const [barOn, setBarOn] = useState(false);

  useEffect(() => {
    let active = true;
    void hud.isRunning().then((running) => {
      if (active) setBarOn(running);
    });
    return () => { active = false; };
  }, []);

  async function toggleGameBar() {
    if (!hud.isSupported()) {
      Alert.alert(
        'Floating HUD is unavailable',
        'Install the latest Zero-Lag APK, then allow Display over other apps before starting the HUD.',
      );
      return;
    }
    const canDraw = await hud.canDrawOverlays();
    if (!canDraw) {
      onRequestOverlay();
      return;
    }

    try {
      const serviceRunning = barOn || await hud.isRunning();
      if (serviceRunning) {
        await hud.stop();
        setBarOn(false);
        Alert.alert('Floating HUD stopped', 'The overlay and its ongoing notification have been stopped.');
      } else {
        await hud.start(hudIntervalMs);
        setBarOn(true);
        Alert.alert(
          'Floating HUD started',
          'Look for the small Zero-Lag pill over your game and its ongoing notification. The delay shown is an edge estimate, not exact game-server ping.',
        );
      }
    } catch {
      Alert.alert(
        'Could not start the floating HUD',
        'Check Display over other apps and Notifications for Zero-Lag, then try again.',
      );
    }
  }

  async function openActionSettings(action: BoostAction) {
    if (!action.target) return;
    const outcome = await openAndroidSettings(Linking, action.target);
    if (outcome !== 'opened') {
      Alert.alert(`Open ${action.label}`, settingsLaunchFeedback(action.target, outcome));
    }
  }

  function run(action: BoostAction) {
    if (action.gated) {
      if (action.requiresPermission === 'usage') {
        Alert.alert(
          action.label,
          `${action.doesWhat}\n\nWhy: ${action.whyItWorks}`,
          [{ text: 'GRANT USAGE ACCESS', onPress: onRequestUsage }, { text: 'CANCEL', style: 'cancel' }],
        );
        return;
      }
      Alert.alert(action.label, `${action.doesWhat}\n\nWhy: ${action.whyItWorks}`);
      return;
    }
    if (action.id === 'refresh') {
      Alert.alert('Network refresh', REFRESH_INSTRUCTIONS, [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'OPEN AIRPLANE MODE SETTINGS', onPress: () => { void openActionSettings(action); } },
      ]);
      return;
    }
    if (action.target) {
      void openActionSettings(action);
    }
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Boost</Text>

      <Card testID="game-bar-card">
        <SectionLabel text="FLOATING PING HUD" />
        <Text style={styles.name}>Estimated edge delay and used RAM over your game</Text>
        <Muted text={`Display over other apps is required. Current ${profileLabel(performanceLevel)} level updates the HUD every ${hudIntervalMs / 1000} seconds. It uses a foreground notification; allow Notifications if Android asks so that readout is visible.`} />
        <Muted text="If Display over other apps is off, Start Floating HUD opens a step-by-step setup prompt." />
        <Text style={[styles.hudStatus, { color: barOn ? c.good : c.muted }]}>{barOn ? 'HUD STATUS: RUNNING' : 'HUD STATUS: STOPPED'}</Text>
        <PrimaryButton
          label={barOn ? 'STOP FLOATING HUD' : 'START FLOATING HUD'}
          onPress={() => { void toggleGameBar(); }}
          accessibilityLabel="Toggle the floating ping HUD"
        />
      </Card>

      <Card testID="recommended-boost-settings-card">
        <SectionLabel text="RECOMMENDED SETTINGS" />
        <Text style={styles.steps}>
          {'1. Use Auto performance level in Device.\n2. Run the network test before matchmaking.\n3. Turn on the HUD only while you are playing.\n4. Use Guided network refresh only before a match.'}
        </Text>
      </Card>

      <Muted text="Each action says what it opens and why it can help. Zero-Lag never silently closes apps, overclocks, or boosts tower signal." />

      {actions.map((action) => (
        <Card key={action.id} testID={`boost-${action.id}`}>
          <SectionLabel text={action.gated ? 'NEEDS PERMISSION / PENDING' : 'AVAILABLE'} />
          <Text style={styles.name}>{action.label}</Text>
          <Text style={styles.body}>What it does: {action.doesWhat}</Text>
          <Text style={styles.why}>Why it works: {action.whyItWorks}</Text>
          <GhostButton
            label={action.gated && action.requiresPermission === 'usage' ? 'GRANT USAGE ACCESS' : 'OPEN'}
            onPress={() => run(action)}
            accessibilityLabel={`${action.label} action`}
          />
        </Card>
      ))}

      <View>
        <Muted
          color={c.warn}
          text="Run the network test and any refresh before matchmaking, never during a live match."
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
  hudStatus: { fontWeight: '800', fontSize: tokens.font.secondary },
  steps: { color: c.onSurface, fontSize: tokens.font.secondary, lineHeight: 22 },
});
