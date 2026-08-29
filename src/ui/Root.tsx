import React, { useCallback } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { HomeScreen } from './HomeScreen';
import { GameScreen } from './GameScreen';
import { BoostScreen } from './BoostScreen';
import { DeviceScreen } from './DeviceScreen';

const c = tokens.color;

type Tab = 'home' | 'game' | 'boost' | 'device';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'game', label: 'Game' },
  { id: 'boost', label: 'Boost' },
  { id: 'device', label: 'Device' },
];

function requestUsageAccess() {
  Linking.openURL('android.settings.USAGE_ACCESS_SETTINGS').catch(() => undefined);
}

export function Root() {
  const [tab, setTab] = React.useState<Tab>('home');

  const goGame = useCallback(() => setTab('game'), []);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {tab === 'home' && <HomeScreen onGoGame={goGame} />}
        {tab === 'game' && <GameScreen onRequestUsage={requestUsageAccess} />}
        {tab === 'boost' && <BoostScreen onRequestUsage={requestUsageAccess} />}
        {tab === 'device' && <DeviceScreen />}
      </View>
      <View style={styles.tabbar}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="button"
              accessibilityLabel={`${t.label} tab`}
              accessibilityState={{ selected: active }}
              onPress={() => setTab(t.id)}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={[styles.tabLabel, { color: active ? c.good : c.muted }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  screen: { flex: 1 },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: c.surface,
    borderTopWidth: 1,
    borderTopColor: c.surfaceVariant,
    paddingBottom: 12,
  },
  tab: { flex: 1, minHeight: tokens.minTouch + 8, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontWeight: '700', fontSize: tokens.font.secondary },
});
