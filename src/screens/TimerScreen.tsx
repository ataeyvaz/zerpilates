import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Vibration,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { RootStackParamList, CompletedWorkout } from '../types';
import { EXERCISE_MAP, EXERCISES } from '../constants/exercises';
import { logWorkout } from '../store/storage';
import AUDIO_ASSETS from '../constants/audioAssets';
import ExerciseAnimation from '../components/ExerciseAnimation';

type SafeParams = { planId?: string; exerciseIds?: string[]; playFullAudio?: boolean };

type Phase = 'work' | 'rest' | 'done';

const DEFAULT_WORK = 40;
const DEFAULT_REST = 20;
const RING_SIZE = 220;
const STROKE = 14;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Nefes döngüsü: 4s nefes al + 4s nefes ver
const BREATH_INHALE = 4;
const BREATH_EXHALE = 4;
const BREATH_CYCLE  = BREATH_INHALE + BREATH_EXHALE;

export default function TimerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = ((route as any).params ?? {}) as SafeParams;

  const exerciseIds: string[] = params?.exerciseIds?.length
    ? params.exerciseIds
    : EXERCISES.slice(0, 5).map((e) => e.id);

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [phase, setPhase]             = useState<Phase>('work');
  const [timeLeft, setTimeLeft]       = useState(DEFAULT_WORK);
  const [running, setRunning]         = useState(false);
  const [setCount, setSetCount]       = useState(1);
  const [workDuration]                = useState(DEFAULT_WORK);
  const [restDuration]                = useState(DEFAULT_REST);
  const [startTime]                   = useState(Date.now());
  const [silentMode, setSilentMode]   = useState(false);
  const [playFullAudio, setPlayFullAudio] = useState(false);
  const [breathSecs, setBreathSecs]   = useState(0); // 0..BREATH_CYCLE-1
  const [instrIdx, setInstrIdx]       = useState(0);

  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayedRef = useRef<number>(-1);
  const audioPlayer    = useAudioPlayer();

  // Stabil referanslar — render'da yeni dizi/değer oluşturulmasını engeller
  const exerciseIdsRef   = useRef(exerciseIds);
  const playFullAudioRef = useRef(false);
  const silentModeRef    = useRef(false);
  const exerciseIdxRef   = useRef(0);
  const phaseRef         = useRef<Phase>('work');

  // Her render'da güncelle
  exerciseIdsRef.current   = exerciseIds;
  playFullAudioRef.current = playFullAudio;
  silentModeRef.current    = silentMode;
  exerciseIdxRef.current   = exerciseIdx;
  phaseRef.current         = phase;

  // Nefes animasyonu
  const breathScale   = useRef(new Animated.Value(1)).current;
  const breathOpacity = useRef(new Animated.Value(0.7)).current;

  const isInhale   = breathSecs < BREATH_INHALE;
  const breathColor = isInhale ? Colors.sage : Colors.terracotta;
  const breathLabel = isInhale ? 'Nefes Al 🌬' : 'Nefes Ver 💨';

  // ── Tercihler yükle ───────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem('@zerpilates:silentMode').then((v) => {
      const val = v === 'true';
      setSilentMode(val);
      silentModeRef.current = val;
    });
    AsyncStorage.getItem('@zerpilates:playFullAudio').then((v) => {
      const val = v === 'true';
      setPlayFullAudio(val);
      playFullAudioRef.current = val;
    });
  }, []);

  const toggleSilent = () => {
    const next = !silentMode;
    setSilentMode(next);
    silentModeRef.current = next;
    AsyncStorage.setItem('@zerpilates:silentMode', String(next));
  };

  const runningRef = useRef(false);

  // ── Ses çalma — doğrudan çağrılır ────────────────────────
  const playExerciseAudio = useCallback(async (idx: number) => {
    console.log('[SES] playExerciseAudio çağrıldı', {
      idx,
      playFull: playFullAudioRef.current,
      silent:   silentModeRef.current,
      played:   audioPlayedRef.current,
      exerciseId: exerciseIdsRef.current[idx],
    });
    if (!playFullAudioRef.current) { console.log('[SES] ÇIKIŞ: playFullAudio false'); return; }
    if (silentModeRef.current)     { console.log('[SES] ÇIKIŞ: silentMode true');    return; }
    if (audioPlayedRef.current === idx) { console.log('[SES] ÇIKIŞ: zaten çalındı'); return; }
    const assets = AUDIO_ASSETS[exerciseIdsRef.current[idx]];
    if (!assets?.full) { console.log('[SES] ÇIKIŞ: assets.full yok'); return; }
    audioPlayedRef.current = idx;
    console.log('[SES] replace başlıyor...');
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      console.log('[SES] setAudioMode OK, replace çağrılıyor...');
      await audioPlayer.replace(assets.full);
      console.log('[SES] replace OK, play çağrılıyor...');
      audioPlayer.play();
      console.log('[SES] play() çağrıldı ✓');
    } catch (e) {
      console.warn('[SES] HATA:', e);
    }
  }, [audioPlayer]);

  // running state → ref senkronizasyonu
  useEffect(() => { runningRef.current = running; }, [running]);

  // exerciseIdx değişince otomatik çal (egzersiz geçişi)
  useEffect(() => {
    if (runningRef.current && phaseRef.current === 'work') {
      playExerciseAudio(exerciseIdx);
    }
  }, [exerciseIdx, playExerciseAudio]);

  // Dinlenme→çalışma geçişinde ses tetikle
  useEffect(() => {
    if (phase === 'work' && runningRef.current) {
      playExerciseAudio(exerciseIdxRef.current);
    }
  }, [phase, playExerciseAudio]);

  // ── Nefes döngüsü ────────────────────────────────────────
  useEffect(() => {
    if (!running || phase !== 'work') {
      if (breathRef.current) clearInterval(breathRef.current);
      return;
    }
    breathRef.current = setInterval(() => {
      setBreathSecs((s) => (s + 1) % BREATH_CYCLE);
    }, 1000);
    return () => { if (breathRef.current) clearInterval(breathRef.current); };
  }, [running, phase]);

  // ── Nefes animasyonu ─────────────────────────────────────
  useEffect(() => {
    if (isInhale) {
      Animated.parallel([
        Animated.timing(breathScale,   { toValue: 1.35, duration: BREATH_INHALE * 1000, useNativeDriver: true }),
        Animated.timing(breathOpacity, { toValue: 1,    duration: BREATH_INHALE * 1000, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(breathScale,   { toValue: 1,   duration: BREATH_EXHALE * 1000, useNativeDriver: true }),
        Animated.timing(breathOpacity, { toValue: 0.5, duration: BREATH_EXHALE * 1000, useNativeDriver: true }),
      ]).start();
    }
  }, [isInhale, breathScale, breathOpacity]);

  // ── Sessiz modda talimat döngüsü ─────────────────────────
  useEffect(() => {
    if (!silentMode || !running || phase !== 'work') return;
    const ex = EXERCISE_MAP[exerciseIds[exerciseIdx]];
    if (!ex) return;
    const count = ex.instructions.length;
    const secPerStep = Math.max(4, Math.floor(workDuration / count));
    const t = setInterval(() => {
      setInstrIdx((i) => (i + 1) % count);
    }, secPerStep * 1000);
    return () => clearInterval(t);
  }, [silentMode, running, exerciseIdx, phase, exerciseIds, workDuration]);

  // exerciseIdx değişince talimat sıfırla
  useEffect(() => { setInstrIdx(0); }, [exerciseIdx]);

  const currentExercise = EXERCISE_MAP[exerciseIds[exerciseIdx]];
  const totalExercises  = exerciseIds.length;
  const isLastExercise  = exerciseIdx === totalExercises - 1;
  const totalSets       = currentExercise?.sets ?? 3;

  const phaseDuration   = phase === 'work' ? workDuration : restDuration;
  const progress        = timeLeft / phaseDuration;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const ringColor       = phase === 'work' ? Colors.timerRing : Colors.timerRingRest;

  const vibrate = useCallback((pattern: number | number[]) => {
    try { Vibration.vibrate(pattern); } catch {}
  }, []);

  const advancePhase = useCallback(async () => {
    if (phase === 'work') {
      if (setCount >= totalSets) {
        if (isLastExercise) {
          setPhase('done');
          setRunning(false);
          vibrate([0, 100, 100, 100, 100, 300]);
          const elapsed = Math.round((Date.now() - startTime) / 60000);
          const workout: CompletedWorkout = {
            id: Date.now().toString(),
            planId: params?.planId,
            date: new Date().toISOString(),
            durationMinutes: Math.max(1, elapsed),
            exercisesCompleted: exerciseIds,
          };
          await logWorkout(workout);
          // Soğuma ekranına geç
          navigation.replace('Cooldown', {
            exerciseCount: totalExercises,
            durationMinutes: Math.max(1, elapsed),
          });
        } else {
          setExerciseIdx((i) => i + 1);
          setSetCount(1);
          setPhase('rest');
          setTimeLeft(restDuration);
          vibrate([0, 200, 100, 200]);
        }
      } else {
        setPhase('rest');
        setTimeLeft(restDuration);
        vibrate([0, 150, 100, 150]);
      }
    } else {
      setSetCount((s) => s + 1);
      setPhase('work');
      setTimeLeft(workDuration);
      vibrate([0, 100, 50, 100]);
    }
  }, [phase, setCount, totalSets, isLastExercise, workDuration, restDuration,
      exerciseIds, params, startTime, vibrate, navigation, totalExercises]);

  useEffect(() => {
    if (!running || phase === 'done') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { advancePhase(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, advancePhase]);

  const toggleRunning = () => {
    const next = !runningRef.current;
    runningRef.current = next;
    setRunning(next);
    console.log('[SES] toggleRunning', { next, phase: phaseRef.current, playFull: playFullAudioRef.current, silent: silentModeRef.current });
    if (next && phaseRef.current === 'work') {
      playExerciseAudio(exerciseIdxRef.current);
    } else if (!next) {
      try { audioPlayer.pause(); } catch {}
    }
  };

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setTimeLeft(workDuration);
    setExerciseIdx(0);
    setSetCount(1);
  };

  const skipExercise = () => {
    if (isLastExercise) return;
    setExerciseIdx((i) => i + 1);
    setSetCount(1);
    setPhase('work');
    setTimeLeft(workDuration);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── TIMER screen ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      {/* DEBUG BAR — sorun çözülünce kaldır */}
      <View style={styles.debugBar}>
        <Text style={styles.debugText}>
          🎧{playFullAudio ? '✅' : '❌'}  🔇{silentMode ? '✅' : '❌'}  ▶{running ? '✅' : '❌'}  phase:{phase}  played:{audioPlayedRef.current}
        </Text>
      </View>

      {/* Header */}
      <View style={styles.timerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.timerHeaderTitle}>
          {exerciseIdx + 1} / {totalExercises}
        </Text>
        <View style={styles.headerRight}>
          {silentMode && <Text style={styles.silentBadge}>🔇 Sessiz</Text>}
          <TouchableOpacity onPress={toggleSilent} style={styles.silentBtn}>
            <Text style={styles.silentBtnText}>{silentMode ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipExercise} disabled={isLastExercise}>
            <Text style={[styles.skipText, isLastExercise && styles.skipDisabled]}>Geç ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.timerScroll} showsVerticalScrollIndicator={false}>
        {/* Exercise name */}
        <Text style={styles.exerciseName}>{currentExercise?.name ?? 'Hareket'}</Text>
        <Text style={styles.setInfo}>
          {setCount}. Set / {totalSets}  ·  {currentExercise?.reps} tekrar
        </Text>

        {/* Phase badge */}
        <View style={[styles.phaseBadge, { backgroundColor: ringColor + '25' }]}>
          <Text style={[styles.phaseText, { color: ringColor }]}>
            {phase === 'work' ? '● Çalış' : '◎ Dinlen'}
          </Text>
        </View>

        {/* Countdown ring */}
        <View style={styles.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              stroke={Colors.creamDeep} strokeWidth={STROKE} fill="none"
            />
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              stroke={ringColor} strokeWidth={STROKE} fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timeLabel}>{phase === 'work' ? 'saniye' : 'dinlenme'}</Text>
          </View>
        </View>

        {/* Nefes Rehberi — sadece 'work' fazında ve çalışıyorken */}
        {running && phase === 'work' && (
          <View style={styles.breathContainer}>
            <Animated.View
              style={[
                styles.breathCircle,
                { backgroundColor: breathColor + '30', borderColor: breathColor + '80' },
                { transform: [{ scale: breathScale }], opacity: breathOpacity },
              ]}
            />
            <Text style={[styles.breathLabel, { color: breathColor }]}>{breathLabel}</Text>
          </View>
        )}

        {/* Egzersiz görseli + açıklama — çalışma fazında */}
        {running && phase === 'work' && currentExercise && (
          <View style={styles.exerciseVisual}>
            <ExerciseAnimation
              exerciseId={exerciseIds[exerciseIdx]}
              height={200}
              showInstructions={false}
              autoPlay={true}
            />
            <Text style={styles.exerciseDesc}>{currentExercise.description}</Text>
          </View>
        )}

        {/* Sessiz mod — büyük talimat kartı */}
        {silentMode && running && phase === 'work' && currentExercise && (
          <View style={styles.silentCard}>
            <Text style={styles.silentInstr}>
              {currentExercise.instructions[instrIdx] ?? ''}
            </Text>
            <Text style={styles.silentCounter}>
              {instrIdx + 1} / {currentExercise.instructions.length}
            </Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: ringColor }]}
            onPress={toggleRunning}
            activeOpacity={0.85}
          >
            <Text style={styles.playBtnText}>{running ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetBtn} onPress={advancePhase}>
            <Text style={styles.resetBtnText}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise queue */}
        <View style={styles.queue}>
          <Text style={styles.queueTitle}>Sıradaki</Text>
          {exerciseIds.slice(exerciseIdx + 1, exerciseIdx + 4).map((id, i) => {
            const ex = EXERCISE_MAP[id];
            return (
              <View key={id} style={styles.queueRow}>
                <Text style={styles.queueNum}>{exerciseIdx + i + 2}</Text>
                <Text style={styles.queueName}>{ex?.name ?? id}</Text>
                <Text style={styles.queueMeta}>{ex?.sets}×{ex?.reps}</Text>
              </View>
            );
          })}
          {exerciseIdx + 1 >= totalExercises && (
            <Text style={styles.queueEmpty}>Son hareket — güçlü bitir! 💪</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },

  debugBar: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    paddingTop: (StatusBar.currentHeight ?? 0) + 4,
  },
  debugText: {
    fontSize: 11,
    color: '#7fff7f',
    fontFamily: 'monospace',
  },

  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText:          { fontSize: 18, color: Colors.textLight, fontWeight: '400' },
  timerHeaderTitle:  { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  headerRight:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  silentBadge:       { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  silentBtn:         { padding: 4 },
  silentBtnText:     { fontSize: 20 },
  skipText:          { fontSize: 14, color: Colors.sage, fontWeight: '600' },
  skipDisabled:      { color: Colors.border },

  timerScroll:   { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 80 },
  exerciseName:  {
    fontSize: 24, fontWeight: '700', color: Colors.text,
    textAlign: 'center', marginTop: 8, letterSpacing: -0.3,
  },
  setInfo: { fontSize: 14, color: Colors.textMuted, marginTop: 4, marginBottom: 12 },

  phaseBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  phaseText:  { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },

  ringContainer: {
    width: RING_SIZE, height: RING_SIZE,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  timeText:   { fontSize: 52, fontWeight: '300', color: Colors.text, letterSpacing: -2 },
  timeLabel:  { fontSize: 13, color: Colors.textMuted, marginTop: 4 },

  // Nefes rehberi
  breathContainer: { alignItems: 'center', marginBottom: 16 },
  breathCircle: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 2,
    position: 'absolute',
  },
  breathLabel: { fontSize: 15, fontWeight: '600', paddingTop: 100 },

  // Egzersiz görseli
  exerciseVisual: {
    width: '100%',
    marginBottom: 16,
  },
  exerciseDesc: {
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  // Sessiz mod talimat kartı
  silentCard: {
    backgroundColor: Colors.text,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  silentInstr: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 30,
  },
  silentCounter: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 12,
  },

  controls: {
    flexDirection: 'row', alignItems: 'center',
    gap: 20, marginBottom: 36, marginTop: 8,
  },
  playBtn: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.sage, shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  playBtnText: { fontSize: 28, color: Colors.white },
  resetBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  resetBtnText: { fontSize: 20, color: Colors.textLight },

  queue:       { width: '100%' },
  queueTitle:  {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  queueRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 6,
  },
  queueNum:   { fontSize: 12, color: Colors.textMuted, width: 22 },
  queueName:  { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.textLight },
  queueMeta:  { fontSize: 12, color: Colors.textMuted },
  queueEmpty: { fontSize: 14, color: Colors.sage, fontStyle: 'italic', textAlign: 'center', paddingVertical: 10 },
});
