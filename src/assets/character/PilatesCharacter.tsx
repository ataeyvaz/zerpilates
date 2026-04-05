/**
 * PilatesCharacter — minimal, elegant SVG female silhouette
 *
 * The figure is built from 11 articulated body parts.
 * Each part is a separate <G> element anchored at its joint origin so that
 * CSS / SVG transforms (rotate + translate) produce natural movement.
 *
 * Canvas: 300 × 400 px
 * Hip-centre origin: (150, 215)
 *
 * Usage:
 *   <PilatesCharacter pose={keyframe} width={300} height={400} />
 */

import React from 'react';
import Svg, {
  G,
  Path,
  Ellipse,
  Line,
  Circle,
} from 'react-native-svg';
import { Keyframe, BodyPart } from './poses';

// ── Design tokens ────────────────────────────────────────────
const STROKE = '#5C7F61';          // sage green
const STROKE_W = 2.5;
const FILL_SKIN = '#EDE8E0';       // warm cream — soft fill for head/hands
const FILL_BODY = '#D4E8D6';       // pale sage — clothing suggestion
const FILL_NONE = 'none';

// ── Anchor points (absolute, in SVG space) ───────────────────
const A = {
  hip:        { x: 150, y: 215 },  // pelvis centre — torso and leg root
  shoulder:   { x: 150, y: 155 },  // shoulder yoke centre
  neck:       { x: 150, y: 148 },
  head:       { x: 150, y: 133 },
  leftShoulder:  { x: 133, y: 158 },
  rightShoulder: { x: 167, y: 158 },
  leftElbow:     { x: 122, y: 185 },
  rightElbow:    { x: 178, y: 185 },
  leftHip:    { x: 139, y: 218 },
  rightHip:   { x: 161, y: 218 },
  leftKnee:   { x: 134, y: 262 },
  rightKnee:  { x: 166, y: 262 },
} as const;

// ── Transform helper ─────────────────────────────────────────
function buildTransform(
  anchorX: number,
  anchorY: number,
  t?: Keyframe[BodyPart]
): string {
  if (!t) return '';
  const parts: string[] = [];
  if (t.tx || t.ty) {
    parts.push(`translate(${t.tx ?? 0}, ${t.ty ?? 0})`);
  }
  if (t.rotate) {
    parts.push(`rotate(${t.rotate}, ${anchorX}, ${anchorY})`);
  }
  return parts.join(' ');
}

// ── Component ────────────────────────────────────────────────
interface Props {
  pose?: Keyframe;
  width?: number;
  height?: number;
  /** Override stroke colour */
  color?: string;
}

