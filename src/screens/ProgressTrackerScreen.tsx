import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { CompletedWorkout } from '../types';
import {
  getCompletedWorkouts,
  computeStreak,
  computeLongestStreak,
  computeFavorite,
} from '../store/storage';
import { EXERCISE_MAP } from '../constants/exercises';

// ── Helpers ───────────────────────────────────────────────────

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(isoDate(d));
  }
  return days;
}

function shortDay(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 3);
}

function shortDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
}

/** Returns [{ weekStart, count }] for the last N weeks, newest last */
function weeklyBuckets(
  completed: CompletedWorkout[],
  weeks = 10,
): { label: string; count: number }[] {
  const buckets: { label: string; count: number }[] = [];
  const today = new Date();
  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date(today);
    end.setDate(today.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const label = (start.getMonth() + 1) + '/' + start.getDate();
    const count = completed.filter((c) => {
      const d = c.date.slice(0, 10);
      return d >= isoDate(start) && d <= isoDate(end);
    }).length;
    buckets.push({ label, count });
  }
  return buckets;
}

// ── Monthly Bar Chart (pure SVG) ──────────────────────────────

function WeeklyBarChart({ data }: { data: { label: string; count: number }[] }) {
  const W = 340;
  const H = 120;
  const PAD = { left: 24, right: 8, top: 10, bottom: 28 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const barW = chartW / data.length - 4;

  return (
    <Svg width={W} height={H}>
      {/* Y-axis baseline */}
      <Line
        x1={PAD.left}
        y1={PAD.top + chartH}
        x2={W - PAD.right}
        y2={PAD.top + chartH}
        stroke={Colors.border}
        strokeWidth={1}
      />

      {data.map((d, i) => {
        const barH = d.count === 0 ? 2 : (d.count / maxCount) * chartH;
        const x = PAD.left + i * (chartW / data.length) + 2;
        const y = PAD.top + chartH - barH;
        const isLast = i === data.length - 1;

        return (
          <G key={i}>
            <Rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={isLast ? Colors.sage : Colors.sageLight}
              opacity={d.count === 0 ? 0.25 : 1}
            />
            {/* Label every other week to avoid crowding */}
            {i % 2 === 0 && (
              <SvgText
                x={x + barW / 2}
                y={H - 6}
                fontSize={8}
                fill={Colors.textMuted}
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            )}
            {/* Count above bar */}
            {d.count > 0 && (
              <SvgText
                x={x + barW / 2}
                y={y - 3}
                fontSize={8}
                fill={isLast ? Colors.sageDark : Colors.textMuted}
                textAnchor="middle"
                fontWeight={isLast ? '700' : '400'}
              >
                {d.count}
              </SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}

// ── Main Screen ───────────────────────────────────────────────

export default function ProgressTrackerScreen() {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    const data = await getCompletedWorkouts();
    setWorkouts(data.slice().reverse()); // newest first
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const allChronological = useMemo(() => workouts.slice().reverse(), [workouts]);

  const streak        = useMemo(() => computeStreak(allChronological),        [allChronological]);
  const longestStreak = useMemo(() => computeLongestStreak(allChronological),  [allChronological]);
  const totalMinutes  = useMemo(() => allChronological.reduce((s, w) => s + w.durationMinutes, 0), [allChronological]);
  const favoriteId    = useMemo(() => computeFavorite(allChronological),       [allChronological]);
  const favName       = favoriteId ? (EXERCISE_MAP[favoriteId]?.name ?? '—') : '—';

  const days7         = useMemo(() => last7Days(), []);
  const completedSet  = useMemo(
    () => new Set(allChronological.map((w) => w.date.slice(0, 10))),
    [allChronological]
  );
  const barData = useMemo(() => weeklyBuckets(allChronological, 10), [allChronological]);
  const recent  = workouts.slice(0, 10);

  // ── Empty state ────────────────────────────────────────────
  if (!loading && workouts.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIllustration}>🌱</Text>
          <Text style={styles.emptyTitle}>Yolculuğun burada başlıyor</Text>
          <Text style={styles.emptyBody}>
            İlerlemeyi takip etmek, seri oluşturmak ve istatistiklerini büyütmek için ilk antrenmanını tamamla.
          </Text>
          <View style={styles.emptyHint}>
            <Text style={styles.emptyHintText}>Ana Sayfa → Hızlı Başla'ya git</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>İlerleme</Text>
          <Text style={styles.subtitle}>{allChronological.length} toplam seans</Text>
        </View>

        {/* ── Weekly streak calendar ──────────────────────── */}
        <SectionCard title="Bu Hafta">
          <View style={styles.weekRow}>
            {days7.map((d) => {
              const done   = completedSet.has(d);
              const isToday = d === isoDate(new Date());
              return (
                <View key={d} style={styles.dayCol}>
                  <Text style={[styles.dayLetter, isToday && styles.dayLetterToday]}>
                    {shortDay(d)}
                  </Text>
                  <View
                    style={[
                      styles.dayCircle,
                      done  && styles.dayCircleDone,
                      isToday && !done && styles.dayCircleToday,
                    ]}
                  >
                    {done && <Text style={styles.dayCheck}>✓</Text>}
                    {!done && isToday && <Text style={styles.dayTodayDot}>·</Text>}
                  </View>
                  <Text style={styles.dayDate}>
                    {new Date(d + 'T12:00:00').getDate()}
                  </Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        {/* ── Stat cards ──────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <StatCard
            emoji="🔥"
            value={String(streak)}
            label="Güncel Seri"
            sub="gün"
            accent={streak >= 3 ? Colors.terracotta : undefined}
          />
          <StatCard
            emoji="🏆"
            value={String(longestStreak)}
            label="En İyi Seri"
            sub="gün"
          />
          <StatCard
            emoji="📅"
            value={String(allChronological.length)}
            label="Toplam Seans"
            sub="antrenman"
          />
          <StatCard
            emoji="⏱"
            value={totalMinutes >= 60 ? (totalMinutes / 60).toFixed(1) : String(totalMinutes)}
            label="Toplam Süre"
            sub={totalMinutes >= 60 ? 'saat' : 'dakika'}
          />
        </View>

        {/* Favorite exercise */}
        {favoriteId && (
          <View style={styles.favoriteCard}>
            <Text style={styles.favEmoji}>⭐</Text>
            <View style={styles.favContent}>
              <Text style={styles.favLabel}>En Sevilen Hareket</Text>
              <Text style={styles.favName}>{favName}</Text>
            </View>
          </View>
        )}

        {/* ── Weekly activity chart ────────────────────────── */}
        <SectionCard title="Aktivite — Son 10 Hafta">
          <View style={styles.chartWrap}>
            <WeeklyBarChart data={barData} />
          </View>
          <View style={styles.chartLegend}>
            <View style={[styles.legendDot, { backgroundColor: Colors.sage }]} />
            <Text style={styles.legendText}>seans/hafta</Text>
          </View>
        </SectionCard>

        {/* ── Recent workouts ──────────────────────────────── */}
        <SectionCard title="Son Antrenmanlar">
          {recent.length === 0 ? (
            <Text style={styles.noData}>Henüz antrenman yok.</Text>
          ) : (
            recent.map((w, i) => (
              <WorkoutRow key={w.id} workout={w} isLast={i === recent.length - 1} />
            ))
          )}
        </SectionCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatCard({
  emoji,
  value,
  label,
  sub,
  accent,
}: {
  emoji: string;
  value: string;
  label: string;
  sub: string;
  accent?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, accent ? { color: accent } : undefined]}>
        {value}
      </Text>
      <Text style={styles.statSub}>{sub}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function WorkoutRow({
  workout,
  isLast,
}: {
  workout: CompletedWorkout;
  isLast: boolean;
}) {
  const exerciseNames = workout.exercisesCompleted
    .slice(0, 3)
    .map((id) => EXERCISE_MAP[id]?.name ?? id)
    .join(', ');
  const more = workout.exercisesCompleted.length > 3
    ? ` +${workout.exercisesCompleted.length - 3}`
    : '';

  return (
    <View style={[styles.workoutRow, isLast && styles.workoutRowLast]}>
      <View style={styles.workoutDateBadge}>
        <Text style={styles.workoutDateDay}>
          {new Date(workout.date + 'T12:00:00').getDate()}
        </Text>
        <Text style={styles.workoutDateMon}>
          {new Date(workout.date + 'T12:00:00').toLocaleDateString('tr-TR', { month: 'short' })}
        </Text>
      </View>
      <View style={styles.workoutContent}>
        <Text style={styles.workoutExercises} numberOfLines={1}>
          {exerciseNames}{more}
        </Text>
        <View style={styles.workoutMeta}>
          <Text style={styles.workoutMetaText}>{workout.durationMinutes} dk</Text>
          <Text style={styles.workoutMetaDot}>·</Text>
          <Text style={styles.workoutMetaText}>
            {workout.exercisesCompleted.length} hareket
          </Text>
        </View>
      </View>
      <View style={[styles.durationBadge]}>
        <Text style={styles.durationText}>{workout.durationMinutes}m</Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title:    { fontSize: 26, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textMuted },

  // Weekly calendar
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol:  { alignItems: 'center', flex: 1 },
  dayLetter: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginBottom: 6 },
  dayLetterToday: { color: Colors.sage },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  dayCircleDone: {
    backgroundColor: Colors.sage,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: Colors.sage,
    backgroundColor: Colors.sagePale,
  },
  dayCheck:    { fontSize: 14, color: Colors.white, fontWeight: '700' },
  dayTodayDot: { fontSize: 18, color: Colors.sage, lineHeight: 20 },
  dayDate:     { fontSize: 10, color: Colors.textMuted },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -1 },
  statSub:   { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  statLabel: { fontSize: 12, color: Colors.textLight, marginTop: 5, fontWeight: '500' },

  // Favourite
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '20',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
  },
  favEmoji:   { fontSize: 24, marginRight: 12 },
  favContent: { flex: 1 },
  favLabel:   { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  favName:    { fontSize: 16, fontWeight: '700', color: Colors.text },

  // Chart
  chartWrap:   { alignItems: 'center', marginHorizontal: -4 },
  chartLegend: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  legendDot:   { width: 8, height: 8, borderRadius: 4 },
  legendText:  { fontSize: 11, color: Colors.textMuted },

  // Recent workouts
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  workoutRowLast: { borderBottomWidth: 0 },
  workoutDateBadge: {
    width: 36,
    height: 40,
    backgroundColor: Colors.sagePale,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  workoutDateDay: { fontSize: 14, fontWeight: '800', color: Colors.sageDark, lineHeight: 17 },
  workoutDateMon: { fontSize: 10, color: Colors.sage, fontWeight: '600' },
  workoutContent: { flex: 1 },
  workoutExercises: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  workoutMeta:      { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 5 },
  workoutMetaText:  { fontSize: 11, color: Colors.textMuted },
  workoutMetaDot:   { fontSize: 11, color: Colors.border },
  durationBadge: {
    backgroundColor: Colors.creamDeep,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationText: { fontSize: 12, color: Colors.textLight, fontWeight: '600' },

  noData: { fontSize: 14, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center', paddingVertical: 12 },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
  },
  emptyIllustration: { fontSize: 72, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 10, textAlign: 'center' },
  emptyBody: {
    fontSize: 15,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
  },
  emptyHint: {
    backgroundColor: Colors.sagePale,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  emptyHintText: { fontSize: 14, color: Colors.sageDark, fontWeight: '600' },
});
