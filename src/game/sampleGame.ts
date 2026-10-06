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
