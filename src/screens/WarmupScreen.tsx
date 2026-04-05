import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'Warmup'>;
type Nav   = StackNavigationProp<RootStackParamList>;

const DURATION = 30;
const RING_SIZE = 180;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MOVES = [
  { name: 'Derin Nefes',       emoji: '🌬', instruction: 'Burnunuzdan derin nefes alın, ağzınızdan yavaşça verin. Omuzlarınızı gevşetin.' },
  { name: 'Boyun Hareketleri', emoji: '🔄', instruction: 'Başınızı yavaşça sağa ve sola çevirin. Her tarafta 2-3 saniye tutun.' },
  { name: 'Omuz Açma',         emoji: '🤸', instruction: 'Omuzlarınızı ileri ve geri yuvarlayın. Göğsünüzü açın, kürek kemiklerini birbirine yaklaştırın.' },
  { name: 'Kedi–İnek',         emoji: '🐱', instruction: 'El ve dizler üzerinde omurgayı yukarı yuvarlayın (Kedi), sonra aşağı bırakın (İnek).' },
];

export default function WarmupScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();

  const [moveIdx, setMoveIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMove = MOVES[moveIdx];
  const isLast = moveIdx === MOVES.length - 1;
  const progress = timeLeft / DURATION;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const goToWorkout = useCallback(() => {
    navigation.replace('Timer', {
      exerciseIds: params?.exerciseIds,
      playFullAudio: params?.playFullAudio,
      planId: params?.planId,
    });
  }, [navigation, params]);

  const advance = useCallback(() => {
    if (isLast) {
      goToWorkout();
    } else {
      setMoveIdx((i) => i + 1);
      setTimeLeft(DURATION);
    }
  }, [isLast, goToWorkout]);

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

  const handleSkip = () => {
    Alert.alert(
      'Hazırlığı Atla?',
      'Hazırlık atlamak sakatlık riskini artırabilir. Devam etmek istiyor musunuz?',
      [
        { text: 'Geri Dön', style: 'cancel' },
        { text: 'Atla', style: 'destructive', onPress: goToWorkout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hazırlık</Text>
        <Text style={styles.headerMeta}>{moveIdx + 1}/{MOVES.length}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.emoji}>{currentMove.emoji}</Text>
        <Text style={styles.moveName}>{currentMove.name}</Text>
        <Text style={styles.instruction}>{currentMove.instruction}</Text>

        {/* Ring */}
        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              stroke={Colors.creamDeep} strokeWidth={STROKE} fill="none"
            />
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              stroke={Colors.sage} strokeWidth={STROKE} fill="none"
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

        {/* Progress dots */}
        <View style={styles.dots}>
          {MOVES.map((_, i) => (
            <View key={i} style={[styles.dot, i === moveIdx && styles.dotActive, i < moveIdx && styles.dotDone]} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, running && styles.btnActive]}
          onPress={() => setRunning((v) => !v)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{running ? '⏸  Duraklat' : '▶  Başlat'}</Text>
        </TouchableOpacity>

        {running && (
          <TouchableOpacity style={styles.nextBtn} onPress={advance}>
            <Text style={styles.nextBtnText}>{isLast ? 'Antrenmana Geç →' : 'Sonraki →'}</Text>
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
  headerMeta:  { fontSize: 14, color: Colors.sage, fontWeight: '600' },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 16 },

  emoji:       { fontSize: 52 },
  moveName:    { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center', letterSpacing: -0.5 },
  instruction: { fontSize: 15, color: Colors.textLight, textAlign: 'center', lineHeight: 23 },

  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  timeText:  { fontSize: 44, fontWeight: '200', color: Colors.text, letterSpacing: -2 },
  timeLabel: { fontSize: 12, color: Colors.textMuted },

  dots: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: { backgroundColor: Colors.sage, width: 20, borderRadius: 4 },
  dotDone:   { backgroundColor: Colors.sageLight },

  btn: {
    backgroundColor: Colors.sage,
    paddingHorizontal: 44,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.sage,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnActive:  { backgroundColor: Colors.terracotta, shadowColor: Colors.terracotta },
  btnText:    { fontSize: 16, fontWeight: '700', color: Colors.white, letterSpacing: 0.3 },

  nextBtn:     { paddingVertical: 10 },
  nextBtnText: { fontSize: 14, color: Colors.sage, fontWeight: '600' },
});
