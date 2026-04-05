import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, CompletedWorkout } from '../types';

const KEYS = {
  PLANS: '@zerpilates/plans',
  COMPLETED: '@zerpilates/completed',
} as const;

// ── Workout Plans ─────────────────────────────────────────────

export async function getPlans(): Promise<WorkoutPlan[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PLANS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function savePlan(plan: WorkoutPlan): Promise<void> {
  const plans = await getPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx >= 0) {
    plans[idx] = plan;
  } else {
    plans.push(plan);
  }
  await AsyncStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
}

export async function deletePlan(id: string): Promise<void> {
  const plans = await getPlans();
  await AsyncStorage.setItem(
    KEYS.PLANS,
    JSON.stringify(plans.filter((p) => p.id !== id))
  );
}

// ── Completed Workouts ────────────────────────────────────────

export async function getCompletedWorkouts(): Promise<CompletedWorkout[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function logWorkout(workout: CompletedWorkout): Promise<void> {
  const all = await getCompletedWorkouts();
  all.push(workout);
  await AsyncStorage.setItem(KEYS.COMPLETED, JSON.stringify(all));
}

// ── Stats helpers ─────────────────────────────────────────────

export function computeStreak(completed: CompletedWorkout[]): number {
  if (completed.length === 0) return 0;
  const dates = [...new Set(completed.map((w) => w.date.slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let expected = today;
  for (const d of dates) {
    if (d === expected) {
      streak++;
      const prev = new Date(expected);
      prev.setDate(prev.getDate() - 1);
      expected = prev.toISOString().slice(0, 10);
    } else if (d < expected) {
      break;
    }
  }
  return streak;
}

export function computeLongestStreak(completed: CompletedWorkout[]): number {
  if (completed.length === 0) return 0;
  const dates = [...new Set(completed.map((w) => w.date.slice(0, 10)))].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

export function computeFavorite(completed: CompletedWorkout[]): string | undefined {
  const freq: Record<string, number> = {};
  for (const w of completed) {
    for (const id of w.exercisesCompleted) {
      freq[id] = (freq[id] ?? 0) + 1;
    }
  }
  const entries = Object.entries(freq);
  if (!entries.length) return undefined;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}
