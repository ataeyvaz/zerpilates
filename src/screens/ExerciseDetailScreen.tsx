import React, { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Colors, levelColor, areaColor, levelLabel, areaLabel } from '../constants/colors';
import { EXERCISE_MAP } from '../constants/exercises';
import { RootStackParamList } from '../types';
import ExerciseAnimation from '../components/ExerciseAnimation';
import AUDIO_ASSETS from '../constants/audioAssets';
import { useOrientation } from '../hooks/useOrientation';

type Route = RouteProp<RootStackParamList, 'ExerciseDetail'>;
type Nav = StackNavigationProp<RootStackParamList>;

export default function ExerciseDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const exercise = EXERCISE_MAP[params.exerciseId];
  const [showTips, setShowTips] = useState(false);
  const [playingStep, setPlayingStep] = useState<number | null>(null);
  const [autoPlayFull, setAutoPlayFull] = useState(false);
  const loadedPref = useRef(false);

  // Kayıtlı sesli rehberlik tercihini yükle (sadece bir kez)
  useEffect(() => {
    AsyncStorage.getItem('@zerpilates:playFullAudio').then((val) => {
      if (val !== null) setAutoPlayFull(val === 'true');
      loadedPref.current = true;
    });
  }, []);

  const handleToggleAudio = (val: boolean) => {
    setAutoPlayFull(val);
    AsyncStorage.setItem('@zerpilates:playFullAudio', String(val));
  };
  const audioAssets = AUDIO_ASSETS[exercise?.id ?? ''] ?? null;

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  // Oynatma bitince state'i sıfırla
  useEffect(() => {
    if (status.didJustFinish) {
      setPlayingStep(null);
    }
  }, [status.didJustFinish]);

  // iOS sessiz modda da çalsın
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const stopSound = useCallback(() => {
    player.pause();
    setPlayingStep(null);
  }, [player]);

  const playAudio = useCallback((source: any, stepIdx: number) => {
    player.replace(source);
    player.play();
    setPlayingStep(stepIdx);
  }, [player]);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Hareket bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const lvlColor = levelColor(exercise.level);
  const aColor   = areaColor(exercise.bodyArea);
  const { isLandscape, height: screenHeight } = useOrientation();

  // ── Landscape layout ──────────────────────────────────────
  if (isLandscape) {
    return (
      <SafeAreaView style={[styles.safe, ls.safe]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

        {/* LEFT — animation */}
        <View style={[ls.left, { backgroundColor: aColor + '18' }]}>
          <TouchableOpacity style={ls.backBtn} onPress={() => navigation.goBack()}>
            <Text style={ls.backText}>‹</Text>
          </TouchableOpacity>
          <ExerciseAnimation
            exerciseId={exercise.id}
            height={screenHeight * 0.65}
            showInstructions={false}
            autoPlay
          />
          {/* Intro audio */}
          {audioAssets && (
            <TouchableOpacity
              style={[ls.audioBtn, playingStep === 99 && ls.audioBtnActive]}
              onPress={() =>
                playingStep === 99 ? stopSound() : playAudio(audioAssets.intro, 99)
              }
            >
              <Text style={ls.audioBtnText}>
                {playingStep === 99 ? '⏹ Durdur' : '▶ Tanıtım'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RIGHT — details */}
        <ScrollView
          style={ls.right}
          contentContainerStyle={ls.rightContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Name + badges */}
          <Text style={ls.title}>{exercise.name}</Text>
          <View style={ls.badgeRow}>
            <View style={[ls.badge, { backgroundColor: lvlColor + '20', borderColor: lvlColor }]}>
              <Text style={[ls.badgeText, { color: lvlColor }]}>{levelLabel(exercise.level)}</Text>
            </View>
            <View style={[ls.badge, { backgroundColor: aColor + '20', borderColor: aColor }]}>
              <Text style={[ls.badgeText, { color: aColor }]}>{areaLabel(exercise.bodyArea)}</Text>
            </View>
          </View>

          <Text style={ls.description}>{exercise.description}</Text>

          {/* Instructions */}
          <Text style={ls.sectionTitle}>Nasıl Yapılır</Text>
          {exercise.instructions.map((step, i) => (
            <View key={i} style={ls.step}>
              <View style={ls.stepNum}>
                <Text style={ls.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={ls.stepText}>{step}</Text>
              {audioAssets?.steps[i] && (
                <TouchableOpacity
                  style={ls.stepAudioBtn}
                  onPress={() =>
                    playingStep === i ? stopSound() : playAudio(audioAssets.steps[i], i)
                  }
                >
                  <Text style={[ls.stepAudioIcon, playingStep === i && { color: Colors.terracotta }]}>
                    {playingStep === i ? '⏹' : '▶'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Sesli rehberlik toggle */}
          {audioAssets?.full && (
            <View style={ls.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={ls.toggleLabel}>Sesli rehberlik</Text>
                <Text style={ls.toggleSub}>Başlayınca tüm aşamaları seslendir</Text>
              </View>
              <Switch
                value={autoPlayFull}
                onValueChange={handleToggleAudio}
                trackColor={{ false: Colors.border, true: Colors.sage }}
                thumbColor={Colors.white}
              />
            </View>
          )}

          {/* Start button */}
          <TouchableOpacity
            style={ls.startBtn}
            onPress={() =>
              navigation.navigate('Warmup', {
                exerciseIds: [exercise.id],
                playFullAudio: autoPlayFull,
              })
            }
            activeOpacity={0.85}
          >
            <Text style={ls.startBtnText}>Bu Hareketi Başlat</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Portrait layout (unchanged) ───────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹ Geri</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Animasyon */}
        <View style={[styles.hero, { backgroundColor: aColor + '18' }]}>
          <ExerciseAnimation
            exerciseId={exercise.id}
            height={230}
            showInstructions={false}
            autoPlay
          />
        </View>

        {/* Başlık + rozetler */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{exercise.name}</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: lvlColor + '20', borderColor: lvlColor }]}>
            <Text style={[styles.badgeText, { color: lvlColor }]}>{levelLabel(exercise.level)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: aColor + '20', borderColor: aColor }]}>
            <Text style={[styles.badgeText, { color: aColor }]}>{areaLabel(exercise.bodyArea)}</Text>
          </View>
        </View>

        <Text style={styles.description}>{exercise.description}</Text>

        {/* Intro ses butonu */}
        {audioAssets && (
          <TouchableOpacity
            style={[styles.audioBtn, playingStep === 99 && styles.audioBtnActive]}
            onPress={() =>
              playingStep === 99 ? stopSound() : playAudio(audioAssets.intro, 99)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.audioBtnText}>
              {playingStep === 99 ? '⏹ Durdur' : '▶ Tanıtımı Dinle'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Hızlı istatistikler */}
        <View style={styles.statsRow}>
          <Stat label="Set" value={String(exercise.sets)} />
          <StatDivider />
          <Stat label="Tekrar" value={exercise.reps} />
          <StatDivider />
          <Stat label="Kaslar" value={exercise.muscleGroups.length + ' grup'} />
        </View>

        {/* Kas grupları */}
        <Section title="Çalışan Kaslar">
          <View style={styles.muscleRow}>
            {exercise.muscleGroups.map((m) => (
              <View key={m} style={styles.muscleChip}>
                <Text style={styles.muscleText}>{m}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Adım adım talimatlar */}
        <Section title="Nasıl Yapılır">
          {exercise.instructions.map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
              {audioAssets?.steps[i] && (
                <TouchableOpacity
                  style={styles.stepAudioBtn}
                  onPress={() =>
                    playingStep === i ? stopSound() : playAudio(audioAssets.steps[i], i)
                  }
                >
                  <Text style={[styles.stepAudioIcon, playingStep === i && { color: Colors.terracotta }]}>
                    {playingStep === i ? '⏹' : '▶'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Section>

        {/* İpuçları */}
        {exercise.tips && exercise.tips.length > 0 && (
          <Section title="Uzman İpuçları">
            <TouchableOpacity
              style={styles.tipsToggle}
              onPress={() => setShowTips((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={styles.tipsToggleText}>
                {showTips ? 'İpuçlarını gizle ▲' : 'İpuçlarını göster ▼'}
              </Text>
            </TouchableOpacity>
            {showTips &&
              exercise.tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>✦</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
          </Section>
        )}

        {/* Sesli rehberlik toggle */}
        {audioAssets?.full && (
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Sesli rehberlik</Text>
              <Text style={styles.toggleSub}>Başlayınca tüm aşamaları seslendir</Text>
            </View>
            <Switch
              value={autoPlayFull}
              onValueChange={handleToggleAudio}
              trackColor={{ false: Colors.border, true: Colors.sage }}
              thumbColor={Colors.white}
            />
          </View>
        )}

        {/* Başla butonu */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('Warmup', { exerciseIds: [exercise.id], playFullAudio: autoPlayFull })}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Bu Hareketi Başlat</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatDivider() {
  return <View style={styles.statDivider} />;
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.cream },
  errorText: { color: Colors.textLight, textAlign: 'center', marginTop: 40 },
  backBtn:   { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 4 },
  backText:  { fontSize: 16, color: Colors.sage, fontWeight: '600' },
  scroll:    { paddingHorizontal: 18 },

  hero: {
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  titleRow: { marginBottom: 8 },
  title:    { fontSize: 28, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },

  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  badge:    { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText:{ fontSize: 12, fontWeight: '700' },

  description: { fontSize: 15, color: Colors.textLight, lineHeight: 23, marginBottom: 20 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stat:        { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 18, fontWeight: '700', color: Colors.text },
  statLabel:   { fontSize: 11, color: Colors.textMuted, marginTop: 3, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 4 },

  section:      { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  muscleRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  muscleChip: { backgroundColor: Colors.sagePale, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  muscleText: { fontSize: 13, color: Colors.sageDark, fontWeight: '500' },

  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.sagePale,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.sageLight,
  },
  audioBtnActive: {
    backgroundColor: Colors.sage + '20',
    borderColor: Colors.sage,
  },
  audioBtnText: { fontSize: 14, color: Colors.sageDark, fontWeight: '600' },

  step:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  stepNum:      { fontSize: 12, fontWeight: '700', color: Colors.white },
  stepText:     { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  stepAudioBtn: { marginLeft: 8, padding: 4 },
  stepAudioIcon:{ fontSize: 13, color: Colors.sage },

  tipsToggle:     { marginBottom: 10 },
  tipsToggleText: { fontSize: 14, color: Colors.sage, fontWeight: '600' },
  tipRow:         { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  tipBullet:      { fontSize: 10, color: Colors.gold, marginRight: 10, marginTop: 4 },
  tipText:        { flex: 1, fontSize: 14, color: Colors.textLight, lineHeight: 21 },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleInfo: { flex: 1 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  toggleSub:   { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  startBtn: {
    backgroundColor: Colors.sage,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.sage,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  startBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white, letterSpacing: 0.3 },
});

// ── Landscape styles ───────────────────────────────────────
const ls = StyleSheet.create({
  safe: {
    flexDirection: 'row',
  },

  // Left column — animation
  left: {
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 10,
    padding: 6,
  },
  backText: {
    fontSize: 26,
    color: Colors.sage,
    fontWeight: '600',
  },
  audioBtn: {
    marginTop: 10,
    backgroundColor: Colors.sagePale,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.sageLight,
  },
  audioBtnActive: {
    backgroundColor: Colors.sage + '20',
    borderColor: Colors.sage,
  },
  audioBtnText: {
    fontSize: 13,
    color: Colors.sageDark,
    fontWeight: '600',
  },

  // Right column — scrollable content
  right: {
    flex: 1,
  },
  rightContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
  },
  stepAudioBtn: {
    marginLeft: 8,
    padding: 4,
  },
  stepAudioIcon: {
    fontSize: 13,
    color: Colors.sage,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },

  startBtn: {
    backgroundColor: Colors.sage,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: Colors.sage,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
