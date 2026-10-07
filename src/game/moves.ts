import { GRID_SIZE } from '../theme';
import { clearLines } from './lines';
import type { Piece } from './pieces';
import { canPlace, placePiece } from './placement';
import { drawTray, type GameState, type GameStats, type Grid, type Tray } from './state';

const POINTS_PER_CELL = 1;
const CLEAR_BASE_POINTS = 10;

/** True when at least one piece left in the tray fits somewhere on the grid. */
export function hasAnyMove(grid: Grid, tray: Tray): boolean {
  return tray.some((piece) => {
    if (!piece) {
      return false;
    }
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (canPlace(grid, piece, col, row)) {
          return true;
        }
      }
    }
    return false;
  });
}

/** Points for emptying `cleared` rows and columns with one move, at the given streak level. */
export function clearPoints(cleared: number, streak: number): number {
  return CLEAR_BASE_POINTS * cleared * cleared * streak;
}

/** The statistics after a move that cleared `cleared` lines at the given streak level. */
export function updateStats(stats: GameStats, cleared: number, streak: number): GameStats {
  return {
    piecesPlaced: stats.piecesPlaced + 1,
    linesCleared: stats.linesCleared + cleared,
    bestStreak: cleared > 0 ? Math.max(stats.bestStreak, streak) : stats.bestStreak,
  };
}

/** Everything a move changed, for the interface to show it. */
export interface MoveResult {
  /** The state after the move. */
  next: GameState;
  piece: Piece;
  /** Where the top-left corner of the piece was placed. */
  col: number;
  row: number;
  /** The grid with the piece on it, before any line is cleared. */
  placedGrid: Grid;
  clearedRows: readonly number[];
  clearedCols: readonly number[];
  placementPoints: number;
  clearPoints: number;
}

/**
 * Plays the piece of a tray slot with its top-left corner at (col, row): places it, clears full
 * rows and columns, scores, empties the slot, draws a new tray once all three are placed, then
 * checks whether the game is over. Returns null for an invalid move.
 */
export function playMove(
  state: GameState,
  trayIndex: number,
  col: number,
  row: number,
): MoveResult | null {
  const piece = state.tray[trayIndex];
  if (state.isOver || !piece || !canPlace(state.grid, piece, col, row)) {
    return null;
  }

  const placedGrid = placePiece(state.grid, piece, col, row);
  const { grid, cleared, rows, cols } = clearLines(placedGrid);
  const hasCleared = cleared > 0;
  const placementPoints = piece.cells.length * POINTS_PER_CELL;
  const gain = hasCleared ? clearPoints(cleared, state.streak) : 0;

  const remaining = state.tray.map((slot, index) => (index === trayIndex ? null : slot));
  const isTrayEmpty = remaining.every((slot) => slot === null);
  const tray = isTrayEmpty ? drawTray(state.seed, state.draws) : remaining;

  return {
    next: {
      mode: state.mode,
      seed: state.seed,
      grid,
      tray,
      score: state.score + placementPoints + gain,
      streak: hasCleared ? state.streak + 1 : 1,
      draws: isTrayEmpty ? state.draws + 1 : state.draws,
      isOver: !hasAnyMove(grid, tray),
      stats: updateStats(state.stats, cleared, state.streak),
    },
    piece,
    col,
    row,
    placedGrid,
    clearedRows: rows,
    clearedCols: cols,
    placementPoints,
    clearPoints: gain,
  };
}

/** The state after a move; an invalid move returns the state unchanged. See `playMove`. */
export function applyMove(state: GameState, trayIndex: number, col: number, row: number): GameState {
  return playMove(state, trayIndex, col, row)?.next ?? state;
}
