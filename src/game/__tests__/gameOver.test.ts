import { applyMove, hasAnyMove } from '../moves';
import { gridFrom, pieceById } from '../notation';
import { createEmptyGrid, createGame, type GameState } from '../state';

const dot = pieceById('dot');
const h2 = pieceById('h2');
const v2 = pieceById('v2');
const sq2 = pieceById('sq2');
const sq3 = pieceById('sq3');

const CHECKERED_FULL = [
  'rbrbrbrb',
  'brbrbrbr',
  'rbrbrbrb',
  'brbrbrbr',
  'rbrbrbrb',
  'brbrbrbr',
  'rbrbrbrb',
  'brbrbrbr',
];

/** One free cell per row and per column, on the diagonal: no line is full, only a dot fits. */
const DIAGONAL_HOLES = [
  '.rrrrrrr',
  'r.rrrrrr',
  'rr.rrrrr',
  'rrr.rrrr',
  'rrrr.rrr',
  'rrrrr.rr',
  'rrrrrr.r',
  'rrrrrrr.',
];

describe('hasAnyMove', () => {
  it('is true on an empty grid', () => {
    expect(hasAnyMove(createEmptyGrid(), [sq3, null, null])).toBe(true);
  });

  it('is false on a full grid', () => {
    expect(hasAnyMove(gridFrom(CHECKERED_FULL), [dot, h2, sq2])).toBe(false);
  });

  it('is false when the tray has no piece left', () => {
    expect(hasAnyMove(createEmptyGrid(), [null, null, null])).toBe(false);
  });

  it('is true when a single cell is free and the tray holds a dot', () => {
    const grid = gridFrom([...CHECKERED_FULL.slice(0, 7), 'brbrbrb.']);

    expect(hasAnyMove(grid, [sq2, dot, null])).toBe(true);
  });

  it('is false when a single cell is free and no piece is that small', () => {
    const grid = gridFrom([...CHECKERED_FULL.slice(0, 7), 'brbrbrb.']);

    expect(hasAnyMove(grid, [sq2, h2, v2])).toBe(false);
  });

  it('is true when only one position fits one of the pieces', () => {
    const grid = gridFrom([...CHECKERED_FULL.slice(0, 6), 'rbrbrbr.', 'brbrbrb.']);

    expect(hasAnyMove(grid, [h2, sq2, v2])).toBe(true);
    expect(hasAnyMove(grid, [h2, sq2, null])).toBe(false);
  });

  it('ignores the empty slots of the tray', () => {
    expect(hasAnyMove(createEmptyGrid(), [null, null, dot])).toBe(true);
  });
});

describe('applyMove — end of game', () => {
  function gameWith(overrides: Partial<GameState>): GameState {
    return { ...createGame(7), ...overrides };
  }

  it('keeps the game going while a remaining piece fits', () => {
    const next = applyMove(gameWith({ tray: [dot, sq2, null] }), 0, 0, 0);

    expect(next.isOver).toBe(false);
  });

  it('ends the game when no remaining piece fits', () => {
    const state = gameWith({
      grid: gridFrom(['..rrrrrr', ...DIAGONAL_HOLES.slice(1)]),
      tray: [dot, sq2, null],
    });

    const next = applyMove(state, 0, 1, 0);

    expect(next.grid).toEqual(gridFrom(['.yrrrrrr', ...DIAGONAL_HOLES.slice(1)]));
    expect(next.isOver).toBe(true);
  });

  it('checks the new tray when the move empties the tray', () => {
    const state = gameWith({ tray: [null, dot, null] });

    const next = applyMove(state, 1, 0, 0);

    expect(next.tray.every((piece) => piece !== null)).toBe(true);
    expect(next.isOver).toBe(false);
  });

  it('decides on the grid left after the lines are cleared', () => {
    const state = gameWith({ grid: gridFrom(DIAGONAL_HOLES), tray: [dot, sq2, null] });

    const next = applyMove(state, 0, 0, 0);

    expect(next.grid[0].every((cell) => cell === null)).toBe(true);
    expect(next.grid.every((row) => row[0] === null)).toBe(true);
    expect(next.isOver).toBe(false);
  });

  it('refuses any move once the game is over', () => {
    const over = gameWith({ tray: [dot, null, null], isOver: true });

    expect(applyMove(over, 0, 0, 0)).toBe(over);
  });
});
