/**
 * ExerciseAnimation
 *
 * Displays an animated pilates figure for a given exercise.
 *
 * Priority:
 *  1. Pre-generated GIF from src/assets/gifs/<id>.gif  (fast, no JS cost)
 *  2. Live SVG animation driven by Animated API          (fallback)
 *
 * Both modes show:
 *  - The animated figure (300×240 viewport)
 *  - Step indicator dots below
 *  - Current instruction text synced to the active keyframe
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import PilatesCharacter from '../assets/character/PilatesCharacter';
import { POSE_MAP, Keyframe } from '../assets/character/poses';
import { EXERCISE_MAP } from '../constants/exercises';
import PHOTO_ASSETS from '../constants/photoAssets';


// ── Props ─────────────────────────────────────────────────────
interface Props {
  exerciseId: string;
  /** Height of the animation container (default 260) */
  height?: number;
  /** Show instruction text below (default true) */
  showInstructions?: boolean;
  /** Autoplay on mount (default true) */
  autoPlay?: boolean;
}

// ── Component ─────────────────────────────────────────────────
export default function ExerciseAnimation({
  exerciseId,
  height = 260,
  showInstructions = true,
  autoPlay = true,
}: Props) {
  const exercise = EXERCISE_MAP[exerciseId];
  const pose     = POSE_MAP[exerciseId];

  const [frameIdx, setFrameIdx]   = useState(0);
  const [playing, setPlaying]     = useState(autoPlay);
  const [currentPose, setPose]    = useState<Keyframe>(pose?.keyframes[0] ?? {});
  const [photoIdx, setPhotoIdx]   = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const frameCount   = pose?.keyframes.length ?? 0;
  const instructions = exercise?.instructions ?? [];
  const frameDuration = pose?.frameDuration ?? 300;
  const photoAsset   = PHOTO_ASSETS[exerciseId];
  const photos       = photoAsset?.steps ?? [];

  // ── Cross-fade between frames ──────────────────────────────
  const crossFadeTo = useCallback(
    (nextPose: Keyframe) => {
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.4, duration: frameDuration * 0.3, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1,   duration: frameDuration * 0.3, useNativeDriver: true }),
      ]).start();
      setPose(nextPose);
    },
    [opacityAnim, frameDuration]
  );

  // ── Advance frame ──────────────────────────────────────────
  const advance = useCallback(() => {
    if (!pose || frameCount === 0) return;
    setFrameIdx((idx) => {
      const next = (idx + 1) % frameCount;
      crossFadeTo(pose.keyframes[next]);
      return next;
    });
  }, [pose, frameCount, crossFadeTo]);

  // ── Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (playing) {
      if (photos.length > 1) {
        timerRef.current = setInterval(() => {
          setPhotoIdx((i) => (i + 1) % photos.length);
        }, 4000);
      } else if (frameCount > 1) {
        timerRef.current = setInterval(advance, frameDuration);
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, frameCount, advance, frameDuration, photos.length]);

  // ── Sync instruction line to frame ────────────────────────
  const instructionIdx = Math.min(
    frameIdx,
    instructions.length - 1
  );

  // ── Render Photo slideshow ────────────────────────────────
  if (photos.length > 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={[styles.photoWrap, { height }]}>
          <Image
            source={photos[photoIdx]}
            style={[styles.photo, { height }]}
            resizeMode="contain"
          />
          {/* Dot indicator */}
          {photos.length > 1 && (
            <View style={styles.photoDots}>
              {photos.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setPhotoIdx(i)}>
                  <View style={[styles.dot, i === photoIdx && styles.dotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Play/pause */}
          <TouchableOpacity
            style={styles.photoPlayBtn}
            onPress={() => setPlaying((v) => !v)}
          >
            <Text style={styles.playBtnText}>{playing ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
        </View>
        {showInstructions && instructions.length > 0 && (
          <InstructionBar
            text={instructions[Math.min(photoIdx, instructions.length - 1)]}
            index={Math.min(photoIdx, instructions.length - 1)}
            total={instructions.length}
          />
        )}
      </View>
    );
  }

  // ── SVG live animation fallback ───────────────────────────
  return (
    <View style={styles.container}>
      {/* Figure */}
      <View style={[styles.figureWrap, { height }]}>
        <Animated.View style={{ opacity: opacityAnim }}>
          <PilatesCharacter pose={currentPose} width={300} height={height} />
        </Animated.View>

        {/* Play/pause overlay */}
        {!playing && (
          <View style={styles.pauseOverlay} pointerEvents="none">
            <Text style={styles.pauseIcon}>⏸</Text>
          </View>
        )}
      </View>

      {/* Controls row */}
      <View style={styles.controls}>
        {/* Frame dots */}
        <View style={styles.dots}>
          {Array.from({ length: frameCount }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setFrameIdx(i);
                if (pose) crossFadeTo(pose.keyframes[i]);
              }}
            >
              <View
                style={[
                  styles.dot,
                  i === frameIdx && styles.dotActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Play/pause */}
        {frameCount > 1 && (
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setPlaying((v) => !v)}
          >
            <Text style={styles.playBtnText}>{playing ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Instruction */}
      {showInstructions && instructions.length > 0 && (
        <InstructionBar
          text={instructions[instructionIdx]}
          index={instructionIdx}
          total={instructions.length}
        />
      )}

      {/* No pose notice */}
      {!pose && (
        <Text style={styles.noPoseNote}>
          Animasyon yakında eklenecek 🌿
        </Text>
      )}
    </View>
  );
}

// ── Sub-component: instruction bar ────────────────────────────
function InstructionBar({
  text,
  index,
  total,
}: {
  text: string;
  index: number;
  total: number;
}) {
  return (
    <View style={styles.instructionBar}>
      <View style={styles.instructionNum}>
        <Text style={styles.instructionNumText}>{index + 1}</Text>
      </View>
      <Text style={styles.instructionText} numberOfLines={3}>
        {text}
      </Text>
      <Text style={styles.instructionCounter}>{index + 1}/{total}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  photoWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.creamDeep + '60',
    borderRadius: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
  },
  photoDots: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
  },
  photoPlayBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(247,243,238,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  figureWrap: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.creamDeep + '60',
    borderRadius: 20,
    overflow: 'hidden',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,243,238,0.3)',
  },
  pauseIcon: { fontSize: 32, opacity: 0.4 },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.sage,
    width: 16,
    borderRadius: 4,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.sagePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: { fontSize: 14, color: Colors.sageDark },

  instructionBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    width: '100%',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  instructionNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  instructionNumText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  instructionText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 20 },
  instructionCounter: { fontSize: 11, color: Colors.textMuted, flexShrink: 0, marginTop: 3 },

  noPoseNote: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
