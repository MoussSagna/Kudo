import { gridFrom, pieceById } from './notation';
import { createGame, INITIAL_STATS, type GameState } from './state';

/** The day shown on the mockups: Tuesday, October 6th, 2026. */
const MOCKUP_DAY_SEED = 20261006;

/** The game shown on the `docs/design/jeu.png` mockup, to compare the screen with it. */
export const SAMPLE_GAME: GameState = {
  mode: 'daily',
  seed: MOCKUP_DAY_SEED,
  grid: gridFrom([
    '........',
    '........',
    '..p.....',
    'r.pp.c.c',
    '....y..o',
    '..cg..rg',
    'yg..c..b',
    'g.bbbb.b',
  ]),
  tray: [pieceById('L_d'), pieceById('sq2'), pieceById('v3')],
  score: 1240,
  streak: 2,
  draws: 1,
  isOver: false,
  stats: { piecesPlaced: 27, linesCleared: 14, bestStreak: 3 },
};

/**
 * A game one move away from its end: only the dot fits. Placing it in the top-left corner clears
 * nothing and leaves no room for the two other pieces, which ends the game.
 */
export const NEAR_END_GAME: GameState = {
  mode: 'free',
  seed: 0,
  grid: gridFrom([
    '.r.rrrrr',
    'o.oooooo',
    'yy.y.yyy',
    'ggg.gggg',
    'cccc.c.c',
    'bbbbb.bb',
    '.ppppp.p',
    'rrrrrrr.',
  ]),
  tray: [pieceById('dot'), pieceById('sq2'), pieceById('h3')],
  score: 480,
  streak: 1,
  draws: 1,
  isOver: false,
  stats: { piecesPlaced: 37, linesCleared: 21, bestStreak: 4 },
};

/** The finished game shown on the `docs/design/resultat.png` mockup. */
export const FINISHED_GAME: GameState = {
  mode: 'daily',
  seed: MOCKUP_DAY_SEED,
  grid: gridFrom([
    'pp.g.rr.',
    'p.cg.r.y',
    '.bc.oo.y',
    'gb.yo.pp',
    'g.ry.cc.',
    '.or.gg.b',
    'yo.pp.cb',
    'y.bb.r.g',
  ]),
  tray: [pieceById('sq3'), pieceById('h5'), null],
  score: 1780,
  streak: 1,
  draws: 13,
  isOver: true,
  stats: { piecesPlaced: 38, linesCleared: 21, bestStreak: 4 },
};

export interface DemoMove {
  trayIndex: number;
  col: number;
  row: number;
}

/**
 * A scripted game for the animation demo. Played in order, `DEMO_MOVES` gives: a plain placement,
 * a cleared row, a row and a column cleared together, then a new tray.
 */
export const DEMO_GAME: GameState = {
  mode: 'free',
  seed: 1,
  grid: gridFrom([
    '...g....',
    '...g....',
    '...g....',
    '...g....',
    '...g....',
    '...g....',
    'bbb.bbbb',
    'rrrrrrr.',
  ]),
  tray: [pieceById('sq2'), pieceById('dot'), pieceById('v2')],
  score: 0,
  streak: 1,
  draws: 1,
  isOver: false,
  stats: INITIAL_STATS,
};

export const DEMO_MOVES: readonly DemoMove[] = [
  { trayIndex: 0, col: 0, row: 0 },
  { trayIndex: 1, col: 7, row: 7 },
  { trayIndex: 2, col: 3, row: 6 },
];

/** A new game whose tray holds the largest pieces, to check that they fit in their slots. */
export const BIG_PIECES_GAME: GameState = {
  ...createGame(2),
  tray: [pieceById('v5'), pieceById('h5'), pieceById('sq3')],
};

/** The same finished game, played as a free game. */
export const FINISHED_FREE_GAME: GameState = { ...FINISHED_GAME, mode: 'free', seed: 0 };
