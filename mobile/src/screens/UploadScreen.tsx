import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';

type Kind = 'genetic' | 'blood';

export function UploadScreen() {
  const { t } = useI18n();
  const [kind, setKind] = useState<Kind>('genetic');
  const [status, setStatus] = useState<string>('');

  const pickAndUpload = async () => {
    setStatus('');
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    // expo-document-picker has slightly different shapes across versions
    // @ts-expect-error - support both return shapes
    const asset = res.assets?.[0] || res;
    if (!asset || res.canceled) return;

    const uri: string = asset.uri;
    const name: string = asset.name || 'upload';
    const type: string = asset.mimeType || 'application/octet-stream';

    const form = new FormData();
    // @ts-expect-error React Native FormData file shape
    form.append('file', { uri, name, type });

    setStatus('Uploading…');
    try {
      const endpoint = kind === 'genetic' ? '/reports/genetic/upload' : '/reports/blood/upload';
      const out = await api.post(endpoint, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const reportId = out.data?.data?.report?.id;
      const detected = out.data?.data?.detectedCount;
      setStatus(`Done. Report: ${reportId || '—'} (detected: ${detected ?? '—'})`);
    } catch (e: any) {
      setStatus(e?.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('upload')}</Text>
      <View style={styles.row}>
        <Pressable onPress={() => setKind('genetic')} style={[styles.chip, kind === 'genetic' && styles.chipActive]}>
          <Text style={[styles.chipText, kind === 'genetic' && styles.chipTextActive]}>{t('genetic')}</Text>
        </Pressable>
        <Pressable onPress={() => setKind('blood')} style={[styles.chip, kind === 'blood' && styles.chipActive]}>
          <Text style={[styles.chipText, kind === 'blood' && styles.chipTextActive]}>{t('blood')}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>CSV/TXT recommended</Text>
        <Text style={styles.cardText}>
          Genetic example: FTO,AA{'\n'}Blood example: Fasting Glucose,92,mg/dL
        </Text>
      </View>

      <Pressable onPress={pickAndUpload} style={styles.button}>
        <Text style={styles.buttonText}>{t('pickFile')}</Text>
      </Pressable>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  chip: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  chipActive: { borderColor: '#2563eb', backgroundColor: '#dbeafe' },
  chipText: { color: '#111', fontWeight: '600' },
  chipTextActive: { color: '#1d4ed8' },
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
  status: { marginTop: 12, color: '#555' },
});

