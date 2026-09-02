import React, { useCallback } from 'react';
import { Alert, AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { HomeScreen } from './HomeScreen';
import { GameScreen } from './GameScreen';
import { BoostScreen } from './BoostScreen';
import { DeviceScreen } from './DeviceScreen';
import { HistoryScreen } from './HistoryScreen';
import { PRIMARY_TABS, type PrimaryTab } from './navigation';
import { useDevice } from '../state/useDevice';
import { useGame } from '../state/useGame';
import { useReadinessHistory } from '../state/useReadinessHistory';
import { createRunGate } from '../state/runGate';
import { createLatestRequest } from '../state/latestRequest';
import { getJson, KEYS, setJson } from '../storage';
import type { ProfileId, TuningProfile } from '../device/tier';
import type { ReadinessResult } from '../net/readiness';
import { hud } from '../plugins/hud';
import {
  inspectHud,
  toggleHud,
  type HudDisplayStatus,
  type HudTransition,
} from '../hud/lifecycle';
import {
  openAndroidSettings,
  settingsLaunchFeedback,
  specialAccessGuide,
  type SpecialSettingsDestination,
} from '../permissions/settings';

const c = tokens.color;

type Tab = PrimaryTab;

const TABS = PRIMARY_TABS;

const FALLBACK_PROFILE: TuningProfile = {
  profile: 'battery',
  hudIntervalMs: 5000,
  sampleCount: 5,
  overlaysEnabled: false,
};

function isProfileId(value: unknown): value is ProfileId {
  return value === 'auto' || value === 'battery' || value === 'balanced' || value === 'performance';
}

function hudFeedback(transition: HudTransition): { title: string; message: string } | null {
  switch (transition.action) {
    case 'started':
      return {
        title: 'Floating HUD confirmed',
        message: 'Android confirmed the HUD is running. Look for the small Zero-Lag pill and its ongoing notification. You can stop it from Zero-Lag or its notification. The delay shown is an edge estimate, not exact game-server ping.',
      };
    case 'stopped':
      return {
        title: 'Floating HUD stopped',
        message: 'Android confirmed the overlay and its ongoing notification have stopped.',
      };
    case 'unavailable':
      return {
        title: 'Floating HUD is unavailable',
        message: 'Install the latest Zero-Lag APK, then allow Display over other apps before starting the HUD.',
      };
    case 'start-unconfirmed':
      return {
        title: 'HUD start was not confirmed',
        message: 'The start request was sent, but Android did not report a running HUD. Check Display over other apps and Notifications for Zero-Lag, then try again.',
      };
    case 'stop-unconfirmed':
      return {
        title: 'HUD stop was not confirmed',
        message: 'The stop request was sent, but Android did not report that the HUD stopped. Return to Zero-Lag and check the status again.',
      };
    case 'start-failed':
      return {
        title: 'Could not start the floating HUD',
        message: 'Check Display over other apps and Notifications for Zero-Lag, then try again.',
      };
    case 'stop-failed':
      return {
        title: 'Could not stop the floating HUD',
        message: 'Return to Zero-Lag and check the HUD status again before trying once more.',
      };
    case 'status-unknown':
      return {
        title: 'HUD status is unknown',
        message: 'Android did not return a reliable HUD state. Return to Zero-Lag, then check again before starting or stopping it.',
      };
    case 'needs-overlay-permission':
      return null;
  }
}

export function Root() {
  const [tab, setTab] = React.useState<Tab>('home');
  const [performancePreference, setPerformancePreference] = React.useState<ProfileId>('auto');
  const [hudStatus, setHudStatus] = React.useState<HudDisplayStatus>('checking');
  const [hudBusy, setHudBusy] = React.useState(false);
  const preferenceTouched = React.useRef(false);
  const hudOperationGate = React.useRef(createRunGate()).current;
  const hudStatusRequests = React.useRef(createLatestRequest()).current;
  const appliedHudInterval = React.useRef<number | null>(null);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

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
  const readinessHistory = useReadinessHistory();
  const profile = device.profile ?? FALLBACK_PROFILE;

  const recordReadiness = useCallback((result: ReadinessResult, game: string | null) => {
    void readinessHistory.record(result, game);
  }, [readinessHistory.record]);

  const publishHudStatus = useCallback((next: HudDisplayStatus) => {
    hudStatusRequests.invalidate();
    if (mounted.current) setHudStatus(next);
  }, [hudStatusRequests]);

  const refreshHudStatus = useCallback(async () => {
    const request = hudStatusRequests.begin();
    const next = await inspectHud(hud);
    if (mounted.current && hudStatusRequests.isCurrent(request)) setHudStatus(next);
    return next;
  }, [hudStatusRequests]);

  React.useEffect(() => {
    void refreshHudStatus();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') void refreshHudStatus();
    });
    return () => subscription.remove();
  }, [refreshHudStatus]);

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

  const requestHudToggle = useCallback(async () => {
    if (!hudOperationGate.tryAcquire()) return;
    setHudBusy(true);
    try {
      if (hudStatus === 'status-unknown') {
        const refreshed = await refreshHudStatus();
        if (refreshed === 'status-unknown' && mounted.current) {
          Alert.alert(
            'HUD status is unknown',
            'Android did not return a reliable HUD state. Return to Zero-Lag, then check again before starting or stopping it.',
          );
        }
        return;
      }

      const transition = await toggleHud(hud, profile.hudIntervalMs);
      if (!mounted.current) return;

      publishHudStatus(transition.status);
      if (transition.action === 'started') {
        appliedHudInterval.current = profile.hudIntervalMs;
      } else if (transition.status === 'stopped' || transition.status === 'unavailable' || transition.status === 'needs-overlay-permission') {
        appliedHudInterval.current = null;
      }

      if (transition.action === 'needs-overlay-permission') {
        requestSpecialSettings('display-over-other-apps');
      } else {
        const feedback = hudFeedback(transition);
        if (feedback) Alert.alert(feedback.title, feedback.message);
      }
    } catch {
      if (mounted.current) {
        publishHudStatus('status-unknown');
        Alert.alert(
          'HUD status is unknown',
          'Android did not return a reliable HUD state. Return to Zero-Lag, then check again before starting or stopping it.',
        );
      }
    } finally {
      hudOperationGate.release();
      if (mounted.current) setHudBusy(false);
    }
  }, [hudStatus, profile.hudIntervalMs, publishHudStatus, refreshHudStatus, requestSpecialSettings]);

  // Reapply an updated performance interval only after Android has confirmed
  // that a HUD is already running. The ref prevents a second start call after
  // the user just started the service at the current interval.
  React.useEffect(() => {
    if (hudStatus === 'stopped' || hudStatus === 'unavailable' || hudStatus === 'needs-overlay-permission') {
      appliedHudInterval.current = null;
      return;
    }
    if (hudStatus !== 'running' || hudBusy || appliedHudInterval.current === profile.hudIntervalMs) return;

    appliedHudInterval.current = profile.hudIntervalMs;
    void hud.start(profile.hudIntervalMs)
      .then(() => refreshHudStatus())
      .catch(() => {
        appliedHudInterval.current = null;
        publishHudStatus('status-unknown');
      });
  }, [hudBusy, hudStatus, profile.hudIntervalMs, publishHudStatus, refreshHudStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {tab === 'home' && (
          <HomeScreen
            onGoGame={goGame}
            onToggleHud={() => { void requestHudToggle(); }}
            onReadinessComplete={recordReadiness}
            onClearHistory={() => { void readinessHistory.clear(); }}
            onGoHistory={() => setTab('history')}
            history={readinessHistory.records}
            historyLoading={readinessHistory.loading}
            historySaving={readinessHistory.saving}
            historyError={readinessHistory.error}
            hudStatus={hudStatus}
            hudBusy={hudBusy}
            sampleCount={profile.sampleCount}
            hudIntervalMs={profile.hudIntervalMs}
            performanceLevel={profile.profile}
          />
        )}
        {tab === 'game' && (
          <GameScreen
            onRequestUsage={() => requestSpecialSettings('usage-access')}
            onReadinessComplete={recordReadiness}
            sampleCount={profile.sampleCount}
          />
        )}
        {tab === 'boost' && (
          <BoostScreen
            onRequestUsage={() => requestSpecialSettings('usage-access')}
            onToggleHud={() => { void requestHudToggle(); }}
            hudStatus={hudStatus}
            hudBusy={hudBusy}
            usagePermission={usageAccess.permissionGranted}
            tier={device.tier?.tier ?? 'entry'}
            hudIntervalMs={profile.hudIntervalMs}
            performanceLevel={profile.profile}
          />
        )}
        {tab === 'history' && (
          <HistoryScreen
            records={readinessHistory.records}
            loading={readinessHistory.loading}
            saving={readinessHistory.saving}
            error={readinessHistory.error}
            onClearHistory={() => { void readinessHistory.clear(); }}
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
