import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { tokens } from './theme';
import { verdictColor } from './theme';
import { useReadiness } from '../state/useReadiness';
import { verdictLabel } from '../net/readiness';
import { REFRESH_INSTRUCTIONS, openAirplaneModeSettings } from '../net/refresh';

const c = tokens.color;

export function HomeScreen({ onGoGame }: { onGoGame?: () => void } = {}) {
  const { state, result, error, run } = useReadiness();
  const [hudRequested, setHudRequested] = useState(false);

  const onRefresh = useCallback(async () => {
    await openAirplaneModeSettings(
      { openURL: (url) => Linking.openURL(url) },
      (url) => Linking.canOpenURL(url),
    );
  }, []);

  const onHud = useCallback(() => {
    // The floating overlay needs the native foreground service plugin
    // (plugins/zerolag-hud). Not shipped in this build, so we say so
    // honestly instead of faking an overlay.
    Alert.alert(
      'Floating ping HUD',
      'The in-game overlay needs the native HUD plugin, which is not in ' +
        'this build. Use the readiness test before a match for now.',
    );
    setHudRequested(true);
  }, []);

  const verdictToken = result ? verdictColor(result.verdict) : 'good';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Zero-Lag</Text>
      <Text style={styles.tagline}>Network optimizer for mobile gamers</Text>

      {/* Signal card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>CURRENT CONNECTION</Text>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>Tap test to measure</Text>
            <Text style={styles.muted}>Cellular or Wi-Fi</Text>
          </View>
          <Text style={styles.muted}>dBm shown by the</Text>
        </View>
        <Text style={styles.muted}>
          Signal strength (dBm) and carrier arrive with the native telephony
          plugin in the next build.
        </Text>
      </View>

      {/* Readiness card */}
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
              <Stat label="Ping" value={`${result.avgPingMs} ms`} />
              <Stat label="Jitter" value={`${result.jitterMs} ms`} />
              <Stat label="Loss" value={`${result.lossPercent}%`} />
            </View>
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

      {/* HUD card */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Floating ping HUD</Text>
            <Text style={styles.muted}>
              Live ping meter over your game. Passive, it never interrupts a
              match. {hudRequested ? '(Plugin pending.)' : ''}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Floating ping HUD info"
          onPress={onHud}
          style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.secondaryButtonText}>FLOATING PING HUD (NEXT BUILD)</Text>
        </Pressable>
      </View>

      {/* Refresh */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open network refresh steps"
        onPress={() =>
          Alert.alert('Network refresh', REFRESH_INSTRUCTIONS, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OPEN SETTINGS', onPress: onRefresh },
          ])
        }
        style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={styles.secondaryButtonText}>ONE-TAP NETWORK REFRESH (PRE-MATCH)</Text>
      </Pressable>

      <Text style={[styles.muted, { color: c.warn }]}>
        Use refresh before matchmaking, never during a live match.
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
  body: { color: c.onSurface, fontSize: tokens.font.body },
  muted: { color: c.muted, fontSize: tokens.font.secondary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderRadius: tokens.radius.badge, padding: tokens.space.md },
  badgeText: { textAlign: 'center', fontWeight: '800', fontSize: tokens.font.body },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: tokens.space.sm },
  stat: { alignItems: 'center' },
  statValue: { color: c.onSurface, fontSize: tokens.font.stat, fontWeight: '800' },
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
  secondaryButtonText: { color: c.good, fontWeight: '700', fontSize: tokens.font.secondary },
});
