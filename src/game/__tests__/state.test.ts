import { createRng, nextPieces } from '../pieces';
import { createEmptyGrid, createGame, drawTray, TRAY_SIZE } from '../state';

describe('createEmptyGrid', () => {
  it('returns an 8 × 8 grid of empty cells', () => {
    const grid = createEmptyGrid();

    expect(grid).toHaveLength(8);
    for (const row of grid) {
      expect(row).toEqual([null, null, null, null, null, null, null, null]);
    }
  });

  it('returns independent rows', () => {
    const grid = createEmptyGrid();

    expect(grid[0]).not.toBe(grid[1]);
  });
});

describe('drawTray', () => {
  it('draws the first tray like nextPieces(createRng(seed))', () => {
    expect(drawTray(20261006, 0)).toEqual(nextPieces(createRng(20261006)));
  });

  it('draws the following trays from the same sequence', () => {
    const rng = createRng(20261006);
    nextPieces(rng);
    const second = nextPieces(rng);
    const third = nextPieces(rng);

    expect(drawTray(20261006, 1)).toEqual(second);
    expect(drawTray(20261006, 2)).toEqual(third);
  });
});

describe('createGame', () => {
  it('starts with an empty grid, a full tray and a zero score', () => {
    const game = createGame(42);

    expect(game.grid).toEqual(createEmptyGrid());
    expect(game.tray).toHaveLength(TRAY_SIZE);
    expect(game.tray.every((piece) => piece !== null)).toBe(true);
    expect(game.score).toBe(0);
    expect(game.streak).toBe(1);
    expect(game.draws).toBe(1);
    expect(game.isOver).toBe(false);
    expect(game.stats).toEqual({ piecesPlaced: 0, linesCleared: 0, bestStreak: 1 });
  });

  it('draws its tray with createRng(seed)', () => {
    expect(createGame(42).tray).toEqual(nextPieces(createRng(42)));
  });

  it('returns the same game for the same seed', () => {
    expect(createGame(20261006)).toEqual(createGame(20261006));
  });

  it('returns a different tray for a different seed', () => {
    expect(createGame(1).tray).not.toEqual(createGame(2).tray);
  });
});
