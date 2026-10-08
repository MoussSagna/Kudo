export const BLOCK_COLORS = {
  red: '#FF5A5F',
  orange: '#FF9F1C',
  yellow: '#FFD23F',
  green: '#3DDC97',
  cyan: '#2EC4F1',
  blue: '#4D7CFE',
  purple: '#A06CFF',
} as const;

export type BlockColor = keyof typeof BLOCK_COLORS;

export const UI = {
  background: '#12162B',
  backgroundTop: '#1E2550',
  cell: '#252C52',
  cellEdge: '#2F3868',
  panel: '#191F42',
  tray: '#1C2346',
  text: '#FFFFFF',
  textMuted: '#8F97C4',
  textSoft: '#A9B0DA',
  accent: '#FFD23F',
  accentEdge: '#C29708',
  dotInactive: '#4B5586',
} as const;

export const FONTS = {
  title: 'Fredoka_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

/**
 * How far the text size chosen in the system settings may enlarge a text. Texts drawn to fit a
 * fixed place (score, countdown, grid, illustrations) keep their size; titles and labels grow a
 * little; running texts grow more, and more still on a screen that scrolls.
 */
export const TEXT_SCALE = {
  fixed: 1,
  title: 1.15,
  body: 1.35,
  scrolling: 1.8,
} as const;

export const GRID_SIZE = 8;

// Metro choisit automatiquement les variantes @2x / @3x.
export const BLOCK_IMAGES: Record<BlockColor, number> = {
  red: require('../assets/images/blocks/block_red.png'),
  orange: require('../assets/images/blocks/block_orange.png'),
  yellow: require('../assets/images/blocks/block_yellow.png'),
  green: require('../assets/images/blocks/block_green.png'),
  cyan: require('../assets/images/blocks/block_cyan.png'),
  blue: require('../assets/images/blocks/block_blue.png'),
  purple: require('../assets/images/blocks/block_purple.png'),
};

export const CELL_EMPTY_IMAGE: number = require('../assets/images/blocks/cell_empty.png');

export const SOUNDS = {
  pick: require('../assets/sounds/pick.wav'),
  place: require('../assets/sounds/place.wav'),
  invalid: require('../assets/sounds/invalid.wav'),
  clear: require('../assets/sounds/clear.wav'),
  combo: require('../assets/sounds/combo.wav'),
  gameover: require('../assets/sounds/gameover.wav'),
  highscore: require('../assets/sounds/highscore.wav'),
} as const;

// Emojis pour la grille de partage du score.
export const SHARE_EMOJI: Record<BlockColor | 'empty', string> = {
  red: '🟥', orange: '🟧', yellow: '🟨', green: '🟩',
  cyan: '🟦', blue: '🟦', purple: '🟪', empty: '⬛',
};
