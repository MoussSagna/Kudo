import { createRng, nextPieces } from '../pieces';
import { applyMove } from '../moves';
import { pieceById } from '../notation';
import { createEmptyGrid, createGame, drawTray, startGame, TRAY_SIZE } from '../state';

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

describe('game modes', () => {
  it('creates a free game unless told otherwise', () => {
    expect(createGame(42).mode).toBe('free');
    expect(createGame(42, 'daily').mode).toBe('daily');
  });

  it('seeds the daily challenge with the local date, so that it is the same all day', () => {
    const morning = startGame('daily', new Date(2026, 9, 7, 8, 0));
    const evening = startGame('daily', new Date(2026, 9, 7, 22, 30));

    expect(morning.mode).toBe('daily');
    expect(morning.seed).toBe(20261007);
    expect(evening).toEqual(morning);
  });

  it('changes the daily challenge the next day', () => {
    const today = startGame('daily', new Date(2026, 9, 7, 12, 0));
    const tomorrow = startGame('daily', new Date(2026, 9, 8, 12, 0));

    expect(tomorrow.seed).toBe(20261008);
    expect(tomorrow.tray).not.toEqual(today.tray);
  });

  it('seeds a free game with the clock', () => {
    const now = new Date(2026, 9, 7, 12, 0, 0, 123);
    const game = startGame('free', now);

    expect(game.mode).toBe('free');
    expect(game.seed).toBe(now.getTime());
  });

  it('keeps the mode from one move to the next', () => {
    const game = createGame(20261007, 'daily');

    expect(applyMove({ ...game, tray: [pieceById('dot'), null, null] }, 0, 0, 0).mode).toBe('daily');
  });
});
