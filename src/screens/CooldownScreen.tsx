import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'Cooldown'>;
type Nav   = StackNavigationProp<RootStackParamList>;

const DURATION = 30;
const RING_SIZE = 180;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MOVES = [
  { name: 'Çocuk Pozu',        emoji: '🧘', instruction: 'Dizlerin üzerine çök, kalçanı topuklarına doğru indir, kollarını öne uzat ve alnını yere koy. Derin nefes al.' },
  { name: 'Denizkızı Germe',   emoji: '🧜', instruction: 'Bacakları sola katlanmış otur. Bir kolu yukarı uzatarak karşı tarafa eğil. Her iki taraf için tekrarla.' },
  { name: 'Derin Nefes',       emoji: '🌬', instruction: 'Gözleri kapat, burnundan derin nefes al, ağzından yavaşça ver. Antrenmanın enerjisini hisset.' },
  { name: 'Mindfulness Duruşu',emoji: '✨', instruction: 'Sırtüstü uzan, kollar yanlarda. Vücudunu tamamen gevşet. Bugünkü çalışmanın farkında ol.' },
];

export default function CooldownScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();

  const [moveIdx, setMoveIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMove = MOVES[moveIdx];
  const isLast = moveIdx === MOVES.length - 1;
  const progress = timeLeft / DURATION;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const advance = useCallback(() => {
    if (isLast) {
      setRunning(false);
      setDone(true);
    } else {
      setMoveIdx((i) => i + 1);
      setTimeLeft(DURATION);
    }
  }, [isLast]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          advance();
          return DURATION;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, advance]);

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>Tebrikler!</Text>
          <Text style={styles.doneSub}>Antrenmanın tamamlandı</Text>
          <View style={styles.doneStats}>
            <View style={styles.doneStat}>
              <Text style={styles.doneStatVal}>{params?.exerciseCount ?? 0}</Text>
              <Text style={styles.doneStatLabel}>Hareket</Text>
            </View>
            <View style={styles.doneStat}>
              <Text style={styles.doneStatVal}>{params?.durationMinutes ?? 0}</Text>
              <Text style={styles.doneStatLabel}>Dakika</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.homeBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soğuma</Text>
        <Text style={styles.headerMeta}>{moveIdx + 1}/{MOVES.length}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.emoji}>{currentMove.emoji}</Text>
        <Text style={styles.moveName}>{currentMove.name}</Text>
        <Text style={styles.instruction}>{currentMove.instruction}</Text>

        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              stroke={Colors.creamDeep} strokeWidth={STROKE} fill="none"
            />
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              stroke={Colors.dustyRose} strokeWidth={STROKE} fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.timeText}>{timeLeft}</Text>
            <Text style={styles.timeLabel}>saniye</Text>
          </View>
        </View>

        <View style={styles.dots}>
          {MOVES.map((_, i) => (
            <View key={i} style={[styles.dot, i === moveIdx && styles.dotActive, i < moveIdx && styles.dotDone]} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, running && styles.btnPause]}
          onPress={() => setRunning((v) => !v)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{running ? '⏸  Duraklat' : '▶  Başlat'}</Text>
        </TouchableOpacity>

        {running && (
          <TouchableOpacity style={styles.nextBtn} onPress={advance}>
            <Text style={styles.nextBtnText}>{isLast ? 'Bitir ✓' : 'Sonraki →'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  skipText:    { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  headerMeta:  { fontSize: 14, color: Colors.dustyRose, fontWeight: '600' },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 16 },

  emoji:       { fontSize: 52 },
  moveName:    { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center', letterSpacing: -0.5 },
  instruction: { fontSize: 15, color: Colors.textLight, textAlign: 'center', lineHeight: 23 },

  ringWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  timeText:  { fontSize: 44, fontWeight: '200', color: Colors.text, letterSpacing: -2 },
  timeLabel: { fontSize: 12, color: Colors.textMuted },

  dots: { flexDirection: 'row', gap: 8 },
  dot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive:{ backgroundColor: Colors.dustyRose, width: 20, borderRadius: 4 },
  dotDone:  { backgroundColor: Colors.dustyRose + '80' },

  btn: {
    backgroundColor: Colors.dustyRose,
    paddingHorizontal: 44,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.dustyRose,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnPause:   { backgroundColor: Colors.textMuted },
  btnText:    { fontSize: 16, fontWeight: '700', color: Colors.white, letterSpacing: 0.3 },
  nextBtn:     { paddingVertical: 10 },
  nextBtnText: { fontSize: 14, color: Colors.dustyRose, fontWeight: '600' },

  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  doneEmoji: { fontSize: 64, marginBottom: 16 },
  doneTitle: { fontSize: 32, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  doneSub:   { fontSize: 16, color: Colors.textMuted, marginBottom: 32 },
  doneStats: { flexDirection: 'row', gap: 48, marginBottom: 40 },
  doneStat:  { alignItems: 'center' },
  doneStatVal:   { fontSize: 38, fontWeight: '800', color: Colors.sage },
  doneStatLabel: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  homeBtn: {
    backgroundColor: Colors.sage,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  homeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
