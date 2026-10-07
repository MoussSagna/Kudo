import { applyMove } from './moves';
import { gridFrom, pieceById } from './notation';
import type { GameState } from './state';

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
