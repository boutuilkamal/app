import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';

export function RegisterScreen({ navigation }: any) {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'COACH'>('CLIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { firstName, lastName, email, password, role });
      const token = res.data?.data?.token;
      if (token) await AsyncStorage.setItem('token', token);
      navigation.replace('App');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('register')}</Text>
      <TextInput value={firstName} onChangeText={setFirstName} placeholder={t('firstName')} style={styles.input} />
      <TextInput value={lastName} onChangeText={setLastName} placeholder={t('lastName')} style={styles.input} />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={t('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput value={password} onChangeText={setPassword} placeholder={t('password')} secureTextEntry style={styles.input} />

      <View style={styles.roleRow}>
        <Pressable onPress={() => setRole('CLIENT')} style={[styles.chip, role === 'CLIENT' && styles.chipActive]}>
          <Text style={[styles.chipText, role === 'CLIENT' && styles.chipTextActive]}>{t('client')}</Text>
        </Pressable>
        <Pressable onPress={() => setRole('COACH')} style={[styles.chip, role === 'COACH' && styles.chipActive]}>
          <Text style={[styles.chipText, role === 'COACH' && styles.chipTextActive]}>{t('coach')}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable onPress={onRegister} style={[styles.button, loading && styles.buttonDisabled]} disabled={loading}>
        <Text style={styles.buttonText}>{t('submit')}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>{t('login')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipActive: { borderColor: '#2563eb', backgroundColor: '#dbeafe' },
  chipText: { color: '#111', fontWeight: '600' },
  chipTextActive: { color: '#1d4ed8' },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: 'white', fontWeight: '700' },
  link: { marginTop: 14, color: '#2563eb', fontWeight: '600' },
  error: { color: '#dc2626', marginBottom: 10 },
});

