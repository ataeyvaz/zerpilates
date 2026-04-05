import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}

export default function FilterChip({ label, active, color, onPress }: Props) {
  const activeColor = color ?? Colors.sage;
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active && { backgroundColor: activeColor, borderColor: activeColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textLight,
  },
  labelActive: {
    color: Colors.white,
  },
});
