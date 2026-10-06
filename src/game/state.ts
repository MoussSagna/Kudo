import { GRID_SIZE, type BlockColor } from '../theme';
import { createRng, nextPieces, type Piece } from './pieces';

export const TRAY_SIZE = 3;

/** A grid cell: the color of the block on it, or null when empty. */
export type GridCell = BlockColor | null;

/** The 8 × 8 board, indexed as `grid[row][col]` from the top-left corner. */
export type Grid = readonly (readonly GridCell[])[];

/** The pieces offered to the player; a slot is null once its piece has been placed. */
export type Tray = readonly (Piece | null)[];

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
  };
}
