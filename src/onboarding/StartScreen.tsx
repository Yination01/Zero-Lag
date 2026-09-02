import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../ui/theme';
import { PrimaryButton, Muted } from '../ui/components';
import { guestSession, type Session } from '../auth/session';

const c = tokens.color;

// Zero-Lag is local-first today. This is deliberately a start screen, not an
// imitation login, because no server can create or verify an account.
export function StartScreen({ onContinue }: { onContinue: (session: Session) => void }) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Zero-Lag</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Start playing with a clearer connection check</Text>
        <Muted text="Everything in this version works without sign-in. There is no account, cloud backup, or feature locked behind registration." />
        <PrimaryButton
          label="CONTINUE"
          onPress={() => onContinue(guestSession())}
          accessibilityLabel="Continue to Zero-Lag as a guest"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Your data stays on this phone</Text>
        <Muted text="Readiness history, performance choices, and optional permissions stay local. You can clear saved readiness history in the Home tab at any time." />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 56, paddingBottom: 48 },
  brand: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  card: { backgroundColor: c.surface, borderRadius: tokens.radius.card, padding: tokens.space.lg, gap: tokens.space.md },
  title: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
});
