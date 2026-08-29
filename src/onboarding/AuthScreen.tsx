import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { tokens } from '../ui/theme';
import { PrimaryButton, Muted } from '../ui/components';
import { validateEmail, validatePassword, CLOUD_SYNC_AVAILABLE, type Session } from '../auth/session';

const c = tokens.color;

export function AuthScreen({ onContinue }: { onContinue: (session: Session) => void }) {
  const [mode, setMode] = useState<'choose' | 'create' | 'login'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    if (!validateEmail(email)) {
      Alert.alert('Check email', 'Enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Check password', 'Password must be at least 8 characters.');
      return;
    }
    // Local profile only until the named backend exists.
    if (!CLOUD_SYNC_AVAILABLE) {
      Alert.alert(
        'Offline profile',
        'There is no cloud server yet. Your profile and history are saved on this device. Cloud backup turns on automatically once you sign in after the backend is named.',
        [{ text: 'Continue', onPress: () => onContinue({ mode: 'account', email }) }],
      );
    } else {
      onContinue({ mode: 'account', email });
    }
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Zero-Lag</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Guest or account</Text>
        <Muted text="You can use everything as a guest. An account only backs up history and settings later. Nothing is locked behind sign-up." />
        <PrimaryButton label="CONTINUE AS GUEST" onPress={() => onContinue({ mode: 'guest' })} accessibilityLabel="Continue as guest" />
      </View>

      {mode === 'choose' && (
        <View style={styles.row}>
          <Pressable accessibilityRole="button" onPress={() => setMode('create')} style={styles.link}>
            <Text style={styles.linkText}>Create account</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setMode('login')} style={styles.link}>
            <Text style={styles.linkText}>Log in</Text>
          </Pressable>
        </View>
      )}

      {mode !== 'choose' && (
        <View style={styles.card}>
          <Text style={styles.title}>{mode === 'create' ? 'Create account' : 'Log in'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={c.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (8+ characters)"
            placeholderTextColor={c.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password"
          />
          <PrimaryButton label={mode === 'create' ? 'CREATE' : 'LOG IN'} onPress={submit} accessibilityLabel={mode === 'create' ? 'Create account' : 'Log in'} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: tokens.space.lg, gap: tokens.space.md, paddingTop: 56, paddingBottom: 48 },
  brand: { color: c.good, fontSize: tokens.font.display, fontWeight: '800' },
  card: { backgroundColor: c.surface, borderRadius: tokens.radius.card, padding: tokens.space.lg, gap: tokens.space.md },
  title: { color: c.onSurface, fontSize: tokens.font.title, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  link: { minHeight: tokens.minTouch, justifyContent: 'center', paddingHorizontal: tokens.space.md },
  linkText: { color: c.good, fontWeight: '700', fontSize: tokens.font.secondary },
  input: {
    color: c.onSurface,
    borderWidth: 1,
    borderColor: c.surfaceVariant,
    borderRadius: tokens.radius.button,
    paddingHorizontal: tokens.space.md,
    minHeight: tokens.minTouch + 4,
  },
});
