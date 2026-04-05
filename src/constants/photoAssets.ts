/**
 * Exercise step photo map.
 * B-kodu eşlemesi (pilates_image_prompts.md):
 * B01=bridge · B02=the-hundred · B03=roll-up · B04=rolling-like-a-ball
 * B05=single-leg-stretch · B06=double-leg-stretch · B07=spine-stretch
 * B08=cat-cow · B10=side-leg-lift · B15=leg-circles
 * (B09/B11-B14 uygulamadaki egzersizlerle eşleşmiyor)
 */

export type ExercisePhotos = { steps: any[] };

const PHOTO_ASSETS: Record<string, ExercisePhotos> = {
  'bridge': {
    steps: [
      require('../assets/pilatespic/B01_step1.png'),
      require('../assets/pilatespic/B01_step2.png'),
      require('../assets/pilatespic/B01_step3.png'),
    ],
  },
  'the-hundred': {
    steps: [
      require('../assets/pilatespic/B02_step1.png'),
      require('../assets/pilatespic/B02_step2.png'),
      require('../assets/pilatespic/B02_step3.png'),
    ],
  },
  'roll-up': {
    steps: [
      require('../assets/pilatespic/B03_step1.png'),
      require('../assets/pilatespic/B03_step2.png'),
      require('../assets/pilatespic/B03_step3.png'),
    ],
  },
  'rolling-like-a-ball': {
    steps: [
      require('../assets/pilatespic/B04_step1.png'),
      require('../assets/pilatespic/B04_step2.png'),
      require('../assets/pilatespic/B04_step3.png'),
    ],
  },
  'single-leg-stretch': {
    steps: [
      require('../assets/pilatespic/B05_step1.png'),
      require('../assets/pilatespic/B05_step2.png'),
    ],
  },
  'double-leg-stretch': {
    steps: [
      require('../assets/pilatespic/B06_step1.png'),
      require('../assets/pilatespic/B06_step2.png'),
      require('../assets/pilatespic/B06_step3.png'),
    ],
  },
  'spine-stretch': {
    steps: [
      require('../assets/pilatespic/B07_step1.png'),
      require('../assets/pilatespic/B07_step2.png'),
      require('../assets/pilatespic/B07_step3.png'),
    ],
  },
  'cat-cow': {
    steps: [
      require('../assets/pilatespic/B08_step1.png'),
      require('../assets/pilatespic/B08_step2.png'),
      require('../assets/pilatespic/B08_step3.png'),
    ],
  },
  'side-leg-lift': {
    steps: [
      require('../assets/pilatespic/B10_step1.png'),
      require('../assets/pilatespic/B10_step2.png'),
      require('../assets/pilatespic/B10_step3.png'),
    ],
  },
  'leg-circles': {
    steps: [
      require('../assets/pilatespic/B15_step1.png'),
      require('../assets/pilatespic/B15_step2.png'),
      require('../assets/pilatespic/B15_step3.png'),
    ],
  },
};

export default PHOTO_ASSETS;
