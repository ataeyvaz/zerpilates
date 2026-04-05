import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from '../constants/colors';

export type Mood = 'light' | 'medium' | 'intense';

interface Props {
  visible: boolean;
  onSelect: (mood: Mood) => void;
  onClose: () => void;
}

const OPTIONS: { mood: Mood; emoji: string; title: string; sub: string; color: string }[] = [
  {
    mood: 'light',
    emoji: '😌',
    title: 'Hafif',
    sub: 'Bugün dinlendirici bir seans istiyorum',
    color: Colors.sageLight,
  },
  {
    mood: 'medium',
    emoji: '💪',
    title: 'Orta',
    sub: 'Normal tempoda devam',
    color: Colors.sage,
  },
  {
    mood: 'intense',
    emoji: '🔥',
    title: 'Yoğun',
    sub: 'Kendimi zorlayacağım!',
    color: Colors.terracotta,
  },
];

export default function MoodSelector({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Bugün nasıl hissediyorsun?</Text>
        <Text style={styles.sub}>Seçimine göre antrenman hazırlanacak</Text>
        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.mood}
              style={[styles.card, { borderColor: opt.color + '60' }]}
              onPress={() => onSelect(opt.mood)}
              activeOpacity={0.8}
            >
              <View style={[styles.cardLeft, { backgroundColor: opt.color + '20' }]}>
                <Text style={styles.cardEmoji}>{opt.emoji}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: opt.color }]}>{opt.title}</Text>
                <Text style={styles.cardSub}>{opt.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Vazgeç</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  sub:   { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },

  options: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardLeft: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 26 },
  cardText:  { flex: 1, paddingHorizontal: 14 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  cardSub:   { fontSize: 13, color: Colors.textLight },

  cancelBtn:  { marginTop: 16, alignItems: 'center', paddingVertical: 10 },
  cancelText: { fontSize: 15, color: Colors.textMuted, fontWeight: '500' },
});