export default function PilatesCharacter({
  pose = {},
  width = 300,
  height = 400,
  color,
}: Props) {
  const stroke = color ?? STROKE;

  const sharedStroke = {
    stroke,
    strokeWidth: STROKE_W,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 300 400"
    >

      {/* ── HEAD ──────────────────────────────────────────── */}
      <G
        id="head"
        transform={buildTransform(A.head.x, A.head.y, pose.head)}
      >
        <Ellipse
          cx={A.head.x}
          cy={A.head.y}
          rx={13}
          ry={16}
          fill={FILL_SKIN}
          {...sharedStroke}
        />
        {/* Hair suggestion — simple arc */}
        <Path
          d={`M ${A.head.x - 11} ${A.head.y - 6} Q ${A.head.x} ${A.head.y - 28} ${A.head.x + 11} ${A.head.y - 6}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 0.8}
          opacity={0.6}
        />
      </G>

      {/* ── NECK ──────────────────────────────────────────── */}
      <G
        id="neck"
        transform={buildTransform(A.neck.x, A.neck.y, pose.neck)}
      >
        <Line
          x1={A.neck.x}
          y1={A.neck.y}
          x2={A.shoulder.x}
          y2={A.shoulder.y + 2}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.1}
        />
      </G>

      {/* ── TORSO ─────────────────────────────────────────── */}
      <G
        id="torso"
        transform={buildTransform(A.hip.x, A.hip.y, pose.torso)}
      >
        {/* Ribcage — slightly wider at top */}
        <Path
          d={`
            M ${A.hip.x - 16} ${A.hip.y}
            C ${A.hip.x - 18} ${A.hip.y - 25}, ${A.shoulder.x - 17} ${A.shoulder.y + 10}, ${A.shoulder.x - 17} ${A.shoulder.y}
            L ${A.shoulder.x + 17} ${A.shoulder.y}
            C ${A.shoulder.x + 17} ${A.shoulder.y + 10}, ${A.hip.x + 18} ${A.hip.y - 25}, ${A.hip.x + 16} ${A.hip.y}
            Z
          `}
          fill={FILL_BODY}
          {...sharedStroke}
        />
        {/* Pelvis shape */}
        <Path
          d={`
            M ${A.hip.x - 16} ${A.hip.y}
            Q ${A.hip.x - 20} ${A.hip.y + 12}, ${A.leftHip.x} ${A.leftHip.y + 2}
            M ${A.hip.x + 16} ${A.hip.y}
            Q ${A.hip.x + 20} ${A.hip.y + 12}, ${A.rightHip.x} ${A.rightHip.y + 2}
          `}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 0.9}
        />
        {/* Shoulder yoke */}
        <Line
          x1={A.leftShoulder.x - 4}
          y1={A.shoulder.y}
          x2={A.rightShoulder.x + 4}
          y2={A.shoulder.y}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.2}
        />
        {/* Spine suggestion */}
        <Line
          x1={A.shoulder.x}
          y1={A.shoulder.y + 4}
          x2={A.hip.x}
          y2={A.hip.y - 2}
          {...sharedStroke}
          strokeWidth={1}
          opacity={0.3}
          strokeDasharray="3,4"
        />
      </G>

      {/* ── LEFT UPPER ARM ────────────────────────────────── */}
      <G
        id="leftUpperArm"
        transform={buildTransform(A.leftShoulder.x, A.leftShoulder.y, pose.leftUpperArm)}
      >
        <Path
          d={`M ${A.leftShoulder.x} ${A.leftShoulder.y} L ${A.leftElbow.x} ${A.leftElbow.y}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.3}
        />
        {/* Elbow dot */}
        <Circle cx={A.leftElbow.x} cy={A.leftElbow.y} r={2.5} fill={stroke} />
      </G>

      {/* ── LEFT FOREARM ──────────────────────────────────── */}
      <G
        id="leftForearm"
        transform={buildTransform(A.leftElbow.x, A.leftElbow.y, pose.leftForearm)}
      >
        <Path
          d={`M ${A.leftElbow.x} ${A.leftElbow.y} L ${A.leftElbow.x - 6} ${A.leftElbow.y + 22}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W}
        />
        {/* Hand — small oval */}
        <Ellipse
          cx={A.leftElbow.x - 7}
          cy={A.leftElbow.y + 27}
          rx={4}
          ry={5}
          fill={FILL_SKIN}
          {...sharedStroke}
          strokeWidth={STROKE_W * 0.8}
        />
      </G>

      {/* ── RIGHT UPPER ARM ───────────────────────────────── */}
      <G
        id="rightUpperArm"
        transform={buildTransform(A.rightShoulder.x, A.rightShoulder.y, pose.rightUpperArm)}
      >
        <Path
          d={`M ${A.rightShoulder.x} ${A.rightShoulder.y} L ${A.rightElbow.x} ${A.rightElbow.y}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.3}
        />
        <Circle cx={A.rightElbow.x} cy={A.rightElbow.y} r={2.5} fill={stroke} />
      </G>

      {/* ── RIGHT FOREARM ─────────────────────────────────── */}
      <G
        id="rightForearm"
        transform={buildTransform(A.rightElbow.x, A.rightElbow.y, pose.rightForearm)}
      >
        <Path
          d={`M ${A.rightElbow.x} ${A.rightElbow.y} L ${A.rightElbow.x + 6} ${A.rightElbow.y + 22}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W}
        />
        <Ellipse
          cx={A.rightElbow.x + 7}
          cy={A.rightElbow.y + 27}
          rx={4}
          ry={5}
          fill={FILL_SKIN}
          {...sharedStroke}
          strokeWidth={STROKE_W * 0.8}
        />
      </G>

      {/* ── LEFT THIGH ────────────────────────────────────── */}
      <G
        id="leftThigh"
        transform={buildTransform(A.leftHip.x, A.leftHip.y, pose.leftThigh)}
      >
        <Path
          d={`M ${A.leftHip.x} ${A.leftHip.y} L ${A.leftKnee.x} ${A.leftKnee.y}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.5}
        />
        <Circle cx={A.leftKnee.x} cy={A.leftKnee.y} r={3} fill={stroke} opacity={0.7} />
      </G>

      {/* ── LEFT SHIN ─────────────────────────────────────── */}
      <G
        id="leftShin"
        transform={buildTransform(A.leftKnee.x, A.leftKnee.y, pose.leftShin)}
      >
        <Path
          d={`M ${A.leftKnee.x} ${A.leftKnee.y} L ${A.leftKnee.x - 3} ${A.leftKnee.y + 40}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.1}
        />
        {/* Foot */}
        <Path
          d={`M ${A.leftKnee.x - 3} ${A.leftKnee.y + 40} Q ${A.leftKnee.x - 10} ${A.leftKnee.y + 44} ${A.leftKnee.x - 16} ${A.leftKnee.y + 42}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.1}
        />
      </G>

      {/* ── RIGHT THIGH ───────────────────────────────────── */}
      <G
        id="rightThigh"
        transform={buildTransform(A.rightHip.x, A.rightHip.y, pose.rightThigh)}
      >
        <Path
          d={`M ${A.rightHip.x} ${A.rightHip.y} L ${A.rightKnee.x} ${A.rightKnee.y}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.5}
        />
        <Circle cx={A.rightKnee.x} cy={A.rightKnee.y} r={3} fill={stroke} opacity={0.7} />
      </G>

      {/* ── RIGHT SHIN ────────────────────────────────────── */}
      <G
        id="rightShin"
        transform={buildTransform(A.rightKnee.x, A.rightKnee.y, pose.rightShin)}
      >
        <Path
          d={`M ${A.rightKnee.x} ${A.rightKnee.y} L ${A.rightKnee.x + 3} ${A.rightKnee.y + 40}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.1}
        />
        {/* Foot */}
        <Path
          d={`M ${A.rightKnee.x + 3} ${A.rightKnee.y + 40} Q ${A.rightKnee.x + 10} ${A.rightKnee.y + 44} ${A.rightKnee.x + 16} ${A.rightKnee.y + 42}`}
          fill={FILL_NONE}
          {...sharedStroke}
          strokeWidth={STROKE_W * 1.1}
        />
      </G>

    </Svg>
  );
}
