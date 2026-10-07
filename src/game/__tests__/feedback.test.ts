import { moveFeedback } from '../feedback';
import { playMove, type MoveResult } from '../moves';
import { gridFrom, pieceById } from '../notation';
import { createGame, type GameState } from '../state';

const dot = pieceById('dot');

const TWO_ROWS_TO_FILL = [
  'rrrrrrr.',
  'bbbbbbb.',
  '........',
  '........',
  '........',
  '........',
  '........',
  '........',
];

function play(state: GameState, trayIndex: number, col: number, row: number): MoveResult {
  const result = playMove(state, trayIndex, col, row);
  if (!result) {
    throw new Error('Invalid move in test');
  }
  return result;
}

describe('moveFeedback', () => {
  const start: GameState = {
    ...createGame(7),
    grid: gridFrom(TWO_ROWS_TO_FILL),
    tray: [dot, dot, pieceById('v2')],
  };

  it('is a placement when nothing is cleared', () => {
    expect(moveFeedback(play(start, 0, 0, 5))).toBe('place');
  });

  it('is a clear for a single line outside a streak', () => {
    expect(moveFeedback(play(start, 0, 7, 0))).toBe('clear');
  });

  it('is a combo for two lines cleared by the same move', () => {
    expect(moveFeedback(play(start, 2, 7, 0))).toBe('combo');
  });

  it('is a combo for a single line cleared right after another clear', () => {
    const first = play(start, 0, 7, 0);

    expect(moveFeedback(play(first.next, 1, 7, 1))).toBe('combo');
  });

  it('is a plain clear again once the streak has been broken', () => {
    const first = play(start, 0, 7, 0);
    const quiet = play(first.next, 2, 0, 5);

    expect(moveFeedback(quiet)).toBe('place');
    expect(moveFeedback(play(quiet.next, 1, 7, 1))).toBe('clear');
  });
});
