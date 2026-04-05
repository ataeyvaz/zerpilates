import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, areaLabel, levelLabel } from '../constants/colors';
import { RootStackParamList } from '../types';
import { getCompletedWorkouts, computeStreak, getPlans } from '../store/storage';
import { EXERCISES } from '../constants/exercises';
import MoodSelector, { Mood } from '../components/MoodSelector';

type Nav = StackNavigationProp<RootStackParamList>;

function selamlama(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 17) return 'İyi günler';
  return 'İyi akşamlar';
}

const MOTIVASYON = [
  'Her tekrar, geleceğindeki benliğine bir armağan. 🌿',
  'Tutarlılık ustalığın anasıdır. ✦',
  'Güçlü beden, sakin zihin. Niyetle hareket et.',
  'Geldin — bu zaten en zor kısımdı.',
  'Mükemmellik değil, ilerleme. Nefes al ve akış içinde kal.',
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [planCount, setPlanCount] = useState(0);
  const [quote] = useState(MOTIVASYON[Math.floor(Math.random() * MOTIVASYON.length)]);
  const [todayDone, setTodayDone] = useState(false);
  const [moodVisible, setMoodVisible] = useState(false);

  const loadStats = useCallback(async () => {
    const [completed, plans] = await Promise.all([getCompletedWorkouts(), getPlans()]);
    setStreak(computeStreak(completed));
    setTotalSessions(completed.length);
    setPlanCount(plans.length);
    const today = new Date().toISOString().slice(0, 10);
    setTodayDone(completed.some((w) => w.date.slice(0, 10) === today));
  }, []);

  useFocusEffect(useCallback(() => { loadStats(); }, [loadStats]));

  const featured = EXERCISES[Math.floor(Math.random() * EXERCISES.length)];

  const handleMoodSelect = useCallback(async (mood: Mood) => {
    setMoodVisible(false);
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem('@zerpilates:mood', JSON.stringify({ mood, date: today }));
    // Mood'a göre egzersiz filtrele
    const levelMap: Record<Mood, string[]> = {
      light:   ['Beginner'],
      medium:  ['Beginner', 'Intermediate'],
      intense: ['Beginner', 'Intermediate', 'Advanced'],
    };
    const levels = levelMap[mood];
    const ids = EXERCISES.filter((e) => levels.includes(e.level)).map((e) => e.id);
    navigation.navigate('Warmup', { exerciseIds: ids });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Selamlama */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingLabel}>{selamlama()},</Text>
          <Text style={styles.greetingName}>Zer 🌸</Text>
          <Text style={styles.quote}>{quote}</Text>
        </View>

        {/* Bugünün durumu */}
        <View style={[styles.todayCard, todayDone && styles.todayCardDone]}>
          <View style={styles.todayLeft}>
            <Text style={styles.todayEmoji}>{todayDone ? '✅' : '🧘‍♀️'}</Text>
            <View>
              <Text style={styles.todayTitle}>
                {todayDone ? 'Bugünkü antrenman tamam!' : 'Bugün hareket etmeye hazır mısın?'}
              </Text>
              <Text style={styles.todaySubtitle}>
                {todayDone
                  ? 'Harika iş! Şimdi dinlenme zamanı.'
                  : 'Hızlı bir seans başlat ya da programını aç.'}
              </Text>
            </View>
          </View>
          {!todayDone && (
            <TouchableOpacity
              style={styles.quickStart}
              onPress={() => setMoodVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.quickStartText}>Hızlı Başla</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* İstatistik kartları */}
        <View style={styles.statsRow}>
          <StatCard emoji="🔥" value={streak}        label="Seri"     highlight={streak >= 3} />
          <StatCard emoji="📅" value={totalSessions} label="Seans"    />
          <StatCard emoji="📋" value={planCount}     label="Program"  />
        </View>

        {/* Günün hareketi */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Günün Hareketi</Text>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() =>
              navigation.navigate('ExerciseDetail', { exerciseId: featured.id })
            }
            activeOpacity={0.8}
          >
            <View style={styles.featuredLeft}>
              <Text style={styles.featuredName}>{featured.name}</Text>
              <Text style={styles.featuredArea}>
                {areaLabel(featured.bodyArea)} · {levelLabel(featured.level)}
              </Text>
              <Text style={styles.featuredDesc} numberOfLines={2}>{featured.description}</Text>
            </View>
            <View style={styles.featuredRight}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>
                  {featured.sets} × {featured.reps}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hızlı erişim */}
        <View style={styles.actionsRow}>
          <ActionTile
            emoji="📚"
            title="Hareket Kütüphanesi"
            sub="23 pilates hareketi"
            color={Colors.sagePale}
            onPress={() => (navigation as any).navigate('Main', { screen: 'Library' })}
          />
          <ActionTile
            emoji="📝"
            title="Programlarım"
            sub={planCount > 0 ? `${planCount} kayıtlı` : 'Yeni oluştur'}
            color={Colors.creamDeep}
            onPress={() => (navigation as any).navigate('Main', { screen: 'Planner' })}
          />
        </View>

        {/* Ses test butonu — DEBUG */}
        <TouchableOpacity
          style={styles.debugBtn}
          onPress={() => (navigation as any).navigate('AudioTest')}
        >
          <Text style={styles.debugBtnText}>🔊 Ses Test Paneli</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      <MoodSelector
        visible={moodVisible}
        onSelect={handleMoodSelect}
        onClose={() => setMoodVisible(false)}
      />
    </SafeAreaView>
  );
}

