/**
 * AudioTestScreen — Sesli rehberlik debug ekranı
 * Navigation'a geçici olarak eklenmiş test aracı.
 * Çalışıyorsa kaldırılabilir.
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Colors } from '../constants/colors';
import AUDIO_ASSETS from '../constants/audioAssets';

type Status = 'idle' | 'loading' | 'playing' | 'done' | 'error';

const TEST_EXERCISES = ['bridge', 'cat-cow', 'the-hundred', 'roll-up'];

export default function AudioTestScreen() {
  const player = useAudioPlayer();
  const [status, setStatus] = useState<Status>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const addLog = (msg: string) => {
    const ts = new Date().toISOString().slice(11, 19);
    setLog((prev) => [`[${ts}] ${msg}`, ...prev].slice(0, 20));
  };

  const playAudio = async (exerciseId: string, type: 'full' | 'intro' | 'step1') => {
    setActiveId(exerciseId + '_' + type);
    setStatus('loading');
    addLog(`Başlatılıyor: ${exerciseId} / ${type}`);

    try {
      const assets = AUDIO_ASSETS[exerciseId];
      if (!assets) {
        addLog('HATA: exerciseId bulunamadı → ' + exerciseId);
        setStatus('error');
        return;
      }

      const source = type === 'full'  ? assets.full
                   : type === 'intro' ? assets.intro
                   : assets.steps[0];

      if (!source) {
        addLog('HATA: ses kaynağı null/undefined');
        setStatus('error');
        return;
      }
      addLog('Kaynak OK: ' + JSON.stringify(source)?.slice(0, 80));

      addLog('setAudioModeAsync çağrılıyor...');
      await setAudioModeAsync({ playsInSilentMode: true });
      addLog('setAudioModeAsync OK');

      addLog('replace() çağrılıyor...');
      await player.replace(source);
      addLog('replace() OK');

      addLog('play() çağrılıyor...');
      player.play();
      addLog('play() çağrıldı ✓');
      setStatus('playing');
    } catch (e: any) {
      addLog('HATA: ' + (e?.message ?? String(e)));
      setStatus('error');
    }
  };

  const stop = () => {
    try { player.pause(); } catch {}
    setStatus('idle');
    setActiveId(null);
    addLog('Durduruldu');
  };

  const statusColor = {
    idle: Colors.textMuted,
    loading: Colors.terracotta,
    playing: Colors.sage,
    done: Colors.sageDark,
    error: '#e74c3c',
  }[status];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Ses Test Paneli</Text>
        <Text style={styles.subtitle}>
          Her butona bas → log'u kontrol et → ses geliyorsa sorun TimerScreen mantığındadır
        </Text>

        <View style={[styles.statusBar, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            Durum: {status.toUpperCase()}
          </Text>
          {status === 'loading' && <ActivityIndicator size="small" color={statusColor} />}
        </View>

        {TEST_EXERCISES.map((id) => (
          <View key={id} style={styles.row}>
            <Text style={styles.rowLabel}>{id}</Text>
            <View style={styles.rowBtns}>
              {(['intro', 'step1', 'full'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.btn,
                    activeId === id + '_' + t && styles.btnActive,
                  ]}
                  onPress={() => playAudio(id, t)}
                >
                  <Text style={styles.btnText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.stopBtn} onPress={stop}>
          <Text style={styles.stopBtnText}>⏹ Durdur</Text>
        </TouchableOpacity>

        <View style={styles.logBox}>
          <Text style={styles.logTitle}>LOG</Text>
          {log.length === 0 && (
            <Text style={styles.logEmpty}>Henüz log yok — bir butona bas</Text>
          )}
          {log.map((line, i) => (
            <Text key={i} style={[styles.logLine, i === 0 && styles.logLineNew]}>
              {line}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: Colors.textMuted, lineHeight: 19, marginBottom: 20 },

  statusBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 12,
    padding: 12, marginBottom: 20,
  },
  statusText: { fontSize: 14, fontWeight: '700', flex: 1 },

  row: {
    backgroundColor: Colors.white, borderRadius: 12,
    padding: 14, marginBottom: 10,
  },
  rowLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  rowBtns: { flexDirection: 'row', gap: 8 },
  btn: {
    backgroundColor: Colors.sagePale,
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8,
  },
  btnActive: { backgroundColor: Colors.sage },
  btnText: { fontSize: 13, fontWeight: '600', color: Colors.sageDark },

  stopBtn: {
    backgroundColor: '#e74c3c20', borderRadius: 12,
    padding: 14, alignItems: 'center', marginVertical: 12,
    borderWidth: 1, borderColor: '#e74c3c40',
  },
  stopBtnText: { fontSize: 15, fontWeight: '700', color: '#e74c3c' },

  logBox: {
    backgroundColor: '#1a1a2e', borderRadius: 12,
    padding: 14, minHeight: 120,
  },
  logTitle: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 1, marginBottom: 8 },
  logEmpty: { fontSize: 12, color: '#555', fontStyle: 'italic' },
  logLine: { fontSize: 11, color: '#aaa', lineHeight: 17, fontFamily: 'monospace' },
  logLineNew: { color: '#7fff7f' },
});
