import React, { useCallback } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { HomeScreen } from './HomeScreen';
import { GameScreen } from './GameScreen';
import { BoostScreen } from './BoostScreen';
import { DeviceScreen } from './DeviceScreen';
import { useDevice } from '../state/useDevice';
import { useGame } from '../state/useGame';
import { getJson, KEYS, setJson } from '../storage';
import type { ProfileId, TuningProfile } from '../device/tier';
import { hud } from '../plugins/hud';
import {
  openAndroidSettings,
  settingsLaunchFeedback,
  specialAccessGuide,
  type SpecialSettingsDestination,
} from '../permissions/settings';

const c = tokens.color;

type Tab = 'home' | 'game' | 'boost' | 'device';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'game', label: 'Game' },
  { id: 'boost', label: 'Boost' },
  { id: 'device', label: 'Device' },
];

const FALLBACK_PROFILE: TuningProfile = {
  profile: 'battery',
  hudIntervalMs: 5000,
  sampleCount: 5,
  overlaysEnabled: false,
};

function isProfileId(value: unknown): value is ProfileId {
  return value === 'auto' || value === 'battery' || value === 'balanced' || value === 'performance';
}

export function Root() {
  const [tab, setTab] = React.useState<Tab>('home');
  const [performancePreference, setPerformancePreference] = React.useState<ProfileId>('auto');
  const preferenceTouched = React.useRef(false);

  React.useEffect(() => {
    let active = true;
    void getJson<unknown>(KEYS.profile, 'auto').then((saved) => {
      if (active && !preferenceTouched.current && isProfileId(saved)) {
        setPerformancePreference(saved);
      }
    });
    return () => { active = false; };
  }, []);

  const choosePerformancePreference = useCallback((next: ProfileId) => {
    preferenceTouched.current = true;
    setPerformancePreference(next);
    void setJson(KEYS.profile, next);
  }, []);

  const device = useDevice(performancePreference);
  const usageAccess = useGame(tab === 'boost', 5000);
  const profile = device.profile ?? FALLBACK_PROFILE;

  React.useEffect(() => {
    let active = true;
    void (async () => {
      if (await hud.isRunning() && active) {
        await hud.start(profile.hudIntervalMs);
      }
    })().catch(() => {
      // A stopped or unavailable native HUD must not block profile selection.
    });
    return () => { active = false; };
  }, [profile.hudIntervalMs]);

  const goGame = useCallback(() => setTab('game'), []);

  const openSpecialSettings = useCallback(async (destination: SpecialSettingsDestination) => {
    if (destination === 'display-over-other-apps' && await hud.openOverlaySettings()) {
      return;
    }

    const result = await openAndroidSettings(Linking, destination);
    if (result !== 'opened') {
      const guide = specialAccessGuide(destination);
      Alert.alert(guide?.title ?? 'Open Android settings', settingsLaunchFeedback(destination, result));
    }
  }, []);

  const requestSpecialSettings = useCallback((destination: SpecialSettingsDestination) => {
    const guide = specialAccessGuide(destination);
    if (!guide) return;
    Alert.alert(
      guide.title,
      [...guide.steps, guide.returnToAppStep].join('\n\n'),
      [
        { text: 'NOT NOW', style: 'cancel' },
        {
          text: guide.openLabel,
          onPress: () => { void openSpecialSettings(destination); },
        },
      ],
    );
  }, [openSpecialSettings]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {tab === 'home' && (
          <HomeScreen
            onGoGame={goGame}
            onRequestOverlay={() => requestSpecialSettings('display-over-other-apps')}
            sampleCount={profile.sampleCount}
            hudIntervalMs={profile.hudIntervalMs}
            performanceLevel={profile.profile}
          />
        )}
        {tab === 'game' && (
          <GameScreen
            onRequestUsage={() => requestSpecialSettings('usage-access')}
            sampleCount={profile.sampleCount}
          />
        )}
        {tab === 'boost' && (
          <BoostScreen
            onRequestUsage={() => requestSpecialSettings('usage-access')}
            onRequestOverlay={() => requestSpecialSettings('display-over-other-apps')}
            usagePermission={usageAccess.permissionGranted}
            tier={device.tier?.tier ?? 'entry'}
            hudIntervalMs={profile.hudIntervalMs}
            performanceLevel={profile.profile}
          />
        )}
        {tab === 'device' && (
          <DeviceScreen
            device={device}
            preference={performancePreference}
            onPreferenceChange={choosePerformancePreference}
          />
        )}
      </View>
      <View style={styles.tabbar}>
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.label} tab`}
              accessibilityState={{ selected: active }}
              onPress={() => setTab(item.id)}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={[styles.tabLabel, { color: active ? c.good : c.muted }]}>{item.label}</Text>
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
