import { GRID_SIZE, type BlockColor } from '../theme';
import { createRng, nextPieces, type Piece } from './pieces';

export const TRAY_SIZE = 3;

/** A grid cell: the color of the block on it, or null when empty. */
export type GridCell = BlockColor | null;

/** The 8 × 8 board, indexed as `grid[row][col]` from the top-left corner. */
export type Grid = readonly (readonly GridCell[])[];

/** The pieces offered to the player; a slot is null once its piece has been placed. */
export type Tray = readonly (Piece | null)[];

/** What the player did during the game, shown on the result screen. */
export interface GameStats {
  readonly piecesPlaced: number;
  /** Rows and columns cleared, counted together. */
  readonly linesCleared: number;
  /** Highest multiplier applied to a clear so far; 1 until two moves in a row clear lines. */
  readonly bestStreak: number;
}

export const INITIAL_STATS: GameStats = { piecesPlaced: 0, linesCleared: 0, bestStreak: 1 };

export interface GameState {
  /** Seed of the piece sequence: same seed, same game. */
  readonly seed: number;
  readonly grid: Grid;
  readonly tray: Tray;
  readonly score: number;
  /** Multiplier applied to the next clear: 1, then 2, 3… while consecutive moves clear lines. */
  readonly streak: number;
  /** Number of trays drawn so far, the first one included. */
  readonly draws: number;
  readonly isOver: boolean;
  readonly stats: GameStats;
}

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array<GridCell>(GRID_SIZE).fill(null));
}

/** The tray of a given draw (0 for the first one), always the same for a given seed. */
export function drawTray(seed: number, drawIndex: number): Tray {
  const rng = createRng(seed);
  for (let skipped = 0; skipped < drawIndex * TRAY_SIZE; skipped++) {
    rng();
  }
  return nextPieces(rng, TRAY_SIZE);
}

export function createGame(seed: number): GameState {
  return {
    seed,
    grid: createEmptyGrid(),
    tray: drawTray(seed, 0),
    score: 0,
    streak: 1,
    draws: 1,
    isOver: false,
    stats: INITIAL_STATS,
  };
}
