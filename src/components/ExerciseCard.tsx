import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Exercise } from '../types';
import { Colors, levelColor, areaColor, levelLabel, areaLabel } from '../constants/colors';

interface Props {
  exercise: Exercise;
  onPress: () => void;
  compact?: boolean;
}

export default function ExerciseCard({ exercise, onPress, compact }: Props) {
  const lvlColor = levelColor(exercise.level);
  const aColor = areaColor(exercise.bodyArea);

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Media placeholder / future AI image */}
      <View style={[styles.mediaBadge, { backgroundColor: aColor + '30' }]}>
        {exercise.mediaUri ? (
          <Image source={{ uri: exercise.mediaUri }} style={styles.mediaImage} />
        ) : (
          <Text style={[styles.mediaEmoji]}>{areaEmoji(exercise.bodyArea)}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{exercise.name}</Text>
        {!compact && (
          <Text style={styles.description} numberOfLines={2}>
            {exercise.description}
          </Text>
        )}

        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: lvlColor + '20', borderColor: lvlColor }]}>
            <Text style={[styles.badgeText, { color: lvlColor }]}>{levelLabel(exercise.level)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: aColor + '20', borderColor: aColor }]}>
            <Text style={[styles.badgeText, { color: aColor }]}>{areaLabel(exercise.bodyArea)}</Text>
          </View>
        </View>

        <Text style={styles.meta}>
          {exercise.sets} × {exercise.reps}
          {'  ·  '}
          {exercise.muscleGroups.slice(0, 2).join(', ')}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

function areaEmoji(area: string): string {
  switch (area) {
    case 'Core': return '○';
    case 'Back': return '↑';
    case 'Legs': return '|';
    case 'Full Body': return '✦';
    default: return '·';
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardCompact: {
    padding: 10,
  },
  mediaBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  mediaImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  mediaEmoji: {
    fontSize: 22,
    color: Colors.textLight,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 17,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  meta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.textMuted,
    marginLeft: 6,
    fontWeight: '300',
  },
});
