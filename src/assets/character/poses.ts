// ─────────────────────────────────────────────────────────────────────────────
// Pose System — body part transforms for the PilatesCharacter SVG
// Canvas is 300×400. Character origin (hip centre) is at (150, 210).
//
// Each keyframe describes where every named body part should be.
// Transforms are applied in SVG space around each part's anchor point.
//
// rotate: degrees (positive = clockwise)
// tx / ty: pixel translation AFTER rotation
// ─────────────────────────────────────────────────────────────────────────────

export type BodyPart =
  | 'head'
  | 'neck'
  | 'torso'
  | 'leftUpperArm'
  | 'leftForearm'
  | 'rightUpperArm'
  | 'rightForearm'
  | 'leftThigh'
  | 'leftShin'
  | 'rightThigh'
  | 'rightShin';

export interface PartTransform {
  rotate?: number;
  tx?: number;
  ty?: number;
}

export type Keyframe = Partial<Record<BodyPart, PartTransform>>;

export interface PoseDefinition {
  id: string;
  name: string;
  keyframes: Keyframe[];
  /** ms per frame when animating */
  frameDuration: number;
}

// ── Neutral standing pose (baseline) ─────────────────────────────────────────
const NEUTRAL: Keyframe = {
  head:          { rotate: 0,   tx: 0,   ty: 0 },
  neck:          { rotate: 0,   tx: 0,   ty: 0 },
  torso:         { rotate: 0,   tx: 0,   ty: 0 },
  leftUpperArm:  { rotate: 15,  tx: 0,   ty: 0 },
  leftForearm:   { rotate: 10,  tx: 0,   ty: 0 },
  rightUpperArm: { rotate: -15, tx: 0,   ty: 0 },
  rightForearm:  { rotate: -10, tx: 0,   ty: 0 },
  leftThigh:     { rotate: 5,   tx: 0,   ty: 0 },
  leftShin:      { rotate: 0,   tx: 0,   ty: 0 },
  rightThigh:    { rotate: -5,  tx: 0,   ty: 0 },
  rightShin:     { rotate: 0,   tx: 0,   ty: 0 },
};