function StatCard({
  emoji, value, label, highlight,
}: {
  emoji: string; value: number; label: string; highlight?: boolean;
}) {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionTile({
  emoji, title, sub, color, onPress,
}: {
  emoji: string; title: string; sub: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.actionTile, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 100 },

  greetingSection: { marginBottom: 22 },
  greetingLabel: { fontSize: 16, color: Colors.textMuted, fontWeight: '400' },
  greetingName: { fontSize: 34, fontWeight: '800', color: Colors.text, letterSpacing: -1, marginTop: 2 },
  quote: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 21,
    borderLeftWidth: 3,
    borderLeftColor: Colors.sageLight,
    paddingLeft: 12,
  },

  todayCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  todayCardDone: {
    borderColor: Colors.sageLight,
    backgroundColor: Colors.sagePale + '50',
  },
  todayLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  todayEmoji: { fontSize: 28, marginRight: 14 },
  todayTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  todaySubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
  quickStart: {
    backgroundColor: Colors.sage,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  quickStartText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statCardHighlight: {
    backgroundColor: Colors.terracotta + '15',
    borderWidth: 1.5,
    borderColor: Colors.terracotta + '50',
  },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.text },
  statValueHighlight: { color: Colors.terracotta },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 3, fontWeight: '500' },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  featuredSection: { marginBottom: 20 },
  featuredCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  featuredLeft: { flex: 1 },
  featuredName: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  featuredArea: { fontSize: 12, color: Colors.sage, fontWeight: '600', marginBottom: 6 },
  featuredDesc: { fontSize: 13, color: Colors.textLight, lineHeight: 19 },
  featuredRight: { alignItems: 'center', marginLeft: 12 },
  featuredBadge: {
    backgroundColor: Colors.sagePale,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  featuredBadgeText: { fontSize: 12, color: Colors.sageDark, fontWeight: '600' },
  arrow: { fontSize: 22, color: Colors.textMuted },

  debugBtn: {
    marginTop: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  debugBtnText: { fontSize: 14, fontWeight: '700', color: '#856404' },

  actionsRow: { flexDirection: 'row', gap: 10 },
  actionTile: { flex: 1, borderRadius: 16, padding: 16 },
  actionEmoji: { fontSize: 24, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  actionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
});
