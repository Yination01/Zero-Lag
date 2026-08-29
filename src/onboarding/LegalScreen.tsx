import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../ui/theme';
import { LEGAL_DOCS } from '../legal/consent';
import { PrimaryButton, GhostButton, Muted } from '../ui/components';

const c = tokens.color;

export function LegalScreen({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>Zero-Lag</Text>
        <Muted text="Please read these before first use. By accepting, you agree to them." />
        {LEGAL_DOCS.map((d) => (
          <View key={d.id} style={styles.doc}>
            <Text style={styles.docTitle}>{d.title}</Text>
            <Text style={styles.body}>{d.body}</Text>
          </View>
        ))}
        <Muted text="Full documents ship as TERMS.md, PRIVACY.md, COPYRIGHT.md, COMPLIANCE.md and PLAY_DATA_SAFETY.md in the app and on the Play listing. These are product drafts, not legal advice. A working contact inbox will replace the placeholder before launch." />
      </ScrollView>
      <View style={styles.actions}>
        <PrimaryButton label="ACCEPT AND CONTINUE" onPress={onAccept} accessibilityLabel="Accept legal terms" />
        <GhostButton label="DECLINE" onPress={onDecline} accessibilityLabel="Decline and quit" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 56 },
  brand: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  doc: { backgroundColor: c.surface, borderRadius: tokens.radius.card, padding: tokens.space.lg, gap: tokens.space.sm },
  docTitle: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  body: { color: c.onSurface, fontSize: tokens.font.body, lineHeight: 22 },
  actions: { padding: tokens.space.lg, gap: tokens.space.sm },
});
