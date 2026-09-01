import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { Card, SectionLabel, Muted, Stat } from './components';
import type { DeviceState } from '../state/useDevice';
import {
  getRecommendedPerformance,
  type ProfileId,
  type TuningProfile,
} from '../device/tier';

const c = tokens.color;

const PREFS: Array<{ id: ProfileId; label: string; hint: string }> = [
  { id: 'auto', label: 'Auto (recommended)', hint: 'Uses the best fit for this phone.' },
  { id: 'battery', label: 'Battery', hint: 'Fewer samples and a slower HUD. Saves battery.' },
  { id: 'balanced', label: 'Balanced', hint: 'Steady readings with normal battery use.' },
  { id: 'performance', label: 'Performance', hint: 'More samples and faster HUD updates. Uses more battery.' },
];

function profileLabel(profile: TuningProfile['profile']): string {
  return profile.charAt(0).toUpperCase() + profile.slice(1);
}

export function DeviceScreen({
  device,
  preference,
  onPreferenceChange,
}: {
  device: DeviceState;
  preference: ProfileId;
  onPreferenceChange: (preference: ProfileId) => void;
}) {
  if (device.loading || !device.tier || !device.profile) {
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Device</Text>
        <Card>
          <Muted text="Reading device facts to recommend a performance level." />
        </Card>
      </ScrollView>
    );
  }

  const recommendation = getRecommendedPerformance(device.tier);
  const effectiveProfile = device.profile;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Device</Text>

      <Card testID="device-recognition-card">
        <SectionLabel text="RECOGNIZED DEVICE" />
        <Text style={styles.name}>{device.tier.facts.model}</Text>
        <Text style={styles.tierBadge}>{device.tier.label} tier</Text>
        <View style={styles.statsRow}>
          <Stat label="RAM" value={device.tier.facts.ramMb != null ? `${Math.round(device.tier.facts.ramMb / 1024)} GB` : 'Unknown'} />
          <Stat label="Cores" value={device.tier.facts.cores != null ? String(device.tier.facts.cores) : 'Unknown'} />
        </View>
        <Muted text="The tier tunes only Zero-Lag tests and HUD updates. It cannot overclock your phone or change a game's graphics." />
      </Card>

      <Card testID="recommended-settings-card">
        <SectionLabel text="RECOMMENDED SETUP" />
        <Text style={styles.name}>Use Auto, which selects {profileLabel(recommendation.profile.profile)}</Text>
        <Muted text={recommendation.reason} />
        <Text style={styles.steps}>
          {'1. Leave Auto selected.\n2. Run the connection test before matchmaking.\n3. Start the floating HUD only while you are playing.'}
        </Text>
      </Card>

      <Card testID="device-level-card">
        <SectionLabel text="PERFORMANCE LEVEL" />
        <Muted text={`Current level: ${profileLabel(effectiveProfile.profile)}. It changes Zero-Lag sample count and HUD update rate. Your choice is saved on this phone.`} />
        {PREFS.map((preferenceOption) => {
          const active = preference === preferenceOption.id;
          const hint = preferenceOption.id === 'auto'
            ? `${recommendation.reason} Select this unless you have a specific battery or speed preference.`
            : preferenceOption.hint;
          return (
            <Pressable
              key={preferenceOption.id}
              accessibilityRole="button"
              accessibilityLabel={`${preferenceOption.label} performance level`}
              accessibilityState={{ selected: active }}
              onPress={() => onPreferenceChange(preferenceOption.id)}
              style={({ pressed }) => [styles.pref, { opacity: pressed ? 0.85 : 1, borderColor: active ? c.good : c.surfaceVariant }]}
            >
              <Text style={[styles.prefLabel, { color: active ? c.good : c.onSurface }]}>{preferenceOption.label}</Text>
              <Muted text={hint} />
            </Pressable>
          );
        })}
        <View style={styles.statsRow}>
          <Stat label="HUD rate" value={`${effectiveProfile.hudIntervalMs / 1000}s`} />
          <Stat label="Test samples" value={String(effectiveProfile.sampleCount)} />
          <Stat label="HUD recommended" value={effectiveProfile.overlaysEnabled ? 'Yes' : 'No'} />
        </View>
      </Card>

      <Muted color={c.warn} text="Performance level changes Zero-Lag behavior only. It cannot force the CPU to run faster or alter another app's settings." />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 48, paddingBottom: 96 },
  title: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  name: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  tierBadge: { color: c.good, fontWeight: '700', fontSize: tokens.font.body },
  steps: { color: c.onSurface, fontSize: tokens.font.secondary, lineHeight: 22 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: tokens.space.sm },
  pref: { borderWidth: 1, borderRadius: tokens.radius.badge, padding: tokens.space.md, gap: 2 },
  prefLabel: { fontWeight: '800', fontSize: tokens.font.body },
});
