import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { verdictColor } from './theme';
import { useReadiness } from '../state/useReadiness';
import { verdictLabel } from '../net/readiness';
import { NETWORK_ANALYSIS_GUIDANCE } from '../net/probe';
import { REFRESH_INSTRUCTIONS, openAirplaneModeSettings } from '../net/refresh';
import { settingsLaunchFeedback } from '../permissions/settings';
import { hud } from '../plugins/hud';
import type { TuningProfile } from '../device/tier';

const c = tokens.color;

function profileLabel(profile: TuningProfile['profile']): string {
  return profile.charAt(0).toUpperCase() + profile.slice(1);
}

export function HomeScreen({
  onGoGame,
  onRequestOverlay,
  sampleCount = 8,
  hudIntervalMs = 3000,
  performanceLevel = 'balanced',
}: {
  onGoGame?: () => void;
  onRequestOverlay?: () => void;
  sampleCount?: number;
  hudIntervalMs?: number;
  performanceLevel?: TuningProfile['profile'];
} = {}) {
  const { state, result, error, run } = useReadiness({ sampleCount });
  const [barOn, setBarOn] = useState(false);

  useEffect(() => {
    let active = true;
    void hud.isRunning().then((running) => {
      if (active) setBarOn(running);
    });
    return () => { active = false; };
  }, []);

  const onRefresh = useCallback(async () => {
    const outcome = await openAirplaneModeSettings(Linking);
    if (outcome !== 'opened') {
      Alert.alert('Open Airplane mode settings', settingsLaunchFeedback('airplane-mode', outcome));
    }
  }, []);

  const onHud = useCallback(async () => {
    if (!hud.isSupported()) {
      Alert.alert(
        'Floating HUD is unavailable',
        'Install the latest Zero-Lag APK, then allow Display over other apps before starting the HUD.',
      );
      return;
    }

    const canDraw = await hud.canDrawOverlays();
    if (!canDraw) {
      if (onRequestOverlay) {
        onRequestOverlay();
      } else {
        Alert.alert(
          'Set up the floating HUD',
          'Open Android Settings, select Display over other apps, select Zero-Lag, turn it on, then return here.',
        );
      }
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
  }, [barOn, hudIntervalMs, onRequestOverlay]);

  const verdictToken = result ? verdictColor(result.verdict) : 'good';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Zero-Lag</Text>
      <Text style={styles.tagline}>Connection checks and a floating ping HUD for mobile games</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>CURRENT CONNECTION</Text>
        <Text style={styles.cardTitle}>Test Wi-Fi or mobile data before you queue</Text>
        <Text style={styles.muted}>
          {`Current performance level: ${profileLabel(performanceLevel)}. It uses ${sampleCount} checks and a HUD update every ${hudIntervalMs / 1000} seconds.`}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>PRE-MATCH READINESS</Text>

        {state === 'loading' && (
          <Text style={styles.body}>Testing your connection. This takes a few seconds.</Text>
        )}

        {state === 'error' && (
          <View style={[styles.badge, { backgroundColor: c.danger + '22' }]}>
            <Text style={[styles.badgeText, { color: c.danger }]}>{error}</Text>
          </View>
        )}

        {state === 'success' && result && (
          <>
            <View style={[styles.badge, { backgroundColor: c[verdictToken] + '22' }]}>
              <Text style={[styles.badgeText, { color: c[verdictToken] }]}>
                {verdictLabel(result.verdict)}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Stat label="Edge estimate" value={`${result.avgPingMs} ms`} />
              <Stat label="Jitter" value={`${result.jitterMs} ms`} />
              <Stat label="Probe fails" value={`${result.lossPercent}%`} />
            </View>
            <Text style={styles.muted}>
              {`Based on ${result.samples} edge checks. Probe fails are failed web checks, not confirmed game packet loss.`}
            </Text>
          </>
        )}

        {state === 'idle' && (
          <Text style={styles.body}>Run a quick test before you queue for a match.</Text>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Run match readiness test"
          accessibilityState={{ disabled: state === 'loading' }}
          disabled={state === 'loading'}
          onPress={run}
          style={({ pressed }) => [
            styles.primaryButton,
            { opacity: pressed ? 0.8 : 1, backgroundColor: c.good },
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {state === 'loading' ? 'TESTING' : 'RUN MATCH-READINESS TEST'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>HOW ACCURATE IS THE TEST?</Text>
        <Text style={styles.body}>{NETWORK_ANALYSIS_GUIDANCE.method}</Text>
        <Text style={styles.muted}>{NETWORK_ANALYSIS_GUIDANCE.limitation}</Text>
        <Text style={styles.steps}>{NETWORK_ANALYSIS_GUIDANCE.recommendedUse.map((step, index) => `${index + 1}. ${step}`).join('\n')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>FLOATING PING HUD</Text>
        <Text style={styles.cardTitle}>Estimated edge delay and used RAM over your game</Text>
        <Text style={styles.muted}>
          {`Display over other apps is required. The HUD updates every ${hudIntervalMs / 1000} seconds and uses a foreground notification; allow Notifications if Android asks so that readout is visible. If overlay access is off, this button shows the setup steps.`}
        </Text>
        <Text style={[styles.hudStatus, { color: barOn ? c.good : c.muted }]}>
          {barOn ? 'HUD STATUS: RUNNING' : 'HUD STATUS: STOPPED'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle the floating ping HUD"
          onPress={() => { void onHud(); }}
          style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.secondaryButtonText}>{barOn ? 'STOP FLOATING HUD' : 'START FLOATING HUD'}</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open network refresh steps"
        onPress={() =>
          Alert.alert('Network refresh', REFRESH_INSTRUCTIONS, [
            { text: 'CANCEL', style: 'cancel' },
            { text: 'OPEN AIRPLANE MODE SETTINGS', onPress: () => { void onRefresh(); } },
          ])
        }
        style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={styles.secondaryButtonText}>GUIDED NETWORK REFRESH</Text>
      </Pressable>

      <Text style={[styles.muted, { color: c.warn }]}>
        Refresh before matchmaking, never during a live match.
      </Text>

      {onGoGame && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to per-game analysis"
          onPress={onGoGame}
          style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.secondaryButtonText}>PER-GAME ANALYSIS AND BOOST</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 56, paddingBottom: 48 },
  brand: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  tagline: { color: c.muted, fontSize: tokens.font.secondary, marginBottom: tokens.space.sm },
  card: {
    backgroundColor: c.surface,
    borderRadius: tokens.radius.card,
    padding: tokens.space.lg,
    gap: tokens.space.sm,
  },
  cardLabel: { color: c.muted, fontSize: tokens.font.secondary, fontWeight: '700' },
  cardTitle: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '700' },
  body: { color: c.onSurface, fontSize: tokens.font.body, lineHeight: 22 },
  muted: { color: c.muted, fontSize: tokens.font.secondary, lineHeight: 20 },
  steps: { color: c.onSurface, fontSize: tokens.font.secondary, lineHeight: 22 },
  badge: { borderRadius: tokens.radius.badge, padding: tokens.space.md },
  badgeText: { textAlign: 'center', fontWeight: '800', fontSize: tokens.font.body },
  hudStatus: { fontWeight: '800', fontSize: tokens.font.secondary },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: tokens.space.sm },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: c.onSurface, fontSize: tokens.font.stat, fontWeight: '800', textAlign: 'center' },
  primaryButton: {
    minHeight: tokens.minTouch + 10,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.space.sm,
  },
  primaryButtonText: { color: c.bg, fontWeight: '800', fontSize: tokens.font.body },
  secondaryButton: {
    minHeight: tokens.minTouch + 8,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.good,
    paddingHorizontal: tokens.space.md,
  },
  secondaryButtonText: { color: c.good, fontWeight: '700', fontSize: tokens.font.secondary, textAlign: 'center' },
});
