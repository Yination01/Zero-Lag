import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { Card, SectionLabel, Muted, Stat, PrimaryButton, GhostButton } from './components';
import { useGame } from '../state/useGame';
import { useReadiness } from '../state/useReadiness';
import { verdictLabel } from '../net/readiness';
import { NETWORK_ANALYSIS_GUIDANCE } from '../net/probe';
import { verdictColor } from './theme';

const c = tokens.color;

export function GameScreen({
  onRequestUsage,
  sampleCount = 8,
}: {
  onRequestUsage: () => void;
  sampleCount?: number;
}) {
  const game = useGame(true);
  const readiness = useReadiness({ sampleCount });
  const [ranFor, setRanFor] = useState<string | null>(null);

  const detected = game.game;
  const headlineIsPing = detected?.headline === 'ping';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Game</Text>

      <Card testID="game-detection-card">
        <SectionLabel text="DETECTED GAME" />
        {game.loading && <Muted text="Checking which game is open." />}
        {!game.loading && !game.permissionGranted && (
          <View>
            <Text style={styles.body}>
              To identify a game, tap Grant Usage Access. In Android Settings,
              select Zero-Lag, turn on Allow usage access, then return here.
            </Text>
            <GhostButton label="GRANT USAGE ACCESS" onPress={onRequestUsage} />
          </View>
        )}
        {!game.loading && game.permissionGranted && !detected && (
          <Text style={styles.body}>No known game detected in the foreground.</Text>
        )}
        {!game.loading && detected && (
          <View>
            <Text style={styles.gameName}>{detected.label}</Text>
            <Muted text={detected.why} />
            <Muted
              text={
                headlineIsPing
                  ? 'Headline metric: estimated edge delay, not exact in-game ping.'
                  : 'Headline metric: connection stability, jitter and probe failures.'
              }
            />
          </View>
        )}
      </Card>

      <Card testID="game-readiness-card">
        <SectionLabel text="NETWORK RELIABILITY" />
        {readiness.state === 'idle' && (
          <Muted text="Run a test to estimate how this game will perform." />
        )}
        {readiness.state === 'loading' && <Muted text="Testing. This takes a few seconds." />}
        {readiness.state === 'error' && (
          <Text style={[styles.body, { color: c.danger }]}>{readiness.error}</Text>
        )}
        {readiness.state === 'success' && readiness.result && (
          <View>
            {detected && (
              <Text style={[styles.verdict, { color: c[verdictColor(readiness.result.verdict)] }]}>
                {verdictLabel(readiness.result.verdict)}
              </Text>
            )}
            <View style={styles.statsRow}>
              {headlineIsPing && detected ? (
                <Stat label="Edge estimate" value={`${readiness.result.avgPingMs} ms`} />
              ) : (
                <Stat label="Connection" value={readiness.result.lossPercent === 0 ? 'Stable' : 'Probe fails'} />
              )}
              <Stat label="Jitter" value={`${readiness.result.jitterMs} ms`} />
              <Stat label="Probe fails" value={`${readiness.result.lossPercent}%`} />
            </View>
            {ranFor && <Muted text={`Estimated for ${ranFor}. ${NETWORK_ANALYSIS_GUIDANCE.limitation}`} />}
          </View>
        )}
        <PrimaryButton
          label={readiness.state === 'loading' ? 'TESTING' : 'TEST FOR THIS GAME'}
          disabled={readiness.state === 'loading'}
          onPress={() => {
            readiness.run();
            setRanFor(detected?.label ?? 'this network');
          }}
        />
      </Card>

      <Muted
        color={c.warn}
        text={`Recommended: ${NETWORK_ANALYSIS_GUIDANCE.recommendedUse[0]}`}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 48, paddingBottom: 96 },
  title: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  body: { color: c.onSurface, fontSize: tokens.font.body },
  gameName: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: tokens.space.sm },
  verdict: { fontWeight: '800', fontSize: tokens.font.body, textAlign: 'center' },
});
