import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, levelColor, areaColor, levelLabel, areaLabel } from '../constants/colors';
import { EXERCISES } from '../constants/exercises';
import { Exercise, Level, BodyArea, RootStackParamList } from '../types';
import ExerciseCard from '../components/ExerciseCard';
import FilterChip from '../components/FilterChip';
import SearchBar from '../components/SearchBar';

type Nav = StackNavigationProp<RootStackParamList>;

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const AREAS: BodyArea[] = ['Core', 'Back', 'Legs', 'Full Body'];
type GroupBy = 'level' | 'area' | 'none';

export default function ExerciseLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activeArea, setActiveArea] = useState<BodyArea | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>('level');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return EXERCISES.filter((e) => {
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.muscleGroups.some((m) => m.toLowerCase().includes(q));
      const matchLevel = !activeLevel || e.level === activeLevel;
      const matchArea  = !activeArea  || e.bodyArea === activeArea;
      return matchSearch && matchLevel && matchArea;
    });
  }, [search, activeLevel, activeArea]);

  type Section = { title: string; color: string; data: Exercise[] };
  const sections = useMemo((): Section[] => {
    if (groupBy === 'level') {
      return LEVELS.map((lvl) => ({
        title: levelLabel(lvl),
        color: levelColor(lvl),
        data: filtered.filter((e) => e.level === lvl),
      })).filter((s) => s.data.length > 0);
    }
    if (groupBy === 'area') {
      return AREAS.map((area) => ({
        title: areaLabel(area),
        color: areaColor(area),
        data: filtered.filter((e) => e.bodyArea === area),
      })).filter((s) => s.data.length > 0);
    }
    return [{ title: 'Tüm Hareketler', color: Colors.sage, data: filtered }];
  }, [filtered, groupBy]);

  const handlePress = useCallback(
    (exercise: Exercise) => {
      navigation.navigate('ExerciseDetail', { exerciseId: exercise.id });
    },
    [navigation]
  );

  const toggleLevel = (l: Level) => setActiveLevel((prev) => (prev === l ? null : l));
  const toggleArea  = (a: BodyArea) => setActiveArea((prev) => (prev === a ? null : a));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
      <View style={styles.container}>

        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>Hareketler</Text>
          <Text style={styles.subtitle}>{filtered.length} / {EXERCISES.length} hareket</Text>
        </View>

        {/* Arama */}
        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>

        {/* Filtre — Seviye */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Seviye</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {LEVELS.map((l) => (
              <FilterChip
                key={l}
                label={levelLabel(l)}
                active={activeLevel === l}
                color={levelColor(l)}
                onPress={() => toggleLevel(l)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Filtre — Bölge */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Bölge</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {AREAS.map((a) => (
              <FilterChip
                key={a}
                label={areaLabel(a)}
                active={activeArea === a}
                color={areaColor(a)}
                onPress={() => toggleArea(a)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Gruplama */}
        <View style={styles.groupRow}>
          <Text style={styles.filterLabel}>Grupla  </Text>
          {(['level', 'area', 'none'] as GroupBy[]).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.groupChip, groupBy === g && styles.groupChipActive]}
              onPress={() => setGroupBy(g)}
            >
              <Text style={[styles.groupChipText, groupBy === g && styles.groupChipTextActive]}>
                {g === 'none' ? 'Yok' : g === 'level' ? 'Seviye' : 'Bölge'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Liste */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌿</Text>
            <Text style={styles.emptyText}>Filtrelere uyan hareket bulunamadı.</Text>
            <TouchableOpacity
              onPress={() => { setSearch(''); setActiveLevel(null); setActiveArea(null); }}
            >
              <Text style={styles.emptyReset}>Filtreleri temizle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) =>
              groupBy !== 'none' ? (
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
                  <Text style={[styles.sectionTitle, { color: section.color }]}>
                    {section.title}
                  </Text>
                  <Text style={styles.sectionCount}>{section.data.length}</Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <ExerciseCard exercise={item} onPress={() => handlePress(item)} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title:    { fontSize: 26, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textMuted },
  searchWrap: { marginBottom: 4 },
  filterSection: { marginBottom: 10 },
  filterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  filterRow: { paddingRight: 4 },
  groupRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  groupChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  groupChipActive:     { backgroundColor: Colors.text, borderColor: Colors.text },
  groupChipText:       { fontSize: 12, color: Colors.textLight, fontWeight: '500' },
  groupChipTextActive: { color: Colors.white },
  listContent: { paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionDot:   { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2, flex: 1 },
  sectionCount: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji: { fontSize: 42, marginBottom: 12 },
  emptyText:  { fontSize: 16, color: Colors.textLight, marginBottom: 12 },
  emptyReset: { fontSize: 15, color: Colors.sage, fontWeight: '600' },
});
