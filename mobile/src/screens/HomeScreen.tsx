import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';

export function HomeScreen({ navigation }: any) {
  const { t } = useI18n();
  const me = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data?.data,
  });

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('dashboard')}</Text>
      <Text style={styles.subtitle}>
        {me.isLoading ? 'Loading…' : `${me.data?.firstName ?? ''} ${me.data?.lastName ?? ''} (${me.data?.role ?? ''})`}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Traffic Light Reports</Text>
        <Text style={styles.cardText}>Upload CSV/TXT and get a 54-gene + 40-biomarker table with 🟢🟠🔴.</Text>
      </View>

      <Pressable onPress={() => navigation.navigate('Upload')} style={styles.button}>
        <Text style={styles.buttonText}>{t('upload')}</Text>
      </Pressable>

      <Pressable onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 6, color: '#555' },
  card: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'white',
  },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
  cardText: { color: '#555' },
  button: { marginTop: 16, backgroundColor: '#2563eb', padding: 12, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' },
  logout: { marginTop: 14, alignItems: 'center' },
  logoutText: { color: '#dc2626', fontWeight: '700' },
});

