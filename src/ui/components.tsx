import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from './theme';

const c = tokens.color;

export function Card({ children, testID }: { children: React.ReactNode; testID?: string }) {
  return (
    <View style={styles.card} testID={testID}>
      {children}
    </View>
  );
}

export function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

export function Muted({ text, color }: { text: string; color?: string }) {
  return <Text style={[styles.muted, color ? { color } : undefined]}>{text}</Text>;
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        { opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: tokens.radius.card,
    padding: tokens.space.lg,
    gap: tokens.space.sm,
  },
  label: { color: c.muted, fontSize: tokens.font.secondary, fontWeight: '700' },
  muted: { color: c.muted, fontSize: tokens.font.secondary },
  stat: { alignItems: 'center' },
  statValue: { color: c.onSurface, fontSize: tokens.font.stat, fontWeight: '800' },
  primary: {
    minHeight: tokens.minTouch + 10,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.good,
    paddingHorizontal: tokens.space.md,
  },
  primaryText: { color: c.bg, fontWeight: '800', fontSize: tokens.font.body },
  ghost: {
    minHeight: tokens.minTouch + 8,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.good,
    paddingHorizontal: tokens.space.md,
  },
  ghostText: { color: c.good, fontWeight: '700', fontSize: tokens.font.secondary },
});
