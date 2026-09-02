import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens, verdictColor } from './theme';
import { Card, Muted, SectionLabel, Stat } from './components';
import { hasEdgeResponse, sessionSummary, type StoredResult } from '../history/history';
import { verdictLabel } from '../net/readiness';

const c = tokens.color;

function recordedAt(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function HistoryScreen({
  records,
  loading,
  saving,
  error,
  onClearHistory,
}: {
  records: StoredResult[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onClearHistory: () => void;
}) {
  const summary = sessionSummary(records);

  return (
    <FlatList
      style={styles.root}
      contentContainerStyle={styles.content}
      data={records}
      keyExtractor={(entry) => entry.id}
      testID="full-readiness-history"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Card>
            <SectionLabel text="ON-DEVICE READINESS HISTORY" />
            <Text style={styles.name}>Your completed connection checks</Text>
            <Muted text="Saved only on this phone. A public-edge estimate is not exact game-server ping, and probe fails are not confirmed in-game packet loss." />
            {loading && <Text style={styles.body}>Loading saved readiness checks.</Text>}
            {!loading && error && <Muted color={c.warn} text={error} />}
            {!loading && records.length > 0 && (
              <View style={styles.statsRow}>
                <Stat label="Saved checks" value={String(summary.games)} />
                <Stat label="Best edge" value={summary.bestPingMs == null ? 'No response' : `${summary.bestPingMs} ms`} />
                <Stat label="Match-ready" value={String(summary.readyCount)} />
              </View>
            )}
            {!loading && records.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear saved readiness history"
                accessibilityState={{ disabled: saving, busy: saving }}
                disabled={saving}
                onPress={() => Alert.alert(
                  'Clear readiness history',
                  'This permanently removes saved on-device readiness results. It cannot be undone.',
                  [
                    { text: 'CANCEL', style: 'cancel' },
                    { text: 'CLEAR HISTORY', style: 'destructive', onPress: onClearHistory },
                  ],
                )}
                style={({ pressed }) => [styles.clearButton, { opacity: saving ? 0.45 : pressed ? 0.8 : 1 }]}
              >
                <Text style={styles.clearButtonText}>{saving ? 'SAVING' : 'CLEAR HISTORY'}</Text>
              </Pressable>
            )}
          </Card>
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <Card>
            <SectionLabel text="NO SAVED CHECKS" />
            <Text style={styles.body}>Run a Match-Readiness Test from Home or Game to save your first local result.</Text>
          </Card>
        ) : null
      }
      renderItem={({ item }) => (
        <View style={styles.entry}>
          <View style={styles.entryTopLine}>
            <Text style={styles.game}>{item.game}</Text>
            <Text style={styles.time}>{recordedAt(item.at)}</Text>
          </View>
          <Text style={[styles.verdict, { color: c[verdictColor(item.verdict)] }]}>{verdictLabel(item.verdict)}</Text>
          <View style={styles.entryStats}>
            <Text style={styles.metric}>{hasEdgeResponse(item) ? `${item.avgPingMs} ms edge` : 'No response'}</Text>
            <Text style={styles.metric}>{`${item.jitterMs} ms jitter`}</Text>
            <Text style={styles.metric}>{`${item.lossPercent}% probe fails`}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 48, paddingBottom: 96 },
  header: { gap: tokens.space.md },
  title: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  name: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  body: { color: c.onSurface, fontSize: tokens.font.body, lineHeight: 22 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: tokens.space.sm },
  entry: {
    backgroundColor: c.surface,
    borderRadius: tokens.radius.card,
    padding: tokens.space.lg,
    gap: tokens.space.sm,
  },
  entryTopLine: { flexDirection: 'row', justifyContent: 'space-between', gap: tokens.space.sm },
  game: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800', flex: 1 },
  time: { color: c.muted, fontSize: tokens.font.secondary, textAlign: 'right' },
  verdict: { fontSize: tokens.font.secondary, fontWeight: '800' },
  entryStats: { flexDirection: 'row', justifyContent: 'space-between', gap: tokens.space.xs },
  metric: { color: c.muted, flex: 1, fontSize: tokens.font.secondary, textAlign: 'center' },
  clearButton: {
    minHeight: tokens.minTouch,
    borderWidth: 1,
    borderColor: c.danger,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.space.md,
  },
  clearButtonText: { color: c.danger, fontWeight: '800', fontSize: tokens.font.secondary },
});
