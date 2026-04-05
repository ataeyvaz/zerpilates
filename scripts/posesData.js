/**
 * posesData.js — plain JS mirror of src/assets/character/poses.ts
 * Used by generateGifs.js at runtime (no TypeScript compilation needed).
 */
'use strict';

// ─── The Hundred ────────────────────────────────────────────────────────────
const HUNDRED = {
  id: 'the-hundred',
  name: 'The Hundred',
  frameDuration: 200,
  keyframes: [
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

// ─── Roll Up ─────────────────────────────────────────────────────────────────
const ROLL_UP = {
  id: 'roll-up',
  name: 'Roll Up',
  frameDuration: 350,
  keyframes: [
    {
      head: { rotate: 0, tx: 0, ty: 0 }, neck: { rotate: 0, tx: 0, ty: 0 },
      torso: { rotate: 0, tx: 0, ty: 20 },
      leftUpperArm: { rotate: -20, tx: -5, ty: -5 }, leftForearm: { rotate: -15, tx: -3, ty: -3 },
      rightUpperArm: { rotate: 20, tx: 5, ty: -5 }, rightForearm: { rotate: 15, tx: 3, ty: -3 },
      leftThigh: { rotate: 0, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 0, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 20, tx: 0, ty: -5 }, neck: { rotate: 20, tx: 0, ty: 0 },
      torso: { rotate: -45, tx: 0, ty: 5 },
      leftUpperArm: { rotate: -60, tx: -5, ty: 0 }, leftForearm: { rotate: -55, tx: -3, ty: 2 },
      rightUpperArm: { rotate: 60, tx: 5, ty: 0 }, rightForearm: { rotate: 55, tx: 3, ty: 2 },
      leftThigh: { rotate: 0, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 0, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 30, tx: 0, ty: -8 }, neck: { rotate: 30, tx: 0, ty: 0 },
      torso: { rotate: -90, tx: 0, ty: -5 },
      leftUpperArm: { rotate: -100, tx: -5, ty: 5 }, leftForearm: { rotate: -95, tx: -3, ty: 3 },
      rightUpperArm: { rotate: 100, tx: 5, ty: 5 }, rightForearm: { rotate: 95, tx: 3, ty: 3 },
      leftThigh: { rotate: 0, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 0, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 20, tx: 0, ty: -5 }, neck: { rotate: 20, tx: 0, ty: 0 },
      torso: { rotate: -45, tx: 0, ty: 5 },
      leftUpperArm: { rotate: -60, tx: -5, ty: 0 }, leftForearm: { rotate: -55, tx: -3, ty: 2 },
      rightUpperArm: { rotate: 60, tx: 5, ty: 0 }, rightForearm: { rotate: 55, tx: 3, ty: 2 },
      leftThigh: { rotate: 0, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 0, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
  ],
};

// ─── Single Leg Circle ───────────────────────────────────────────────────────
const SINGLE_LEG_CIRCLE = {
  id: 'leg-circles',
  name: 'Single Leg Circle',
  frameDuration: 250,
  keyframes: [
    { torso: { rotate: 10, tx: 0, ty: 15 }, leftThigh: { rotate: 5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 }, rightThigh: { rotate: -100, tx: 5, ty: -10 }, rightShin: { rotate: 10, tx: 0, ty: 0 } },
    { torso: { rotate: 10, tx: 0, ty: 15 }, leftThigh: { rotate: 5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 }, rightThigh: { rotate: -80, tx: 15, ty: -5 }, rightShin: { rotate: 15, tx: 0, ty: 0 } },
    { torso: { rotate: 10, tx: 0, ty: 15 }, leftThigh: { rotate: 5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 }, rightThigh: { rotate: -30, tx: 10, ty: 10 }, rightShin: { rotate: 5, tx: 0, ty: 0 } },
    { torso: { rotate: 10, tx: 0, ty: 15 }, leftThigh: { rotate: 5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 }, rightThigh: { rotate: -90, tx: -10, ty: -8 }, rightShin: { rotate: 5, tx: 0, ty: 0 } },
  ],
};

// ─── Rolling Like a Ball ─────────────────────────────────────────────────────
const ROLLING_BALL = {
  id: 'rolling-like-a-ball',
  name: 'Rolling Like a Ball',
  frameDuration: 300,
  keyframes: [
    {
      head: { rotate: 35, tx: 0, ty: -5 }, neck: { rotate: 30, tx: 0, ty: 0 },
      torso: { rotate: -25, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -70, tx: -5, ty: 5 }, leftForearm: { rotate: -80, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 70, tx: 5, ty: 5 }, rightForearm: { rotate: 80, tx: 3, ty: 5 },
      leftThigh: { rotate: -110, tx: -8, ty: -15 }, leftShin: { rotate: 80, tx: 0, ty: -5 },
      rightThigh: { rotate: -110, tx: 8, ty: -15 }, rightShin: { rotate: 80, tx: 0, ty: -5 },
    },
    {
      head: { rotate: 60, tx: 0, ty: -10 }, neck: { rotate: 55, tx: 0, ty: 0 },
      torso: { rotate: -60, tx: 0, ty: 5 },
      leftUpperArm: { rotate: -85, tx: -5, ty: 8 }, leftForearm: { rotate: -90, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 85, tx: 5, ty: 8 }, rightForearm: { rotate: 90, tx: 3, ty: 5 },
      leftThigh: { rotate: -130, tx: -8, ty: -20 }, leftShin: { rotate: 100, tx: 0, ty: -8 },
      rightThigh: { rotate: -130, tx: 8, ty: -20 }, rightShin: { rotate: 100, tx: 0, ty: -8 },
    },
    {
      head: { rotate: 80, tx: 0, ty: -15 }, neck: { rotate: 75, tx: 0, ty: 0 },
      torso: { rotate: -80, tx: 0, ty: 10 },
      leftUpperArm: { rotate: -95, tx: -5, ty: 10 }, leftForearm: { rotate: -100, tx: -3, ty: 8 },
      rightUpperArm: { rotate: 95, tx: 5, ty: 10 }, rightForearm: { rotate: 100, tx: 3, ty: 8 },
      leftThigh: { rotate: -140, tx: -8, ty: -25 }, leftShin: { rotate: 110, tx: 0, ty: -10 },
      rightThigh: { rotate: -140, tx: 8, ty: -25 }, rightShin: { rotate: 110, tx: 0, ty: -10 },
    },
    {
      head: { rotate: 35, tx: 0, ty: -5 }, neck: { rotate: 30, tx: 0, ty: 0 },
      torso: { rotate: -25, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -70, tx: -5, ty: 5 }, leftForearm: { rotate: -80, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 70, tx: 5, ty: 5 }, rightForearm: { rotate: 80, tx: 3, ty: 5 },
      leftThigh: { rotate: -110, tx: -8, ty: -15 }, leftShin: { rotate: 80, tx: 0, ty: -5 },
      rightThigh: { rotate: -110, tx: 8, ty: -15 }, rightShin: { rotate: 80, tx: 0, ty: -5 },
    },
  ],
};

// ─── Single Leg Stretch ──────────────────────────────────────────────────────
const SINGLE_LEG_STRETCH = {
  id: 'single-leg-stretch',
  name: 'Single Leg Stretch',
  frameDuration: 280,
  keyframes: [
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: -50, tx: -5, ty: 5 }, rightUpperArm: { rotate: 60, tx: 5, ty: 5 },
      leftThigh: { rotate: -100, tx: -8, ty: -10 }, leftShin: { rotate: 90, tx: 0, ty: 0 },
      rightThigh: { rotate: -30, tx: 5, ty: 10 }, rightShin: { rotate: 5, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: 60, tx: -5, ty: 5 }, rightUpperArm: { rotate: -50, tx: 5, ty: 5 },
      leftThigh: { rotate: -30, tx: -5, ty: 10 }, leftShin: { rotate: 5, tx: 0, ty: 0 },
      rightThigh: { rotate: -100, tx: 8, ty: -10 }, rightShin: { rotate: 90, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: -50, tx: -5, ty: 5 }, rightUpperArm: { rotate: 60, tx: 5, ty: 5 },
      leftThigh: { rotate: -100, tx: -8, ty: -10 }, leftShin: { rotate: 90, tx: 0, ty: 0 },
      rightThigh: { rotate: -30, tx: 5, ty: 10 }, rightShin: { rotate: 5, tx: 0, ty: 0 },
    },
  ],
};

// ─── Double Leg Stretch ──────────────────────────────────────────────────────
const DOUBLE_LEG_STRETCH = {
  id: 'double-leg-stretch',
  name: 'Double Leg Stretch',
  frameDuration: 350,
  keyframes: [
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: -60, tx: -5, ty: 5 }, leftForearm: { rotate: -65, tx: -3, ty: 3 },
      rightUpperArm: { rotate: 60, tx: 5, ty: 5 }, rightForearm: { rotate: 65, tx: 3, ty: 3 },
      leftThigh: { rotate: -100, tx: -8, ty: -10 }, leftShin: { rotate: 85, tx: 0, ty: 0 },
      rightThigh: { rotate: -100, tx: 8, ty: -10 }, rightShin: { rotate: 85, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: -20, tx: -5, ty: -5 }, leftForearm: { rotate: -15, tx: -3, ty: -3 },
      rightUpperArm: { rotate: 20, tx: 5, ty: -5 }, rightForearm: { rotate: 15, tx: 3, ty: -3 },
      leftThigh: { rotate: -40, tx: -6, ty: 12 }, leftShin: { rotate: 5, tx: 0, ty: 0 },
      rightThigh: { rotate: -40, tx: 6, ty: 12 }, rightShin: { rotate: 5, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: 50, tx: -5, ty: 3 }, leftForearm: { rotate: 55, tx: -3, ty: 2 },
      rightUpperArm: { rotate: -50, tx: 5, ty: 3 }, rightForearm: { rotate: -55, tx: 3, ty: 2 },
      leftThigh: { rotate: -80, tx: -8, ty: -5 }, leftShin: { rotate: 60, tx: 0, ty: 0 },
      rightThigh: { rotate: -80, tx: 8, ty: -5 }, rightShin: { rotate: 60, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 35, tx: 0, ty: -8 }, torso: { rotate: 15, tx: 0, ty: 10 },
      leftUpperArm: { rotate: -60, tx: -5, ty: 5 }, leftForearm: { rotate: -65, tx: -3, ty: 3 },
      rightUpperArm: { rotate: 60, tx: 5, ty: 5 }, rightForearm: { rotate: 65, tx: 3, ty: 3 },
      leftThigh: { rotate: -100, tx: -8, ty: -10 }, leftShin: { rotate: 85, tx: 0, ty: 0 },
      rightThigh: { rotate: -100, tx: 8, ty: -10 }, rightShin: { rotate: 85, tx: 0, ty: 0 },
    },
  ],
};

