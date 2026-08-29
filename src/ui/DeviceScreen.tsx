import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';
import { Card, SectionLabel, Muted, Stat } from './components';
import { useDevice } from '../state/useDevice';
import { classifyDevice, recommendProfile, type ProfileId } from '../device/tier';
import type { DeviceFacts } from '../device/tier';

const c = tokens.color;

const PREFS: Array<{ id: ProfileId; label: string; hint: string }> = [
  { id: 'battery', label: 'Battery', hint: 'Lightest HUD and fewest samples.' },
  { id: 'balanced', label: 'Balanced', hint: 'Recommended for mid-range phones.' },
  { id: 'performance', label: 'Performance', hint: 'Fast HUD, more samples. Uses more battery.' },
];

export function DeviceScreen({ facts }: { facts?: DeviceFacts }) {
  // Live facts come from the native device plugin. Until it reports RAM,
  // we pass unknowns so the tier defaults to entry (never guessed high).
  const device = useDeviceFor(facts);
  const [pref, setPref] = useState<ProfileId>('auto');

  if (device.loading || !device.tier || !device.profile) {
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Device</Text>
        <Card>
          <Muted text="Reading device facts." />
        </Card>
      </ScrollView>
    );
  }

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
        <Muted text="RAM needs the native device plugin, so it may show Unknown until a build runs it. The tier tunes Zero-Lag, it does not overclock the phone or change game graphics." />
      </Card>

      <Card testID="device-level-card">
        <SectionLabel text="PERFORMANCE LEVEL" />
        <Muted text="Sets how hard Zero-Lag works. Auto follows your device tier." />
        {PREFS.map((p) => {
          const active = pref === p.id;
          return (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityLabel={`${p.label} performance level`}
              accessibilityState={{ selected: active }}
              onPress={() => setPref(p.id)}
              style={({ pressed }) => [styles.pref, { opacity: pressed ? 0.85 : 1, borderColor: active ? c.good : c.surfaceVariant }]}
            >
              <Text style={[styles.prefLabel, { color: active ? c.good : c.onSurface }]}>{p.label}</Text>
              <Muted text={p.hint} />
            </Pressable>
          );
        })}
        <View style={styles.statsRow}>
          <Stat label="HUD rate" value={`${profileFor(facts, pref).hudIntervalMs / 1000}s`} />
          <Stat label="Samples" value={String(profileFor(facts, pref).sampleCount)} />
          <Stat label="Overlays" value={profileFor(facts, pref).overlaysEnabled ? 'On' : 'Off'} />
        </View>
      </Card>

      <Muted color={c.warn} text="Performance level changes Zero-Lag behavior only. It cannot force the CPU to run faster or alter another app's settings." />
    </ScrollView>
  );
}

function useDeviceFor(facts?: DeviceFacts) {
  const fromHook = useDevice('auto');
  if (facts) {
    const tier = classifyDevice(facts);
    return { loading: false, tier, profile: recommendProfile(tier, 'auto') };
  }
  return fromHook;
}

function profileFor(facts: DeviceFacts | undefined, pref: ProfileId) {
  const base = facts ?? { ramMb: null, cores: null, model: 'Device' };
  const tier = classifyDevice(base);
  return recommendProfile(tier, pref);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 48, paddingBottom: 96 },
  title: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  name: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  tierBadge: { color: c.good, fontWeight: '700', fontSize: tokens.font.body },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: tokens.space.sm },
  pref: { borderWidth: 1, borderRadius: tokens.radius.badge, padding: tokens.space.md, gap: 2 },
  prefLabel: { fontWeight: '800', fontSize: tokens.font.body },
});
