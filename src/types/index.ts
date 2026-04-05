export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type BodyArea = 'Core' | 'Back' | 'Legs' | 'Full Body';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  level: Level;
  bodyArea: BodyArea;
  sets: number;
  reps: string; // e.g. "10" or "10-12" or "30s"
  durationSeconds?: number; // for timed exercises
  instructions: string[];
  tips?: string[];
  // Hook for AI-generated visuals (Phase 2)
  mediaUri?: string | null;
  aiImagePrompt?: string; // hint for future AI image generation
}

export interface WorkoutPlan {
  id: string;
  name: string;
  createdAt: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface CompletedWorkout {
  id: string;
  planId?: string;
  planName?: string;
  date: string; // ISO date string
  durationMinutes: number;
  exercisesCompleted: string[]; // exercise ids
}

export interface ProgressStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  favoriteExerciseId?: string;
  weeklyHistory: Record<string, boolean>; // date → completed
}

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  ExerciseDetail: { exerciseId: string };
  Warmup: { exerciseIds?: string[]; playFullAudio?: boolean; planId?: string };
  Timer: { planId?: string; exerciseIds?: string[]; playFullAudio?: boolean };
  Cooldown: { exerciseCount: number; durationMinutes: number };
  CreatePlan: { planId?: string };
  AudioTest: undefined;
};

export type TabParamList = {
  Home: undefined;
  Library: undefined;
  Planner: undefined;
  TimerTab: undefined;
  Progress: undefined;
};
