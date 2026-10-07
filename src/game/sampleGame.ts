import { applyMove } from './moves';
import { gridFrom, pieceById } from './notation';
import { createGame, type GameState } from './state';

/** The game shown on the `docs/design/jeu.png` mockup, to compare the screen with it. */
export const SAMPLE_GAME: GameState = {
  seed: 0,
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
};

/**
 * A game one move away from its end: only the dot fits. Placing it in the top-left corner clears
 * nothing and leaves no room for the two other pieces, which ends the game.
 */
export const NEAR_END_GAME: GameState = {
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
};

/** The same game once the dot is placed in the top-left corner: it is over. */
export const FINISHED_GAME: GameState = applyMove(NEAR_END_GAME, 0, 0, 0);

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
