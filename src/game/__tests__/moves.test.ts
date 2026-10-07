import { applyMove, clearPoints, playMove } from '../moves';
import { gridFrom, pieceById } from '../notation';
import { createGame, drawTray, type GameState } from '../state';

const dot = pieceById('dot');
const h3 = pieceById('h3');
const v3 = pieceById('v3');
const sq2 = pieceById('sq2');

function gameWith(overrides: Partial<GameState>): GameState {
  return { ...createGame(7), ...overrides };
}

describe('clearPoints', () => {
  it('follows 10 × n × n', () => {
    expect(clearPoints(1, 1)).toBe(10);
    expect(clearPoints(2, 1)).toBe(40);
    expect(clearPoints(3, 1)).toBe(90);
  });

  it('is multiplied by the streak level', () => {
    expect(clearPoints(1, 2)).toBe(20);
    expect(clearPoints(2, 3)).toBe(120);
  });
});

describe('applyMove', () => {
  it('places the piece and scores one point per cell', () => {
    const next = applyMove(gameWith({ tray: [h3, sq2, dot] }), 0, 2, 4);

    expect(next.grid[4].slice(2, 5)).toEqual(['green', 'green', 'green']);
    expect(next.score).toBe(3);
    expect(next.streak).toBe(1);
  });

  it('empties the slot of the piece that was played', () => {
    const next = applyMove(gameWith({ tray: [h3, sq2, dot] }), 1, 0, 0);

    expect(next.tray).toEqual([h3, null, dot]);
    expect(next.draws).toBe(1);
  });

  it('scores 10 for one cleared line, on top of the placement', () => {
    const state = gameWith({
      grid: gridFrom([
        'rrrrrrr.',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]),
      tray: [dot, h3, sq2],
    });

    const next = applyMove(state, 0, 7, 0);

    expect(next.score).toBe(1 + 10);
    expect(next.grid[0].every((cell) => cell === null)).toBe(true);
  });

  it('scores 40 for a row and a column cleared by the same move', () => {
    const state = gameWith({
      grid: gridFrom([
        '...g....',
        '...g....',
        'rrr.rrrr',
        '...g....',
        '...g....',
        '...g....',
        '...g....',
        '...g....',
      ]),
      tray: [dot, h3, sq2],
    });

    const next = applyMove(state, 0, 3, 2);

    expect(next.score).toBe(1 + 40);
  });

  it('scores 90 for three lines cleared by the same move', () => {
    const state = gameWith({
      grid: gridFrom([
        'rrrrrrr.',
        'rrrrrrr.',
        'rrrrrrr.',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]),
      tray: [v3, h3, sq2],
    });

    const next = applyMove(state, 0, 7, 0);

    expect(next.score).toBe(3 + 90);
  });

  it('multiplies the clear by 2, then 3, on consecutive clearing moves', () => {
    const state = gameWith({
      grid: gridFrom([
        'rrrrrrr.',
        'bbbbbbb.',
        'ggggggg.',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]),
      tray: [dot, dot, dot],
    });

    const first = applyMove(state, 0, 7, 0);
    expect(first.score).toBe(1 + 10);
    expect(first.streak).toBe(2);

    const second = applyMove(first, 1, 7, 1);
    expect(second.score).toBe(11 + 1 + 10 * 2);
    expect(second.streak).toBe(3);

    const third = applyMove(second, 2, 7, 2);
    expect(third.score).toBe(32 + 1 + 10 * 3);
    expect(third.streak).toBe(4);
  });

  it('resets the streak to 1 after a move that clears nothing', () => {
    const state = gameWith({
      grid: gridFrom([
        'rrrrrrr.',
        'bbbbbbb.',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]),
      tray: [dot, dot, dot],
    });

    const cleared = applyMove(state, 0, 7, 0);
    expect(cleared.streak).toBe(2);

    const quiet = applyMove(cleared, 1, 0, 5);
    expect(quiet.score).toBe(11 + 1);
    expect(quiet.streak).toBe(1);

    const clearedAgain = applyMove(quiet, 2, 7, 1);
    expect(clearedAgain.score).toBe(12 + 1 + 10);
    expect(clearedAgain.streak).toBe(2);
  });

  it('draws the next tray once the three pieces are placed', () => {
    const start = createGame(20261006);
    const state = { ...start, tray: [dot, dot, dot] };

    const afterTwo = applyMove(applyMove(state, 0, 0, 0), 1, 2, 0);
    expect(afterTwo.tray).toEqual([null, null, dot]);
    expect(afterTwo.draws).toBe(1);

    const afterThree = applyMove(afterTwo, 2, 4, 0);
    expect(afterThree.tray).toEqual(drawTray(20261006, 1));
    expect(afterThree.draws).toBe(2);
  });

  it('returns the same state for a move outside the grid', () => {
    const state = gameWith({ tray: [h3, sq2, dot] });

    expect(applyMove(state, 0, 6, 0)).toBe(state);
  });

  it('returns the same state for a move on an occupied cell', () => {
    const state = applyMove(gameWith({ tray: [h3, sq2, dot] }), 0, 0, 0);

    expect(applyMove(state, 1, 1, 0)).toBe(state);
  });

  it('returns the same state for an empty or unknown tray slot', () => {
    const state = applyMove(gameWith({ tray: [h3, sq2, dot] }), 0, 0, 0);

    expect(applyMove(state, 0, 0, 4)).toBe(state);
    expect(applyMove(state, 3, 0, 4)).toBe(state);
  });

  it('does not mutate the state it receives', () => {
    const state = gameWith({ tray: [h3, sq2, dot] });
    const snapshot = JSON.stringify(state);

    applyMove(state, 0, 0, 0);

    expect(JSON.stringify(state)).toBe(snapshot);
  });
});

describe('playMove', () => {
  it('returns null for an invalid move', () => {
    const state = gameWith({ tray: [h3, sq2, dot] });

    expect(playMove(state, 0, 6, 0)).toBeNull();
    expect(playMove(state, 3, 0, 0)).toBeNull();
    expect(playMove({ ...state, isOver: true }, 0, 0, 0)).toBeNull();
  });

  it('describes a move that clears nothing', () => {
    const state = gameWith({ tray: [h3, sq2, dot] });

    const result = playMove(state, 0, 2, 4);

    expect(result).toMatchObject({
      piece: h3,
      col: 2,
      row: 4,
      clearedRows: [],
      clearedCols: [],
      placementPoints: 3,
      clearPoints: 0,
    });
    expect(result?.placedGrid).toEqual(result?.next.grid);
    expect(result?.next).toEqual(applyMove(state, 0, 2, 4));
  });

  it('tells which row and column were cleared, with the grid before the clear', () => {
    const state = gameWith({
      grid: gridFrom([
        '...g....',
        '...g....',
        'rrr.rrrr',
        '...g....',
        '...g....',
        '...g....',
        '...g....',
        '...g....',
      ]),
      tray: [dot, h3, sq2],
      streak: 2,
    });

    const result = playMove(state, 0, 3, 2);

    expect(result?.clearedRows).toEqual([2]);
    expect(result?.clearedCols).toEqual([3]);
    expect(result?.placementPoints).toBe(1);
    expect(result?.clearPoints).toBe(80);
    expect(result?.placedGrid[2]).toEqual(gridFrom(['rrryrrrr'])[0]);
    expect(result?.next.grid[2].every((cell) => cell === null)).toBe(true);
    expect(result?.next.score).toBe(state.score + 81);
  });
});
