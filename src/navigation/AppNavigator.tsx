import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

import { Colors } from '../constants/colors';
import { RootStackParamList, TabParamList } from '../types';

// ── Screens ────────────────────────────────────────────────────
import HomeScreen             from '../screens/HomeScreen';
import ExerciseLibraryScreen  from '../screens/ExerciseLibraryScreen';
import ExerciseDetailScreen   from '../screens/ExerciseDetailScreen';
import WorkoutPlannerScreen   from '../screens/WorkoutPlannerScreen';
import TimerScreen            from '../screens/TimerScreen';
import ProgressTrackerScreen  from '../screens/ProgressTrackerScreen';
import WarmupScreen           from '../screens/WarmupScreen';
import CooldownScreen         from '../screens/CooldownScreen';
import AudioTestScreen        from '../screens/AudioTestScreen';

// ── Navigators ─────────────────────────────────────────────────
const Tab   = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// ── Custom SVG Tab Icons ───────────────────────────────────────
// Each icon receives { color, size } from the tab navigator.

type IconProps = { color: string; size: number };

function HomeIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M9 21V12h6v9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LibraryIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="18" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="3" width="7" height="18" rx="1" stroke={color} strokeWidth={1.8} />
      <Line x1="3" y1="8" x2="10" y2="8" stroke={color} strokeWidth={1.4} />
      <Line x1="14" y1="8" x2="21" y2="8" stroke={color} strokeWidth={1.4} />
    </Svg>
  );
}

function PlannerIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth={1.8} />
      <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="2" x2="8" y2="6"  stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M7 13h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}

function TimerIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 9v4l2.5 2.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="9" y1="2" x2="15" y2="2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ProgressIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Rect x="4"  y="12" width="3" height="8" rx="1" fill={color} opacity={0.5} />
      <Rect x="10" y="8"  width="3" height="12" rx="1" fill={color} opacity={0.7} />
      <Rect x="16" y="4"  width="3" height="16" rx="1" fill={color} />
    </Svg>
  );
}

// ── Bottom Tab Navigator ───────────────────────────────────────

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.sage,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.cream,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 22 : 8,
          paddingTop: 8,
          shadowColor: Colors.shadow,
          shadowOpacity: 1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          const s = size - 2; // slightly smaller for elegance
          switch (route.name) {
            case 'Home':     return <HomeIcon     color={color} size={s} />;
            case 'Library':  return <LibraryIcon  color={color} size={s} />;
            case 'Planner':  return <PlannerIcon  color={color} size={s} />;
            case 'TimerTab': return <TimerIcon    color={color} size={s} />;
            case 'Progress': return <ProgressIcon color={color} size={s} />;
            default:         return <View />;
          }
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}            options={{ title: 'Ana Sayfa' }}      />
      <Tab.Screen name="Library"  component={ExerciseLibraryScreen} options={{ title: 'Hareketler' }}    />
      <Tab.Screen name="Planner"  component={WorkoutPlannerScreen}  options={{ title: 'Program' }}       />
      <Tab.Screen name="TimerTab" component={TimerScreen}           options={{ title: 'Zamanlayıcı' }}   />
      <Tab.Screen name="Progress" component={ProgressTrackerScreen} options={{ title: 'İlerleme' }}      />
    </Tab.Navigator>
  );
}

// ── Root Stack Navigator ───────────────────────────────────────
// The stack sits above the tabs so ExerciseDetail and Timer (with params)
// can be pushed from any tab and animate over the tab bar.

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.cream } }}>
      <Stack.Screen name="Main"           component={TabNavigator}          />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen}  />
      <Stack.Screen name="Warmup"         component={WarmupScreen}          options={{ presentation: 'modal', cardStyle: { backgroundColor: Colors.cream } }} />
      <Stack.Screen
        name="Timer"
        component={TimerScreen}
        options={{ presentation: 'modal', cardStyle: { backgroundColor: Colors.cream } }}
      />
      <Stack.Screen name="Cooldown"       component={CooldownScreen}        options={{ presentation: 'modal', cardStyle: { backgroundColor: Colors.cream } }} />
      <Stack.Screen name="AudioTest"      component={AudioTestScreen}       />
    </Stack.Navigator>
  );
}
