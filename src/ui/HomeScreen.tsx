import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { verdictColor } from './theme';
import { useReadiness } from '../state/useReadiness';
import { verdictLabel } from '../net/readiness';
import { NETWORK_ANALYSIS_GUIDANCE } from '../net/probe';
import { REFRESH_INSTRUCTIONS, openAirplaneModeSettings } from '../net/refresh';
import { settingsLaunchFeedback } from '../permissions/settings';
import type { TuningProfile } from '../device/tier';
import type { HudDisplayStatus } from '../hud/lifecycle';
import { hasEdgeResponse, sessionSummary, type StoredResult } from '../history/history';
import type { ReadinessResult } from '../net/readiness';

const c = tokens.color;

function profileLabel(profile: TuningProfile['profile']): string {
  return profile.charAt(0).toUpperCase() + profile.slice(1);
}

function hudStatusText(status: HudDisplayStatus): string {
  switch (status) {
    case 'checking': return 'CHECKING';
    case 'running': return 'RUNNING';
    case 'stopped': return 'STOPPED';
    case 'needs-overlay-permission': return 'SETUP NEEDED';
    case 'unavailable': return 'UNAVAILABLE';
    case 'status-unknown': return 'CHECK AGAIN';
  }
}

function hudStatusColor(status: HudDisplayStatus): string {
  if (status === 'running') return c.good;
  if (status === 'checking') return c.info;
  if (status === 'needs-overlay-permission' || status === 'status-unknown') return c.warn;
  return c.muted;
}

function hudButtonLabel(status: HudDisplayStatus): string {
  if (status === 'running') return 'STOP FLOATING HUD';
  if (status === 'checking') return 'CHECKING HUD STATUS';
  if (status === 'status-unknown') return 'CHECK HUD STATUS';
  if (status === 'needs-overlay-permission') return 'SET UP FLOATING HUD';
  if (status === 'unavailable') return 'HUD UNAVAILABLE';
  return 'START FLOATING HUD';
}