// ─────────────────────────────────────────────────────────────────────────────
// THE HUNDRED
// Lying on back, legs at table-top, arms pumping by sides
// ─────────────────────────────────────────────────────────────────────────────
const HUNDRED: PoseDefinition = {
  id: 'the-hundred',
  name: 'The Hundred',
  frameDuration: 200,
  keyframes: [
    // Frame 1 — supine, curl up, arms low
    {
      head:          { rotate: 35,  tx: 0,  ty: -8 },
      neck:          { rotate: 30,  tx: 0,  ty: 0  },
      torso:         { rotate: 15,  tx: 0,  ty: 10 },
      leftUpperArm:  { rotate: 80,  tx: -4, ty: 8  },
      leftForearm:   { rotate: 85,  tx: -2, ty: 4  },
      rightUpperArm: { rotate: -80, tx: 4,  ty: 8  },
      rightForearm:  { rotate: -85, tx: 2,  ty: 4  },
      leftThigh:     { rotate: -80, tx: -6, ty: -5 },
      leftShin:      { rotate: 90,  tx: 0,  ty: 0  },
      rightThigh:    { rotate: -80, tx: 6,  ty: -5 },
      rightShin:     { rotate: 90,  tx: 0,  ty: 0  },
    },
    // Frame 2 — arms pumped up slightly
    {
      head:          { rotate: 35,  tx: 0,  ty: -8 },
      neck:          { rotate: 30,  tx: 0,  ty: 0  },
      torso:         { rotate: 15,  tx: 0,  ty: 10 },
      leftUpperArm:  { rotate: 75,  tx: -4, ty: 4  },
      leftForearm:   { rotate: 80,  tx: -2, ty: 2  },
      rightUpperArm: { rotate: -75, tx: 4,  ty: 4  },
      rightForearm:  { rotate: -80, tx: 2,  ty: 2  },
      leftThigh:     { rotate: -80, tx: -6, ty: -5 },
      leftShin:      { rotate: 90,  tx: 0,  ty: 0  },
      rightThigh:    { rotate: -80, tx: 6,  ty: -5 },
      rightShin:     { rotate: 90,  tx: 0,  ty: 0  },
    },
    // Frame 3 — arms pumped down
    {
      head:          { rotate: 35,  tx: 0,  ty: -8 },
      neck:          { rotate: 30,  tx: 0,  ty: 0  },
      torso:         { rotate: 15,  tx: 0,  ty: 10 },
      leftUpperArm:  { rotate: 85,  tx: -4, ty: 10 },
      leftForearm:   { rotate: 90,  tx: -2, ty: 5  },
      rightUpperArm: { rotate: -85, tx: 4,  ty: 10 },
      rightForearm:  { rotate: -90, tx: 2,  ty: 5  },
      leftThigh:     { rotate: -80, tx: -6, ty: -5 },
      leftShin:      { rotate: 90,  tx: 0,  ty: 0  },
      rightThigh:    { rotate: -80, tx: 6,  ty: -5 },
      rightShin:     { rotate: 90,  tx: 0,  ty: 0  },
    },
    // Frame 4 — same as frame 2 (loop bounce)
    {
      head:          { rotate: 35,  tx: 0,  ty: -8 },
      neck:          { rotate: 30,  tx: 0,  ty: 0  },
      torso:         { rotate: 15,  tx: 0,  ty: 10 },
      leftUpperArm:  { rotate: 75,  tx: -4, ty: 4  },
      leftForearm:   { rotate: 80,  tx: -2, ty: 2  },
      rightUpperArm: { rotate: -75, tx: 4,  ty: 4  },
      rightForearm:  { rotate: -80, tx: 2,  ty: 2  },
      leftThigh:     { rotate: -80, tx: -6, ty: -5 },
      leftShin:      { rotate: 90,  tx: 0,  ty: 0  },
      rightThigh:    { rotate: -80, tx: 6,  ty: -5 },
      rightShin:     { rotate: 90,  tx: 0,  ty: 0  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLL UP
// Lying flat → peeling up to reach forward
// ─────────────────────────────────────────────────────────────────────────────
const ROLL_UP: PoseDefinition = {
  id: 'roll-up',
  name: 'Roll Up',
  frameDuration: 350,
  keyframes: [
    // F1 — lying flat, arms overhead
    {
      head:          { rotate: 0,   tx: 0,  ty: 0  },
      neck:          { rotate: 0,   tx: 0,  ty: 0  },
      torso:         { rotate: 0,   tx: 0,  ty: 20 },
      leftUpperArm:  { rotate: -20, tx: -5, ty: -5 },
      leftForearm:   { rotate: -15, tx: -3, ty: -3 },
      rightUpperArm: { rotate: 20,  tx: 5,  ty: -5 },
      rightForearm:  { rotate: 15,  tx: 3,  ty: -3 },
      leftThigh:     { rotate: 0,   tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 0,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F2 — mid roll, torso 45°
    {
      head:          { rotate: 20,  tx: 0,  ty: -5 },
      neck:          { rotate: 20,  tx: 0,  ty: 0  },
      torso:         { rotate: -45, tx: 0,  ty: 5  },
      leftUpperArm:  { rotate: -60, tx: -5, ty: 0  },
      leftForearm:   { rotate: -55, tx: -3, ty: 2  },
      rightUpperArm: { rotate: 60,  tx: 5,  ty: 0  },
      rightForearm:  { rotate: 55,  tx: 3,  ty: 2  },
      leftThigh:     { rotate: 0,   tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 0,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F3 — fully up, reaching to toes
    {
      head:          { rotate: 30,  tx: 0,  ty: -8 },
      neck:          { rotate: 30,  tx: 0,  ty: 0  },
      torso:         { rotate: -90, tx: 0,  ty: -5 },
      leftUpperArm:  { rotate: -100,tx: -5, ty: 5  },
      leftForearm:   { rotate: -95, tx: -3, ty: 3  },
      rightUpperArm: { rotate: 100, tx: 5,  ty: 5  },
      rightForearm:  { rotate: 95,  tx: 3,  ty: 3  },
      leftThigh:     { rotate: 0,   tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 0,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F4 — same as F2 (rolling back)
    {
      head:          { rotate: 20,  tx: 0,  ty: -5 },
      neck:          { rotate: 20,  tx: 0,  ty: 0  },
      torso:         { rotate: -45, tx: 0,  ty: 5  },
      leftUpperArm:  { rotate: -60, tx: -5, ty: 0  },
      leftForearm:   { rotate: -55, tx: -3, ty: 2  },
      rightUpperArm: { rotate: 60,  tx: 5,  ty: 0  },
      rightForearm:  { rotate: 55,  tx: 3,  ty: 2  },
      leftThigh:     { rotate: 0,   tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 0,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE LEG CIRCLE
// ─────────────────────────────────────────────────────────────────────────────
const SINGLE_LEG_CIRCLE: PoseDefinition = {
  id: 'leg-circles',
  name: 'Single Leg Circle',
  frameDuration: 250,
  keyframes: [
    // F1 — right leg up at 12 o'clock
    {
      torso:      { rotate: 10, tx: 0, ty: 15 },
      leftThigh:  { rotate: 5,  tx: -5, ty: 15 },
      leftShin:   { rotate: 0,  tx: 0,  ty: 0  },
      rightThigh: { rotate: -100, tx: 5, ty: -10 },
      rightShin:  { rotate: 10, tx: 0, ty: 0  },
    },
    // F2 — leg swings across (2 o'clock)
    {
      torso:      { rotate: 10, tx: 0,  ty: 15 },
      leftThigh:  { rotate: 5,  tx: -5, ty: 15 },
      leftShin:   { rotate: 0,  tx: 0,  ty: 0  },
      rightThigh: { rotate: -80, tx: 15, ty: -5 },
      rightShin:  { rotate: 15, tx: 0,  ty: 0  },
    },
    // F3 — leg sweeps down (5 o'clock)
    {
      torso:      { rotate: 10, tx: 0,  ty: 15 },
      leftThigh:  { rotate: 5,  tx: -5, ty: 15 },
      leftShin:   { rotate: 0,  tx: 0,  ty: 0  },
      rightThigh: { rotate: -30, tx: 10, ty: 10 },
      rightShin:  { rotate: 5,  tx: 0,  ty: 0  },
    },
    // F4 — leg swings back up (10 o'clock)
    {
      torso:      { rotate: 10, tx: 0,   ty: 15 },
      leftThigh:  { rotate: 5,  tx: -5,  ty: 15 },
      leftShin:   { rotate: 0,  tx: 0,   ty: 0  },
      rightThigh: { rotate: -90, tx: -10, ty: -8 },
      rightShin:  { rotate: 5,  tx: 0,   ty: 0  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLLING LIKE A BALL
// ─────────────────────────────────────────────────────────────────────────────
const ROLLING_BALL: PoseDefinition = {
  id: 'rolling-like-a-ball',
  name: 'Rolling Like a Ball',
  frameDuration: 300,
  keyframes: [
    // F1 — seated balance C-curve
    {
      head:       { rotate: 35,  tx: 0,  ty: -5 },
      neck:       { rotate: 30,  tx: 0,  ty: 0  },
      torso:      { rotate: -25, tx: 0,  ty: 0  },
      leftUpperArm:  { rotate: -70, tx: -5, ty: 5 },
      leftForearm:   { rotate: -80, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 70,  tx: 5,  ty: 5 },
      rightForearm:  { rotate: 80,  tx: 3,  ty: 5 },
      leftThigh:  { rotate: -110, tx: -8, ty: -15 },
      leftShin:   { rotate: 80,   tx: 0,  ty: -5  },
      rightThigh: { rotate: -110, tx: 8,  ty: -15 },
      rightShin:  { rotate: 80,   tx: 0,  ty: -5  },
    },
    // F2 — mid roll back
    {
      head:       { rotate: 60,  tx: 0,   ty: -10 },
      neck:       { rotate: 55,  tx: 0,   ty: 0   },
      torso:      { rotate: -60, tx: 0,   ty: 5   },
      leftUpperArm:  { rotate: -85, tx: -5, ty: 8 },
      leftForearm:   { rotate: -90, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 85,  tx: 5,  ty: 8 },
      rightForearm:  { rotate: 90,  tx: 3,  ty: 5 },
      leftThigh:  { rotate: -130, tx: -8, ty: -20 },
      leftShin:   { rotate: 100,  tx: 0,  ty: -8  },
      rightThigh: { rotate: -130, tx: 8,  ty: -20 },
      rightShin:  { rotate: 100,  tx: 0,  ty: -8  },
    },
    // F3 — fully rolled to shoulders
    {
      head:       { rotate: 80,  tx: 0,   ty: -15 },
      neck:       { rotate: 75,  tx: 0,   ty: 0   },
      torso:      { rotate: -80, tx: 0,   ty: 10  },
      leftUpperArm:  { rotate: -95, tx: -5, ty: 10 },
      leftForearm:   { rotate: -100, tx: -3, ty: 8 },
      rightUpperArm: { rotate: 95,  tx: 5,  ty: 10 },
      rightForearm:  { rotate: 100, tx: 3,  ty: 8  },
      leftThigh:  { rotate: -140, tx: -8, ty: -25 },
      leftShin:   { rotate: 110,  tx: 0,  ty: -10 },
      rightThigh: { rotate: -140, tx: 8,  ty: -25 },
      rightShin:  { rotate: 110,  tx: 0,  ty: -10 },
    },
    // F4 — rolling back to balance (F1)
    {
      head:       { rotate: 35,  tx: 0,  ty: -5 },
      neck:       { rotate: 30,  tx: 0,  ty: 0  },
      torso:      { rotate: -25, tx: 0,  ty: 0  },
      leftUpperArm:  { rotate: -70, tx: -5, ty: 5 },
      leftForearm:   { rotate: -80, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 70,  tx: 5,  ty: 5 },
      rightForearm:  { rotate: 80,  tx: 3,  ty: 5 },
      leftThigh:  { rotate: -110, tx: -8, ty: -15 },
      leftShin:   { rotate: 80,   tx: 0,  ty: -5  },
      rightThigh: { rotate: -110, tx: 8,  ty: -15 },
      rightShin:  { rotate: 80,   tx: 0,  ty: -5  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE LEG STRETCH
// ─────────────────────────────────────────────────────────────────────────────
const SINGLE_LEG_STRETCH: PoseDefinition = {
  id: 'single-leg-stretch',
  name: 'Single Leg Stretch',
  frameDuration: 280,
  keyframes: [
    // F1 — right leg extended, left knee in
    {
      head:       { rotate: 35,  tx: 0,  ty: -8  },
      torso:      { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: -50, tx: -5, ty: 5 },
      rightUpperArm: { rotate: 60,  tx: 5,  ty: 5 },
      leftThigh:  { rotate: -100, tx: -8, ty: -10 },
      leftShin:   { rotate: 90,   tx: 0,  ty: 0   },
      rightThigh: { rotate: -30,  tx: 5,  ty: 10  },
      rightShin:  { rotate: 5,    tx: 0,  ty: 0   },
    },
    // F2 — switching
    {
      head:       { rotate: 35,  tx: 0,  ty: -8  },
      torso:      { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: 60,  tx: -5, ty: 5 },
      rightUpperArm: { rotate: -50, tx: 5,  ty: 5 },
      leftThigh:  { rotate: -30,  tx: -5, ty: 10  },
      leftShin:   { rotate: 5,    tx: 0,  ty: 0   },
      rightThigh: { rotate: -100, tx: 8,  ty: -10 },
      rightShin:  { rotate: 90,   tx: 0,  ty: 0   },
    },
    // F3 — back to F1
    {
      head:       { rotate: 35,  tx: 0,  ty: -8  },
      torso:      { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: -50, tx: -5, ty: 5 },
      rightUpperArm: { rotate: 60,  tx: 5,  ty: 5 },
      leftThigh:  { rotate: -100, tx: -8, ty: -10 },
      leftShin:   { rotate: 90,   tx: 0,  ty: 0   },
      rightThigh: { rotate: -30,  tx: 5,  ty: 10  },
      rightShin:  { rotate: 5,    tx: 0,  ty: 0   },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DOUBLE LEG STRETCH
// ─────────────────────────────────────────────────────────────────────────────
const DOUBLE_LEG_STRETCH: PoseDefinition = {
  id: 'double-leg-stretch',
  name: 'Double Leg Stretch',
  frameDuration: 350,
  keyframes: [
    // F1 — curled in, knees hugged
    {
      head:          { rotate: 35,  tx: 0,  ty: -8  },
      torso:         { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: -60, tx: -5, ty: 5   },
      leftForearm:   { rotate: -65, tx: -3, ty: 3   },
      rightUpperArm: { rotate: 60,  tx: 5,  ty: 5   },
      rightForearm:  { rotate: 65,  tx: 3,  ty: 3   },
      leftThigh:     { rotate: -100,tx: -8, ty: -10 },
      leftShin:      { rotate: 85,  tx: 0,  ty: 0   },
      rightThigh:    { rotate: -100,tx: 8,  ty: -10 },
      rightShin:     { rotate: 85,  tx: 0,  ty: 0   },
    },
    // F2 — fully extended
    {
      head:          { rotate: 35,  tx: 0,  ty: -8  },
      torso:         { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: -20, tx: -5, ty: -5  },
      leftForearm:   { rotate: -15, tx: -3, ty: -3  },
      rightUpperArm: { rotate: 20,  tx: 5,  ty: -5  },
      rightForearm:  { rotate: 15,  tx: 3,  ty: -3  },
      leftThigh:     { rotate: -40, tx: -6, ty: 12  },
      leftShin:      { rotate: 5,   tx: 0,  ty: 0   },
      rightThigh:    { rotate: -40, tx: 6,  ty: 12  },
      rightShin:     { rotate: 5,   tx: 0,  ty: 0   },
    },
    // F3 — arms circling, pulling back in
    {
      head:          { rotate: 35,  tx: 0,  ty: -8  },
      torso:         { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: 50,  tx: -5, ty: 3   },
      leftForearm:   { rotate: 55,  tx: -3, ty: 2   },
      rightUpperArm: { rotate: -50, tx: 5,  ty: 3   },
      rightForearm:  { rotate: -55, tx: 3,  ty: 2   },
      leftThigh:     { rotate: -80, tx: -8, ty: -5  },
      leftShin:      { rotate: 60,  tx: 0,  ty: 0   },
      rightThigh:    { rotate: -80, tx: 8,  ty: -5  },
      rightShin:     { rotate: 60,  tx: 0,  ty: 0   },
    },
    // F4 — back to hug
    {
      head:          { rotate: 35,  tx: 0,  ty: -8  },
      torso:         { rotate: 15,  tx: 0,  ty: 10  },
      leftUpperArm:  { rotate: -60, tx: -5, ty: 5   },
      leftForearm:   { rotate: -65, tx: -3, ty: 3   },
      rightUpperArm: { rotate: 60,  tx: 5,  ty: 5   },
      rightForearm:  { rotate: 65,  tx: 3,  ty: 3   },
      leftThigh:     { rotate: -100,tx: -8, ty: -10 },
      leftShin:      { rotate: 85,  tx: 0,  ty: 0   },
      rightThigh:    { rotate: -100,tx: 8,  ty: -10 },
      rightShin:     { rotate: 85,  tx: 0,  ty: 0   },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SPINE STRETCH FORWARD
// ─────────────────────────────────────────────────────────────────────────────
const SPINE_STRETCH: PoseDefinition = {
  id: 'spine-stretch',
  name: 'Spine Stretch Forward',
  frameDuration: 400,
  keyframes: [
    // F1 — seated upright
    {
      head:          { rotate: 0,   tx: 0,  ty: 0  },
      neck:          { rotate: 0,   tx: 0,  ty: 0  },
      torso:         { rotate: -90, tx: 0,  ty: -10},
      leftUpperArm:  { rotate: -70, tx: -5, ty: 0  },
      leftForearm:   { rotate: -65, tx: -3, ty: 0  },
      rightUpperArm: { rotate: 70,  tx: 5,  ty: 0  },
      rightForearm:  { rotate: 65,  tx: 3,  ty: 0  },
      leftThigh:     { rotate: 10,  tx: -10,ty: 20 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -10, tx: 10, ty: 20 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F2 — rounded halfway forward
    {
      head:          { rotate: 25,  tx: 0,  ty: -5 },
      neck:          { rotate: 20,  tx: 0,  ty: 0  },
      torso:         { rotate: -115,tx: 0,  ty: -5 },
      leftUpperArm:  { rotate: -95, tx: -5, ty: 5  },
      leftForearm:   { rotate: -90, tx: -3, ty: 3  },
      rightUpperArm: { rotate: 95,  tx: 5,  ty: 5  },
      rightForearm:  { rotate: 90,  tx: 3,  ty: 3  },
      leftThigh:     { rotate: 10,  tx: -10,ty: 20 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -10, tx: 10, ty: 20 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F3 — full forward reach
    {
      head:          { rotate: 40,  tx: 0,  ty: -10},
      neck:          { rotate: 35,  tx: 0,  ty: 0  },
      torso:         { rotate: -130,tx: 0,  ty: 0  },
      leftUpperArm:  { rotate: -115,tx: -5, ty: 8  },
      leftForearm:   { rotate: -110,tx: -3, ty: 5  },
      rightUpperArm: { rotate: 115, tx: 5,  ty: 8  },
      rightForearm:  { rotate: 110, tx: 3,  ty: 5  },
      leftThigh:     { rotate: 10,  tx: -10,ty: 20 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -10, tx: 10, ty: 20 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F4 — back to upright (F1)
    {
      head:          { rotate: 0,   tx: 0,  ty: 0  },
      neck:          { rotate: 0,   tx: 0,  ty: 0  },
      torso:         { rotate: -90, tx: 0,  ty: -10},
      leftUpperArm:  { rotate: -70, tx: -5, ty: 0  },
      leftForearm:   { rotate: -65, tx: -3, ty: 0  },
      rightUpperArm: { rotate: 70,  tx: 5,  ty: 0  },
      rightForearm:  { rotate: 65,  tx: 3,  ty: 0  },
      leftThigh:     { rotate: 10,  tx: -10,ty: 20 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -10, tx: 10, ty: 20 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SWAN
// ─────────────────────────────────────────────────────────────────────────────
const SWAN: PoseDefinition = {
  id: 'swan',
  name: 'Swan',
  frameDuration: 400,
  keyframes: [
    // F1 — prone, flat
    {
      head:          { rotate: -20, tx: 0,  ty: -5 },
      neck:          { rotate: -15, tx: 0,  ty: 0  },
      torso:         { rotate: 0,   tx: 0,  ty: 0  },
      leftUpperArm:  { rotate: -110,tx: -8, ty: 0  },
      leftForearm:   { rotate: -100,tx: -4, ty: 0  },
      rightUpperArm: { rotate: 110, tx: 8,  ty: 0  },
      rightForearm:  { rotate: 100, tx: 4,  ty: 0  },
      leftThigh:     { rotate: -5,  tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 5,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F2 — half lift
    {
      head:          { rotate: -40, tx: 0,  ty: -8 },
      neck:          { rotate: -35, tx: 0,  ty: 0  },
      torso:         { rotate: 20,  tx: 0,  ty: -8 },
      leftUpperArm:  { rotate: -100,tx: -8, ty: 2  },
      leftForearm:   { rotate: -95, tx: -4, ty: 2  },
      rightUpperArm: { rotate: 100, tx: 8,  ty: 2  },
      rightForearm:  { rotate: 95,  tx: 4,  ty: 2  },
      leftThigh:     { rotate: -5,  tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 5,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F3 — full swan
    {
      head:          { rotate: -55, tx: 0,  ty: -12},
      neck:          { rotate: -50, tx: 0,  ty: 0  },
      torso:         { rotate: 40,  tx: 0,  ty: -15},
      leftUpperArm:  { rotate: -90, tx: -8, ty: 5  },
      leftForearm:   { rotate: -85, tx: -4, ty: 3  },
      rightUpperArm: { rotate: 90,  tx: 8,  ty: 5  },
      rightForearm:  { rotate: 85,  tx: 4,  ty: 3  },
      leftThigh:     { rotate: -5,  tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 5,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F4 — lowering back (F2)
    {
      head:          { rotate: -40, tx: 0,  ty: -8 },
      neck:          { rotate: -35, tx: 0,  ty: 0  },
      torso:         { rotate: 20,  tx: 0,  ty: -8 },
      leftUpperArm:  { rotate: -100,tx: -8, ty: 2  },
      leftForearm:   { rotate: -95, tx: -4, ty: 2  },
      rightUpperArm: { rotate: 100, tx: 8,  ty: 2  },
      rightForearm:  { rotate: 95,  tx: 4,  ty: 2  },
      leftThigh:     { rotate: -5,  tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 5,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDE KICK
// ─────────────────────────────────────────────────────────────────────────────
const SIDE_KICK: PoseDefinition = {
  id: 'side-kick',
  name: 'Side Kick',
  frameDuration: 280,
  keyframes: [
    // F1 — lying on side, neutral
    {
      head:       { rotate: -90, tx: 5,  ty: -5  },
      torso:      { rotate: -90, tx: 0,  ty: 0   },
      leftUpperArm:  { rotate: -90, tx: -10, ty: 0 },
      rightUpperArm: { rotate: 0,   tx: 15,  ty: 5 },
      leftThigh:  { rotate: -85, tx: -5, ty: 0 },
      leftShin:   { rotate: 0,   tx: 0,  ty: 0 },
      rightThigh: { rotate: -85, tx: -5, ty: 0 },
      rightShin:  { rotate: 0,   tx: 0,  ty: 0 },
    },
    // F2 — top leg kicked forward
    {
      head:       { rotate: -90, tx: 5,  ty: -5  },
      torso:      { rotate: -90, tx: 0,  ty: 0   },
      leftUpperArm:  { rotate: -90, tx: -10, ty: 0 },
      rightUpperArm: { rotate: 0,   tx: 15,  ty: 5 },
      leftThigh:  { rotate: -85, tx: -5, ty: 0  },
      leftShin:   { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh: { rotate: -55, tx: 0,  ty: -5 },
      rightShin:  { rotate: -10, tx: 0,  ty: 0  },
    },
    // F3 — top leg swept back
    {
      head:       { rotate: -90, tx: 5,  ty: -5  },
      torso:      { rotate: -90, tx: 0,  ty: 0   },
      leftUpperArm:  { rotate: -90, tx: -10, ty: 0 },
      rightUpperArm: { rotate: 0,   tx: 15,  ty: 5 },
      leftThigh:  { rotate: -85, tx: -5, ty: 0  },
      leftShin:   { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh: { rotate: -110,tx: -8, ty: 3  },
      rightShin:  { rotate: 10,  tx: 0,  ty: 0  },
    },
    // F4 — neutral again (F1)
    {
      head:       { rotate: -90, tx: 5,  ty: -5  },
      torso:      { rotate: -90, tx: 0,  ty: 0   },
      leftUpperArm:  { rotate: -90, tx: -10, ty: 0 },
      rightUpperArm: { rotate: 0,   tx: 15,  ty: 5 },
      leftThigh:  { rotate: -85, tx: -5, ty: 0 },
      leftShin:   { rotate: 0,   tx: 0,  ty: 0 },
      rightThigh: { rotate: -85, tx: -5, ty: 0 },
      rightShin:  { rotate: 0,   tx: 0,  ty: 0 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEASER
// ─────────────────────────────────────────────────────────────────────────────
const TEASER: PoseDefinition = {
  id: 'teaser',
  name: 'Teaser',
  frameDuration: 400,
  keyframes: [
    // F1 — lying flat
    {
      head:          { rotate: 0,   tx: 0,  ty: 0  },
      torso:         { rotate: 0,   tx: 0,  ty: 20 },
      leftUpperArm:  { rotate: -20, tx: -5, ty: -5 },
      leftForearm:   { rotate: -15, tx: -3, ty: -3 },
      rightUpperArm: { rotate: 20,  tx: 5,  ty: -5 },
      rightForearm:  { rotate: 15,  tx: 3,  ty: -3 },
      leftThigh:     { rotate: 0,   tx: -5, ty: 15 },
      leftShin:      { rotate: 0,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: 0,   tx: 5,  ty: 15 },
      rightShin:     { rotate: 0,   tx: 0,  ty: 0  },
    },
    // F2 — half way up
    {
      head:          { rotate: 20,  tx: 0,  ty: -5 },
      torso:         { rotate: -45, tx: 0,  ty: 5  },
      leftUpperArm:  { rotate: -65, tx: -5, ty: 0  },
      leftForearm:   { rotate: -60, tx: -3, ty: 0  },
      rightUpperArm: { rotate: 65,  tx: 5,  ty: 0  },
      rightForearm:  { rotate: 60,  tx: 3,  ty: 0  },
      leftThigh:     { rotate: -40, tx: -5, ty: 5  },
      leftShin:      { rotate: 5,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -40, tx: 5,  ty: 5  },
      rightShin:     { rotate: 5,   tx: 0,  ty: 0  },
    },
    // F3 — full V-balance
    {
      head:          { rotate: 25,  tx: 0,  ty: -8 },
      torso:         { rotate: -75, tx: 0,  ty: -5 },
      leftUpperArm:  { rotate: -90, tx: -5, ty: 5  },
      leftForearm:   { rotate: -85, tx: -3, ty: 3  },
      rightUpperArm: { rotate: 90,  tx: 5,  ty: 5  },
      rightForearm:  { rotate: 85,  tx: 3,  ty: 3  },
      leftThigh:     { rotate: -75, tx: -5, ty: -8 },
      leftShin:      { rotate: 5,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -75, tx: 5,  ty: -8 },
      rightShin:     { rotate: 5,   tx: 0,  ty: 0  },
    },
    // F4 — lowering back (F2)
    {
      head:          { rotate: 20,  tx: 0,  ty: -5 },
      torso:         { rotate: -45, tx: 0,  ty: 5  },
      leftUpperArm:  { rotate: -65, tx: -5, ty: 0  },
      leftForearm:   { rotate: -60, tx: -3, ty: 0  },
      rightUpperArm: { rotate: 65,  tx: 5,  ty: 0  },
      rightForearm:  { rotate: 60,  tx: 3,  ty: 0  },
      leftThigh:     { rotate: -40, tx: -5, ty: 5  },
      leftShin:      { rotate: 5,   tx: 0,  ty: 0  },
      rightThigh:    { rotate: -40, tx: 5,  ty: 5  },
      rightShin:     { rotate: 5,   tx: 0,  ty: 0  },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ALL POSES
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_POSES: PoseDefinition[] = [
  HUNDRED,
  ROLL_UP,
  SINGLE_LEG_CIRCLE,
  ROLLING_BALL,
  SINGLE_LEG_STRETCH,
  DOUBLE_LEG_STRETCH,
  SPINE_STRETCH,
  SWAN,
  SIDE_KICK,
  TEASER,
];

export const POSE_MAP: Record<string, PoseDefinition> = Object.fromEntries(
  ALL_POSES.map((p) => [p.id, p])
);

export const NEUTRAL_POSE: Keyframe = NEUTRAL;
