export const Colors = {
  // Primary palette — warm cream & sage
  cream: '#F7F3EE',
  creamDark: '#EDE8E0',
  creamDeep: '#E0D8CC',
  sage: '#7A9E7E',
  sageDark: '#5C7F61',
  sageLight: '#A8C5AC',
  sagePale: '#D4E8D6',

  // Accents
  terracotta: '#C97B5A',
  dustyRose: '#D4A5A5',
  lavender: '#B8A9C9',
  gold: '#C9A96E',

  // Neutrals
  text: '#3D3530',
  textLight: '#7A6E68',
  textMuted: '#A89E97',
  white: '#FFFFFF',
  border: '#E0D8CC',
  borderLight: '#EDE8E0',
  shadow: 'rgba(61, 53, 48, 0.08)',

  // Level colors
  beginner: '#7A9E7E',
  intermediate: '#C9A96E',
  advanced: '#C97B5A',

  // Body area colors
  core: '#B8A9C9',
  back: '#A8C5AC',
  legs: '#D4A5A5',
  fullBody: '#C9A96E',

  // Timer
  timerRing: '#7A9E7E',
  timerRingRest: '#D4A5A5',
  timerBackground: '#F7F3EE',
} as const;

export const levelColor = (level: string): string => {
  switch (level) {
    case 'Beginner': return Colors.beginner;
    case 'Intermediate': return Colors.intermediate;
    case 'Advanced': return Colors.advanced;
    default: return Colors.sage;
  }
};

export const areaColor = (area: string): string => {
  switch (area) {
    case 'Core': return Colors.core;
    case 'Back': return Colors.back;
    case 'Legs': return Colors.legs;
    case 'Full Body': return Colors.fullBody;
    default: return Colors.sage;
  }
};

// ── Turkish display labels ─────────────────────────────────────
export const levelLabel = (level: string): string => {
  switch (level) {
    case 'Beginner':     return 'Başlangıç';
    case 'Intermediate': return 'Orta';
    case 'Advanced':     return 'İleri';
    default: return level;
  }
};

export const areaLabel = (area: string): string => {
  switch (area) {
    case 'Core':      return 'Merkez';
    case 'Back':      return 'Sırt';
    case 'Legs':      return 'Bacaklar';
    case 'Full Body': return 'Tüm Vücut';
    default: return area;
  }
};
