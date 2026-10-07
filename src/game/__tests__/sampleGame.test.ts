import { clearLines } from '../lines';
import { applyMove, hasAnyMove } from '../moves';
import { FINISHED_GAME, NEAR_END_GAME, SAMPLE_GAME } from '../sampleGame';

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
  it('is over', () => {
    expect(FINISHED_GAME.isOver).toBe(true);
    expect(FINISHED_GAME.score).toBe(481);
  });
});
