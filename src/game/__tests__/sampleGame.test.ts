import { clearLines } from '../lines';
import { applyMove, hasAnyMove, playMove, type MoveResult } from '../moves';
import {
  DEMO_GAME,
  DEMO_MOVES,
  FINISHED_GAME,
  NEAR_END_GAME,
  SAMPLE_GAME,
} from '../sampleGame';

describe('SAMPLE_GAME', () => {
  it('is a playable 8 × 8 game with no line left to clear', () => {
    expect(SAMPLE_GAME.grid).toHaveLength(8);
    expect(SAMPLE_GAME.grid.every((row) => row.length === 8)).toBe(true);
    expect(clearLines(SAMPLE_GAME.grid).cleared).toBe(0);
    expect(hasAnyMove(SAMPLE_GAME.grid, SAMPLE_GAME.tray)).toBe(true);
  });
});

describe('NEAR_END_GAME', () => {
  it('is still playable and has no line left to clear', () => {
    expect(clearLines(NEAR_END_GAME.grid).cleared).toBe(0);
    expect(hasAnyMove(NEAR_END_GAME.grid, NEAR_END_GAME.tray)).toBe(true);
  });

  it('ends when the dot is placed in the top-left corner', () => {
    const next = applyMove(NEAR_END_GAME, 0, 0, 0);

    expect(next.score).toBe(481);
    expect(next.isOver).toBe(true);
  });
});

describe('FINISHED_GAME', () => {
  it('is over, with no line left to clear and no room for its remaining pieces', () => {
    expect(FINISHED_GAME.isOver).toBe(true);
    expect(clearLines(FINISHED_GAME.grid).cleared).toBe(0);
    expect(hasAnyMove(FINISHED_GAME.grid, FINISHED_GAME.tray)).toBe(false);
  });
});

describe('DEMO_GAME', () => {
  it('plays a plain placement, a row, then a row and a column, and draws a new tray', () => {
    const [first, second, third] = DEMO_MOVES.reduce<(MoveResult | null)[]>((results, move) => {
      const previous = results.at(-1);
      const state = previous ? previous.next : DEMO_GAME;
      return [...results, playMove(state, move.trayIndex, move.col, move.row)];
    }, []);

    expect(first).toMatchObject({ clearedRows: [], clearedCols: [], clearPoints: 0 });
    expect(second).toMatchObject({ clearedRows: [7], clearedCols: [], clearPoints: 10 });
    expect(third).toMatchObject({ clearedRows: [6], clearedCols: [3], clearPoints: 80 });
    expect(third?.next.score).toBe(97);
    expect(third?.next.draws).toBe(2);
    expect(third?.next.tray.every((piece) => piece !== null)).toBe(true);
    expect(third?.next.isOver).toBe(false);
  });
});
