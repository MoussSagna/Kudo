import { BLOCK_COLORS, GRID_SIZE, type BlockColor } from '../theme';
import { PIECES } from './pieces';
import { TRAY_SIZE, type GameState, type GridCell } from './state';

/** A game as it is saved: plain data, with pieces written by their id. */
export interface SavedGame {
  mode: GameState['mode'];
  seed: number;
  grid: GridCell[][];
  tray: (string | null)[];
  score: number;
  streak: number;
  draws: number;
  isOver: boolean;
  stats: GameState['stats'];
}

export function serializeGame(game: GameState): SavedGame {
  return {
    mode: game.mode,
    seed: game.seed,
    grid: game.grid.map((row) => [...row]),
    tray: game.tray.map((piece) => piece?.id ?? null),
    score: game.score,
    streak: game.streak,
    draws: game.draws,
    isOver: game.isOver,
    stats: { ...game.stats },
  };
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isGridCell(value: unknown): value is GridCell {
  return value === null || (typeof value === 'string' && value in BLOCK_COLORS);
}

/**
 * The game saved in `value`, or null when it is not a complete, well-formed game: anything read
 * from the storage may be missing, damaged, or written by another version of the app.
 */
export function deserializeGame(value: unknown): GameState | null {
  if (!isRecord(value)) {
    return null;
  }
  const { mode, seed, grid, tray, score, streak, draws, isOver, stats } = value;

  if (mode !== 'daily' && mode !== 'free') {
    return null;
  }
  if (!isCount(seed) || !isCount(score) || !isCount(streak) || !isCount(draws)) {
    return null;
  }
  if (streak < 1 || draws < 1 || typeof isOver !== 'boolean') {
    return null;
  }
  if (
    !Array.isArray(grid) ||
    grid.length !== GRID_SIZE ||
    !grid.every(
      (row) => Array.isArray(row) && row.length === GRID_SIZE && row.every(isGridCell),
    )
  ) {
    return null;
  }
  if (!Array.isArray(tray) || tray.length !== TRAY_SIZE) {
    return null;
  }
  const pieces = tray.map((id) => (id === null ? null : PIECES.find((piece) => piece.id === id)));
  if (pieces.some((piece) => piece === undefined)) {
    return null;
  }
  if (
    !isRecord(stats) ||
    !isCount(stats.piecesPlaced) ||
    !isCount(stats.linesCleared) ||
    !isCount(stats.bestStreak) ||
    stats.bestStreak < 1
  ) {
    return null;
  }

  return {
    mode,
    seed,
    grid: (grid as (BlockColor | null)[][]).map((row) => [...row]),
    tray: pieces.map((piece) => piece ?? null),
    score,
    streak,
    draws,
    isOver,
    stats: {
      piecesPlaced: stats.piecesPlaced,
      linesCleared: stats.linesCleared,
      bestStreak: stats.bestStreak,
    },
  };
}