// ─── Spine Stretch Forward ───────────────────────────────────────────────────
const SPINE_STRETCH = {
  id: 'spine-stretch',
  name: 'Spine Stretch Forward',
  frameDuration: 400,
  keyframes: [
    {
      head: { rotate: 0, tx: 0, ty: 0 }, neck: { rotate: 0, tx: 0, ty: 0 },
      torso: { rotate: -90, tx: 0, ty: -10 },
      leftUpperArm: { rotate: -70, tx: -5, ty: 0 }, leftForearm: { rotate: -65, tx: -3, ty: 0 },
      rightUpperArm: { rotate: 70, tx: 5, ty: 0 }, rightForearm: { rotate: 65, tx: 3, ty: 0 },
      leftThigh: { rotate: 10, tx: -10, ty: 20 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -10, tx: 10, ty: 20 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 25, tx: 0, ty: -5 }, neck: { rotate: 20, tx: 0, ty: 0 },
      torso: { rotate: -115, tx: 0, ty: -5 },
      leftUpperArm: { rotate: -95, tx: -5, ty: 5 }, leftForearm: { rotate: -90, tx: -3, ty: 3 },
      rightUpperArm: { rotate: 95, tx: 5, ty: 5 }, rightForearm: { rotate: 90, tx: 3, ty: 3 },
      leftThigh: { rotate: 10, tx: -10, ty: 20 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -10, tx: 10, ty: 20 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 40, tx: 0, ty: -10 }, neck: { rotate: 35, tx: 0, ty: 0 },
      torso: { rotate: -130, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -115, tx: -5, ty: 8 }, leftForearm: { rotate: -110, tx: -3, ty: 5 },
      rightUpperArm: { rotate: 115, tx: 5, ty: 8 }, rightForearm: { rotate: 110, tx: 3, ty: 5 },
      leftThigh: { rotate: 10, tx: -10, ty: 20 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -10, tx: 10, ty: 20 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 0, tx: 0, ty: 0 }, neck: { rotate: 0, tx: 0, ty: 0 },
      torso: { rotate: -90, tx: 0, ty: -10 },
      leftUpperArm: { rotate: -70, tx: -5, ty: 0 }, leftForearm: { rotate: -65, tx: -3, ty: 0 },
      rightUpperArm: { rotate: 70, tx: 5, ty: 0 }, rightForearm: { rotate: 65, tx: 3, ty: 0 },
      leftThigh: { rotate: 10, tx: -10, ty: 20 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -10, tx: 10, ty: 20 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
  ],
};

// ─── Swan ────────────────────────────────────────────────────────────────────
const SWAN = {
  id: 'swan',
  name: 'Swan',
  frameDuration: 400,
  keyframes: [
    {
      head: { rotate: -20, tx: 0, ty: -5 }, neck: { rotate: -15, tx: 0, ty: 0 },
      torso: { rotate: 0, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -110, tx: -8, ty: 0 }, leftForearm: { rotate: -100, tx: -4, ty: 0 },
      rightUpperArm: { rotate: 110, tx: 8, ty: 0 }, rightForearm: { rotate: 100, tx: 4, ty: 0 },
      leftThigh: { rotate: -5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 5, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: -40, tx: 0, ty: -8 }, neck: { rotate: -35, tx: 0, ty: 0 },
      torso: { rotate: 20, tx: 0, ty: -8 },
      leftUpperArm: { rotate: -100, tx: -8, ty: 2 }, leftForearm: { rotate: -95, tx: -4, ty: 2 },
      rightUpperArm: { rotate: 100, tx: 8, ty: 2 }, rightForearm: { rotate: 95, tx: 4, ty: 2 },
      leftThigh: { rotate: -5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 5, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: -55, tx: 0, ty: -12 }, neck: { rotate: -50, tx: 0, ty: 0 },
      torso: { rotate: 40, tx: 0, ty: -15 },
      leftUpperArm: { rotate: -90, tx: -8, ty: 5 }, leftForearm: { rotate: -85, tx: -4, ty: 3 },
      rightUpperArm: { rotate: 90, tx: 8, ty: 5 }, rightForearm: { rotate: 85, tx: 4, ty: 3 },
      leftThigh: { rotate: -5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 5, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: -40, tx: 0, ty: -8 }, neck: { rotate: -35, tx: 0, ty: 0 },
      torso: { rotate: 20, tx: 0, ty: -8 },
      leftUpperArm: { rotate: -100, tx: -8, ty: 2 }, leftForearm: { rotate: -95, tx: -4, ty: 2 },
      rightUpperArm: { rotate: 100, tx: 8, ty: 2 }, rightForearm: { rotate: 95, tx: 4, ty: 2 },
      leftThigh: { rotate: -5, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 5, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
  ],
};

// ─── Side Kick ───────────────────────────────────────────────────────────────
const SIDE_KICK = {
  id: 'side-kick',
  name: 'Side Kick',
  frameDuration: 280,
  keyframes: [
    {
      head: { rotate: -90, tx: 5, ty: -5 }, torso: { rotate: -90, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -90, tx: -10, ty: 0 }, rightUpperArm: { rotate: 0, tx: 15, ty: 5 },
      leftThigh: { rotate: -85, tx: -5, ty: 0 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -85, tx: -5, ty: 0 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: -90, tx: 5, ty: -5 }, torso: { rotate: -90, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -90, tx: -10, ty: 0 }, rightUpperArm: { rotate: 0, tx: 15, ty: 5 },
      leftThigh: { rotate: -85, tx: -5, ty: 0 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -55, tx: 0, ty: -5 }, rightShin: { rotate: -10, tx: 0, ty: 0 },
    },
    {
      head: { rotate: -90, tx: 5, ty: -5 }, torso: { rotate: -90, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -90, tx: -10, ty: 0 }, rightUpperArm: { rotate: 0, tx: 15, ty: 5 },
      leftThigh: { rotate: -85, tx: -5, ty: 0 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -110, tx: -8, ty: 3 }, rightShin: { rotate: 10, tx: 0, ty: 0 },
    },
    {
      head: { rotate: -90, tx: 5, ty: -5 }, torso: { rotate: -90, tx: 0, ty: 0 },
      leftUpperArm: { rotate: -90, tx: -10, ty: 0 }, rightUpperArm: { rotate: 0, tx: 15, ty: 5 },
      leftThigh: { rotate: -85, tx: -5, ty: 0 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: -85, tx: -5, ty: 0 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
  ],
};

// ─── Teaser ──────────────────────────────────────────────────────────────────
const TEASER = {
  id: 'teaser',
  name: 'Teaser',
  frameDuration: 400,
  keyframes: [
    {
      head: { rotate: 0, tx: 0, ty: 0 }, torso: { rotate: 0, tx: 0, ty: 20 },
      leftUpperArm: { rotate: -20, tx: -5, ty: -5 }, leftForearm: { rotate: -15, tx: -3, ty: -3 },
      rightUpperArm: { rotate: 20, tx: 5, ty: -5 }, rightForearm: { rotate: 15, tx: 3, ty: -3 },
      leftThigh: { rotate: 0, tx: -5, ty: 15 }, leftShin: { rotate: 0, tx: 0, ty: 0 },
      rightThigh: { rotate: 0, tx: 5, ty: 15 }, rightShin: { rotate: 0, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 20, tx: 0, ty: -5 }, torso: { rotate: -45, tx: 0, ty: 5 },
      leftUpperArm: { rotate: -65, tx: -5, ty: 0 }, leftForearm: { rotate: -60, tx: -3, ty: 0 },
      rightUpperArm: { rotate: 65, tx: 5, ty: 0 }, rightForearm: { rotate: 60, tx: 3, ty: 0 },
      leftThigh: { rotate: -40, tx: -5, ty: 5 }, leftShin: { rotate: 5, tx: 0, ty: 0 },
      rightThigh: { rotate: -40, tx: 5, ty: 5 }, rightShin: { rotate: 5, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 25, tx: 0, ty: -8 }, torso: { rotate: -75, tx: 0, ty: -5 },
      leftUpperArm: { rotate: -90, tx: -5, ty: 5 }, leftForearm: { rotate: -85, tx: -3, ty: 3 },
      rightUpperArm: { rotate: 90, tx: 5, ty: 5 }, rightForearm: { rotate: 85, tx: 3, ty: 3 },
      leftThigh: { rotate: -75, tx: -5, ty: -8 }, leftShin: { rotate: 5, tx: 0, ty: 0 },
      rightThigh: { rotate: -75, tx: 5, ty: -8 }, rightShin: { rotate: 5, tx: 0, ty: 0 },
    },
    {
      head: { rotate: 20, tx: 0, ty: -5 }, torso: { rotate: -45, tx: 0, ty: 5 },
      leftUpperArm: { rotate: -65, tx: -5, ty: 0 }, leftForearm: { rotate: -60, tx: -3, ty: 0 },
      rightUpperArm: { rotate: 65, tx: 5, ty: 0 }, rightForearm: { rotate: 60, tx: 3, ty: 0 },
      leftThigh: { rotate: -40, tx: -5, ty: 5 }, leftShin: { rotate: 5, tx: 0, ty: 0 },
      rightThigh: { rotate: -40, tx: 5, ty: 5 }, rightShin: { rotate: 5, tx: 0, ty: 0 },
    },
  ],
};

module.exports = [
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
