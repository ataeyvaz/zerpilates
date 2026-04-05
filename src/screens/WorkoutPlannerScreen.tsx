import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/colors';
import { WorkoutPlan, WorkoutExercise } from '../types';
import { getPlans, savePlan, deletePlan } from '../store/storage';
import { EXERCISE_MAP, EXERCISES } from '../constants/exercises';
import ExerciseCard from '../components/ExerciseCard';

type Mode = 'list' | 'edit';

export default function WorkoutPlannerScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [mode, setMode] = useState<Mode>('list');
  const [editing, setEditing] = useState<WorkoutPlan | null>(null);
  const [planName, setPlanName] = useState('');
  const [selected, setSelected] = useState<WorkoutExercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = useCallback(async () => {
    setPlans(await getPlans());
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const startNew = () => {
    setEditing(null);
    setPlanName('');
    setSelected([]);
    setMode('edit');
  };

  const startEdit = (plan: WorkoutPlan) => {
    setEditing(plan);
    setPlanName(plan.name);
    setSelected(plan.exercises);
    setMode('edit');
  };

  const handleSave = async () => {
    if (!planName.trim()) {
      Alert.alert('İsim gerekli', 'Lütfen programınıza bir isim verin.');
      return;
    }
    if (selected.length === 0) {
      Alert.alert('Boş program', 'En az bir hareket ekleyin.');
      return;
    }
    const plan: WorkoutPlan = {
      id: editing?.id ?? Date.now().toString(),
      name: planName.trim(),
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      exercises: selected,
    };
    await savePlan(plan);
    await load();
    setMode('list');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Programı sil?', 'Bu işlem geri alınamaz.', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => { await deletePlan(id); await load(); },
      },
    ]);
  };

  const toggleExercise = (exId: string) => {
    setSelected((prev) => {
      const exists = prev.find((e) => e.exerciseId === exId);
      if (exists) {
        return prev.filter((e) => e.exerciseId !== exId);
      }
      return [...prev, { exerciseId: exId, sets: EXERCISE_MAP[exId]?.sets ?? 3, reps: EXERCISE_MAP[exId]?.reps ?? '10', restSeconds: 30 }];
    });
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    setSelected((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  // ─── PLAN LIST ──────────────────────────────────────────────
  if (mode === 'list') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Antrenman Programı</Text>
            <TouchableOpacity style={styles.newBtn} onPress={startNew}>
              <Text style={styles.newBtnText}>+ Yeni Program</Text>
            </TouchableOpacity>
          </View>

          {plans.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>Henüz program yok.</Text>
              <Text style={styles.emptySubtext}>Kişisel haftalık rutininizi oluşturun.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={startNew}>
                <Text style={styles.emptyBtnText}>İlk Programımı Oluştur</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
              {plans.map((plan) => (
                <View key={plan.id} style={styles.planCard}>
                  <View style={styles.planLeft}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planMeta}>
                      {plan.exercises.length} hareket
                      {'  ·  '}
                      {new Date(plan.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {plan.exercises.slice(0, 4).map((we) => (
                        <View key={we.exerciseId} style={styles.exChip}>
                          <Text style={styles.exChipText}>
                            {EXERCISE_MAP[we.exerciseId]?.name ?? '?'}
                          </Text>
                        </View>
                      ))}
                      {plan.exercises.length > 4 && (
                        <View style={[styles.exChip, styles.exChipMore]}>
                          <Text style={styles.exChipText}>+{plan.exercises.length - 4}</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                  <View style={styles.planActions}>
                    <TouchableOpacity
                      style={styles.planActionBtn}
                      onPress={() =>
                        navigation.navigate('Warmup', {
                          planId: plan.id,
                          exerciseIds: plan.exercises.map((e) => e.exerciseId),
                        })
                      }
                    >
                      <Text style={styles.planActionPlay}>▶</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.planActionBtn} onPress={() => startEdit(plan)}>
                      <Text style={styles.planActionEdit}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.planActionBtn} onPress={() => handleDelete(plan.id)}>
                      <Text style={styles.planActionDelete}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ─── PLAN EDITOR ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMode('list')}>
            <Text style={styles.backText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{editing ? 'Programı Düzenle' : 'Yeni Program'}</Text>
          <TouchableOpacity style={styles.newBtn} onPress={handleSave}>
            <Text style={styles.newBtnText}>Kaydet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {/* Plan name */}
          <Text style={styles.editorLabel}>Program Adı</Text>
          <TextInput
            style={styles.nameInput}
            value={planName}
            onChangeText={setPlanName}
            placeholder="örn. Sabah Akışı"
            placeholderTextColor={Colors.textMuted}
          />

          {/* Selected exercises */}
          <View style={styles.editorSection}>
            <View style={styles.editorSectionHeader}>
              <Text style={styles.editorLabel}>Hareketler ({selected.length})</Text>
              <TouchableOpacity onPress={() => setPickerOpen((v) => !v)}>
                <Text style={styles.addExText}>{pickerOpen ? '▲ Gizle' : '+ Hareket Ekle'}</Text>
              </TouchableOpacity>
            </View>

            {selected.length === 0 && (
              <Text style={styles.noExText}>Henüz hareket eklenmedi. + Hareket Ekle'ye dokun.</Text>
            )}

            {selected.map((we, idx) => {
              const ex = EXERCISE_MAP[we.exerciseId];
              if (!ex) return null;
              return (
                <View key={we.exerciseId} style={styles.selectedEx}>
                  <View style={styles.orderBtns}>
                    <TouchableOpacity onPress={() => moveUp(idx)} disabled={idx === 0}>
                      <Text style={[styles.orderBtn, idx === 0 && styles.orderBtnDisabled]}>▲</Text>
                    </TouchableOpacity>
                    <Text style={styles.orderIdx}>{idx + 1}</Text>
                    <TouchableOpacity onPress={() => moveDown(idx)} disabled={idx === selected.length - 1}>
                      <Text style={[styles.orderBtn, idx === selected.length - 1 && styles.orderBtnDisabled]}>▼</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.selectedExContent}>
                    <Text style={styles.selectedExName}>{ex.name}</Text>
                    <Text style={styles.selectedExMeta}>{we.sets} sets × {we.reps}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleExercise(we.exerciseId)}>
                    <Text style={styles.removeEx}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Exercise picker */}
          {pickerOpen && (
            <View style={styles.picker}>
              <Text style={styles.editorLabel}>Seçmek için dokun</Text>
              {EXERCISES.map((ex) => {
                const isSelected = selected.some((e) => e.exerciseId === ex.id);
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.pickerRow, isSelected && styles.pickerRowSelected]}
                    onPress={() => toggleExercise(ex.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pickerName}>{ex.name}</Text>
                    <Text style={styles.pickerMeta}>{ex.bodyArea} · {ex.level}</Text>
                    {isSelected && <Text style={styles.pickerCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
  backText: { fontSize: 16, color: Colors.sage, fontWeight: '600' },
  newBtn: {
    backgroundColor: Colors.sage,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  listContent: { paddingBottom: 100 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: Colors.textMuted, marginBottom: 20 },
  emptyBtn: {
    backgroundColor: Colors.sage,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  planLeft: { flex: 1 },
  planName: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  planMeta: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
  exChip: {
    backgroundColor: Colors.sagePale,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  exChipMore: { backgroundColor: Colors.creamDeep },
  exChipText: { fontSize: 11, color: Colors.sageDark, fontWeight: '500' },
  planActions: { gap: 4 },
  planActionBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planActionPlay: { fontSize: 16, color: Colors.sage },
  planActionEdit: { fontSize: 16, color: Colors.gold },
  planActionDelete: { fontSize: 14, color: Colors.terracotta },

  editorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 20,
  },
  editorSection: { marginBottom: 16 },
  editorSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  addExText: { fontSize: 14, color: Colors.sage, fontWeight: '600' },
  noExText: { fontSize: 14, color: Colors.textMuted, fontStyle: 'italic' },

  selectedEx: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderBtns: { alignItems: 'center', marginRight: 12 },
  orderBtn: { fontSize: 14, color: Colors.sage, padding: 2 },
  orderBtnDisabled: { color: Colors.border },
  orderIdx: { fontSize: 12, color: Colors.textMuted, marginVertical: 2 },
  selectedExContent: { flex: 1 },
  selectedExName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  selectedExMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  removeEx: { fontSize: 14, color: Colors.terracotta, padding: 4 },

  picker: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  pickerRowSelected: { backgroundColor: Colors.sagePale + '60' },
  pickerName: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.text },
  pickerMeta: { fontSize: 12, color: Colors.textMuted, marginRight: 8 },
  pickerCheck: { fontSize: 16, color: Colors.sage },
});
