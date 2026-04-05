/**
 * Static require map for exercise audio files.
 * Naming convention: [exercise-id]_intro.mp3 | [exercise-id]_step[n].mp3 | [exercise-id]_full.mp3
 */

export type ExerciseAudio = {
  intro: any;
  full: any;
  steps: any[];
};

const AUDIO_ASSETS: Record<string, ExerciseAudio> = {
  'the-hundred': {
    intro: require('../../assets/audio/the-hundred_intro.mp3'),
    full:  require('../../assets/audio/the-hundred_full.mp3'),
    steps: [
      require('../../assets/audio/the-hundred_step1.mp3'),
      require('../../assets/audio/the-hundred_step2.mp3'),
      require('../../assets/audio/the-hundred_step3.mp3'),
      require('../../assets/audio/the-hundred_step4.mp3'),
      require('../../assets/audio/the-hundred_step5.mp3'),
      require('../../assets/audio/the-hundred_step6.mp3'),
    ],
  },
  'roll-up': {
    intro: require('../../assets/audio/roll-up_intro.mp3'),
    full:  require('../../assets/audio/roll-up_full.mp3'),
    steps: [
      require('../../assets/audio/roll-up_step1.mp3'),
      require('../../assets/audio/roll-up_step2.mp3'),
      require('../../assets/audio/roll-up_step3.mp3'),
      require('../../assets/audio/roll-up_step4.mp3'),
      require('../../assets/audio/roll-up_step5.mp3'),
    ],
  },
  'single-leg-stretch': {
    intro: require('../../assets/audio/single-leg-stretch_intro.mp3'),
    full:  require('../../assets/audio/single-leg-stretch_full.mp3'),
    steps: [
      require('../../assets/audio/single-leg-stretch_step1.mp3'),
      require('../../assets/audio/single-leg-stretch_step2.mp3'),
      require('../../assets/audio/single-leg-stretch_step3.mp3'),
      require('../../assets/audio/single-leg-stretch_step4.mp3'),
      require('../../assets/audio/single-leg-stretch_step5.mp3'),
    ],
  },
  'double-leg-stretch': {
    intro: require('../../assets/audio/double-leg-stretch_intro.mp3'),
    full:  require('../../assets/audio/double-leg-stretch_full.mp3'),
    steps: [
      require('../../assets/audio/double-leg-stretch_step1.mp3'),
      require('../../assets/audio/double-leg-stretch_step2.mp3'),
      require('../../assets/audio/double-leg-stretch_step3.mp3'),
      require('../../assets/audio/double-leg-stretch_step4.mp3'),
    ],
  },
  'criss-cross': {
    intro: require('../../assets/audio/criss-cross_intro.mp3'),
    full:  require('../../assets/audio/criss-cross_full.mp3'),
    steps: [
      require('../../assets/audio/criss-cross_step1.mp3'),
      require('../../assets/audio/criss-cross_step2.mp3'),
      require('../../assets/audio/criss-cross_step3.mp3'),
      require('../../assets/audio/criss-cross_step4.mp3'),
      require('../../assets/audio/criss-cross_step5.mp3'),
    ],
  },
  'leg-circles': {
    intro: require('../../assets/audio/leg-circles_intro.mp3'),
    full:  require('../../assets/audio/leg-circles_full.mp3'),
    steps: [
      require('../../assets/audio/leg-circles_step1.mp3'),
      require('../../assets/audio/leg-circles_step2.mp3'),
      require('../../assets/audio/leg-circles_step3.mp3'),
      require('../../assets/audio/leg-circles_step4.mp3'),
      require('../../assets/audio/leg-circles_step5.mp3'),
    ],
  },
  'swan': {
    intro: require('../../assets/audio/swan_intro.mp3'),
    full:  require('../../assets/audio/swan_full.mp3'),
    steps: [
      require('../../assets/audio/swan_step1.mp3'),
      require('../../assets/audio/swan_step2.mp3'),
      require('../../assets/audio/swan_step3.mp3'),
      require('../../assets/audio/swan_step4.mp3'),
      require('../../assets/audio/swan_step5.mp3'),
    ],
  },
  'swimming': {
    intro: require('../../assets/audio/swimming_intro.mp3'),
    full:  require('../../assets/audio/swimming_full.mp3'),
    steps: [
      require('../../assets/audio/swimming_step1.mp3'),
      require('../../assets/audio/swimming_step2.mp3'),
      require('../../assets/audio/swimming_step3.mp3'),
      require('../../assets/audio/swimming_step4.mp3'),
      require('../../assets/audio/swimming_step5.mp3'),
    ],
  },
  'cat-cow': {
    intro: require('../../assets/audio/cat-cow_intro.mp3'),
    full:  require('../../assets/audio/cat-cow_full.mp3'),
    steps: [
      require('../../assets/audio/cat-cow_step1.mp3'),
      require('../../assets/audio/cat-cow_step2.mp3'),
      require('../../assets/audio/cat-cow_step3.mp3'),
      require('../../assets/audio/cat-cow_step4.mp3'),
    ],
  },
  'spine-stretch': {
    intro: require('../../assets/audio/spine-stretch_intro.mp3'),
    full:  require('../../assets/audio/spine-stretch_full.mp3'),
    steps: [
      require('../../assets/audio/spine-stretch_step1.mp3'),
      require('../../assets/audio/spine-stretch_step2.mp3'),
      require('../../assets/audio/spine-stretch_step3.mp3'),
      require('../../assets/audio/spine-stretch_step4.mp3'),
    ],
  },
  'bridge': {
    intro: require('../../assets/audio/bridge_intro.mp3'),
    full:  require('../../assets/audio/bridge_full.mp3'),
    steps: [
      require('../../assets/audio/bridge_step1.mp3'),
      require('../../assets/audio/bridge_step2.mp3'),
      require('../../assets/audio/bridge_step3.mp3'),
      require('../../assets/audio/bridge_step4.mp3'),
      require('../../assets/audio/bridge_step5.mp3'),
    ],
  },
  'side-leg-lift': {
    intro: require('../../assets/audio/side-leg-lift_intro.mp3'),
    full:  require('../../assets/audio/side-leg-lift_full.mp3'),
    steps: [
      require('../../assets/audio/side-leg-lift_step1.mp3'),
      require('../../assets/audio/side-leg-lift_step2.mp3'),
      require('../../assets/audio/side-leg-lift_step3.mp3'),
      require('../../assets/audio/side-leg-lift_step4.mp3'),
      require('../../assets/audio/side-leg-lift_step5.mp3'),
    ],
  },
  'inner-thigh-lift': {
    intro: require('../../assets/audio/inner-thigh-lift_intro.mp3'),
    full:  require('../../assets/audio/inner-thigh-lift_full.mp3'),
    steps: [
      require('../../assets/audio/inner-thigh-lift_step1.mp3'),
      require('../../assets/audio/inner-thigh-lift_step2.mp3'),
      require('../../assets/audio/inner-thigh-lift_step3.mp3'),
      require('../../assets/audio/inner-thigh-lift_step4.mp3'),
      require('../../assets/audio/inner-thigh-lift_step5.mp3'),
    ],
  },
  'side-kick': {
    intro: require('../../assets/audio/side-kick_intro.mp3'),
    full:  require('../../assets/audio/side-kick_full.mp3'),
    steps: [
      require('../../assets/audio/side-kick_step1.mp3'),
      require('../../assets/audio/side-kick_step2.mp3'),
      require('../../assets/audio/side-kick_step3.mp3'),
      require('../../assets/audio/side-kick_step4.mp3'),
      require('../../assets/audio/side-kick_step5.mp3'),
    ],
  },
  'pilates-squat': {
    intro: require('../../assets/audio/pilates-squat_intro.mp3'),
    full:  require('../../assets/audio/pilates-squat_full.mp3'),
    steps: [
      require('../../assets/audio/pilates-squat_step1.mp3'),
      require('../../assets/audio/pilates-squat_step2.mp3'),
      require('../../assets/audio/pilates-squat_step3.mp3'),
      require('../../assets/audio/pilates-squat_step4.mp3'),
      require('../../assets/audio/pilates-squat_step5.mp3'),
    ],
  },
  'scissors': {
    intro: require('../../assets/audio/scissors_intro.mp3'),
    full:  require('../../assets/audio/scissors_full.mp3'),
    steps: [
      require('../../assets/audio/scissors_step1.mp3'),
      require('../../assets/audio/scissors_step2.mp3'),
      require('../../assets/audio/scissors_step3.mp3'),
      require('../../assets/audio/scissors_step4.mp3'),
      require('../../assets/audio/scissors_step5.mp3'),
    ],
  },
  'rolling-like-a-ball': {
    intro: require('../../assets/audio/rolling-like-a-ball_intro.mp3'),
    full:  require('../../assets/audio/rolling-like-a-ball_full.mp3'),
    steps: [
      require('../../assets/audio/rolling-like-a-ball_step1.mp3'),
      require('../../assets/audio/rolling-like-a-ball_step2.mp3'),
      require('../../assets/audio/rolling-like-a-ball_step3.mp3'),
      require('../../assets/audio/rolling-like-a-ball_step4.mp3'),
      require('../../assets/audio/rolling-like-a-ball_step5.mp3'),
    ],
  },
  'teaser': {
    intro: require('../../assets/audio/teaser_intro.mp3'),
    full:  require('../../assets/audio/teaser_full.mp3'),
    steps: [
      require('../../assets/audio/teaser_step1.mp3'),
      require('../../assets/audio/teaser_step2.mp3'),
      require('../../assets/audio/teaser_step3.mp3'),
      require('../../assets/audio/teaser_step4.mp3'),
      require('../../assets/audio/teaser_step5.mp3'),
    ],
  },
  'plank': {
    intro: require('../../assets/audio/plank_intro.mp3'),
    full:  require('../../assets/audio/plank_full.mp3'),
    steps: [
      require('../../assets/audio/plank_step1.mp3'),
      require('../../assets/audio/plank_step2.mp3'),
      require('../../assets/audio/plank_step3.mp3'),
      require('../../assets/audio/plank_step4.mp3'),
      require('../../assets/audio/plank_step5.mp3'),
    ],
  },
  'saw': {
    intro: require('../../assets/audio/saw_intro.mp3'),
    full:  require('../../assets/audio/saw_full.mp3'),
    steps: [
      require('../../assets/audio/saw_step1.mp3'),
      require('../../assets/audio/saw_step2.mp3'),
      require('../../assets/audio/saw_step3.mp3'),
      require('../../assets/audio/saw_step4.mp3'),
      require('../../assets/audio/saw_step5.mp3'),
    ],
  },
  'spine-twist': {
    intro: require('../../assets/audio/spine-twist_intro.mp3'),
    full:  require('../../assets/audio/spine-twist_full.mp3'),
    steps: [
      require('../../assets/audio/spine-twist_step1.mp3'),
      require('../../assets/audio/spine-twist_step2.mp3'),
      require('../../assets/audio/spine-twist_step3.mp3'),
      require('../../assets/audio/spine-twist_step4.mp3'),
      require('../../assets/audio/spine-twist_step5.mp3'),
    ],
  },
  'mermaid': {
    intro: require('../../assets/audio/mermaid_intro.mp3'),
    full:  require('../../assets/audio/mermaid_full.mp3'),
    steps: [
      require('../../assets/audio/mermaid_step1.mp3'),
      require('../../assets/audio/mermaid_step2.mp3'),
      require('../../assets/audio/mermaid_step3.mp3'),
      require('../../assets/audio/mermaid_step4.mp3'),
      require('../../assets/audio/mermaid_step5.mp3'),
    ],
  },
  'pilates-pushup': {
    intro: require('../../assets/audio/pilates-pushup_intro.mp3'),
    full:  require('../../assets/audio/pilates-pushup_full.mp3'),
    steps: [
      require('../../assets/audio/pilates-pushup_step1.mp3'),
      require('../../assets/audio/pilates-pushup_step2.mp3'),
      require('../../assets/audio/pilates-pushup_step3.mp3'),
      require('../../assets/audio/pilates-pushup_step4.mp3'),
      require('../../assets/audio/pilates-pushup_step5.mp3'),
    ],
  },
};

export default AUDIO_ASSETS;