function recordedAt(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function HomeScreen({
  onGoGame,
  onToggleHud,
  onReadinessComplete,
  onClearHistory,
  onGoHistory,
  history = [],
  historyLoading = false,
  historySaving = false,
  historyError = null,
  hudStatus = 'checking',
  hudBusy = false,
  sampleCount = 8,
  hudIntervalMs = 3000,
  performanceLevel = 'balanced',
}: {
  onGoGame?: () => void;
  onToggleHud?: () => void;
  onReadinessComplete?: (result: ReadinessResult, game: string | null) => void;
  onClearHistory?: () => void;
  onGoHistory?: () => void;
  history?: StoredResult[];
  historyLoading?: boolean;
  historySaving?: boolean;
  historyError?: string | null;
  hudStatus?: HudDisplayStatus;
  hudBusy?: boolean;
  sampleCount?: number;
  hudIntervalMs?: number;
  performanceLevel?: TuningProfile['profile'];
} = {}) {
  const { state, result, error, run } = useReadiness({ sampleCount });
  const savedResults = useRef(new WeakSet<ReadinessResult>());
  const summary = sessionSummary(history);

  useEffect(() => {
    if (state !== 'success' || !result || !onReadinessComplete || savedResults.current.has(result)) return;
    savedResults.current.add(result);
    void onReadinessComplete(result, null);
  }, [onReadinessComplete, result, state]);

  const onRefresh = useCallback(async () => {
    const outcome = await openAirplaneModeSettings(Linking);
    if (outcome !== 'opened') {
      Alert.alert('Open Airplane mode settings', settingsLaunchFeedback('airplane-mode', outcome));
    }
  }, []);

  const verdictToken = result ? verdictColor(result.verdict) : 'good';
  const hudIsChecking = hudBusy || hudStatus === 'checking';
  const hudButtonDisabled = hudIsChecking || !onToggleHud;

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
            { opacity: state === 'loading' ? 0.45 : pressed ? 0.8 : 1, backgroundColor: c.good },
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {state === 'loading' ? 'TESTING' : 'RUN MATCH-READINESS TEST'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card} testID="readiness-history-card">
        <Text style={styles.cardLabel}>ON-DEVICE READINESS HISTORY</Text>
        <Text style={styles.muted}>Completed checks stay on this phone. Zero-Lag does not upload them or require an account.</Text>
        {historyLoading && <Text style={styles.body}>Loading saved readiness checks.</Text>}
        {!historyLoading && historyError && (
          <Text style={[styles.muted, { color: c.warn }]}>{historyError}</Text>
        )}
        {!historyLoading && history.length === 0 && (
          <Text style={styles.body}>No saved checks yet. Run a readiness test before you queue.</Text>
        )}
        {!historyLoading && history.length > 0 && (
          <>
            <View style={styles.statsRow}>
              <Stat label="Saved checks" value={String(summary.games)} />
              <Stat label="Best edge" value={summary.bestPingMs == null ? 'No response' : `${summary.bestPingMs} ms`} />
              <Stat label="Match-ready" value={String(summary.readyCount)} />
            </View>
            {history.slice(0, 3).map((entry) => (
              <View key={entry.id} style={styles.historyEntry}>
                <View style={styles.historyEntryText}>
                  <Text style={styles.historyGame}>{entry.game}</Text>
                  <Text style={styles.muted}>{`${hasEdgeResponse(entry) ? `${entry.avgPingMs} ms edge` : 'No response'} | ${entry.jitterMs} ms jitter | ${entry.lossPercent}% probe fails`}</Text>
                </View>
                <Text style={styles.historyTime}>{recordedAt(entry.at)}</Text>
              </View>
            ))}
            {onGoHistory && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View full saved readiness history"
                onPress={onGoHistory}
                style={({ pressed }) => [styles.historyButton, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={styles.historyButtonText}>VIEW FULL HISTORY</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear saved readiness history"
              accessibilityState={{ disabled: historySaving, busy: historySaving }}
              disabled={historySaving}
              onPress={() => Alert.alert(
                'Clear readiness history',
                'This permanently removes saved on-device readiness results. It cannot be undone.',
                [
                  { text: 'CANCEL', style: 'cancel' },
                  { text: 'CLEAR HISTORY', style: 'destructive', onPress: onClearHistory },
                ],
              )}
              style={({ pressed }) => [styles.clearButton, { opacity: historySaving ? 0.45 : pressed ? 0.8 : 1 }]}
            >
              <Text style={styles.clearButtonText}>{historySaving ? 'SAVING' : 'CLEAR HISTORY'}</Text>
            </Pressable>
          </>
        )}
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
          {`Display over other apps is required. The HUD updates every ${hudIntervalMs / 1000} seconds and uses a foreground notification; allow Notifications if Android asks so that readout is visible. You can stop it in Zero-Lag or from its notification. If overlay access is off, this button shows the setup steps.`}
        </Text>
        <Text accessibilityLiveRegion="polite" style={[styles.hudStatus, { color: hudStatusColor(hudStatus) }]}>
          {`HUD STATUS: ${hudStatusText(hudStatus)}`}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle the floating ping HUD"
          accessibilityState={{ disabled: hudButtonDisabled, busy: hudBusy }}
          disabled={hudButtonDisabled}
          onPress={onToggleHud}
          style={({ pressed }) => [styles.secondaryButton, { opacity: hudButtonDisabled ? 0.45 : pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.secondaryButtonText}>{hudBusy ? 'WORKING' : hudButtonLabel(hudStatus)}</Text>
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
  historyEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: c.surfaceVariant,
    paddingTop: tokens.space.sm,
  },
  historyEntryText: { flex: 1, gap: 2, paddingRight: tokens.space.sm },
  historyGame: { color: c.onSurface, fontSize: tokens.font.secondary, fontWeight: '700' },
  historyTime: { color: c.muted, fontSize: tokens.font.secondary, textAlign: 'right' },
  clearButton: {
    minHeight: tokens.minTouch,
    borderWidth: 1,
    borderColor: c.danger,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.space.md,
    marginTop: tokens.space.sm,
  },
  clearButtonText: { color: c.danger, fontWeight: '800', fontSize: tokens.font.secondary },
  historyButton: {
    minHeight: tokens.minTouch,
    borderWidth: 1,
    borderColor: c.good,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.space.md,
  },
  historyButtonText: { color: c.good, fontWeight: '800', fontSize: tokens.font.secondary },
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
    borderWidth: 1,
    borderColor: c.good,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.space.md,
  },
  secondaryButtonText: { color: c.good, fontWeight: '700', fontSize: tokens.font.secondary, textAlign: 'center' },
});
