import { playMove, type MoveResult } from '../game/moves';
import { canPlace } from '../game/placement';
import { createGame, type GameState } from '../game/state';
import { GRID_SIZE } from '../theme';

/** Seed of the stress game: with the moves below, it lasts the 22 draws of the scenario. */
export const STRESS_SEED = 54;
export const STRESS_CYCLES = 22;

/**
 * How the three pieces of a draw are released:
 * - `spaced`: one after the other, each once the animations of the previous one are over;
 * - `burst`: the three in the same instant;
 * - `refused`: a release on an occupied cell, at once followed by the valid one, then the others
 *   before the animations end;
 * - `cancelled`: a gesture on the last piece is cancelled while the two others are released,
 *   then the last piece is released;
 * - `held`: the last piece is held over the grid while the two others are released, then let go,
 *   which brings the next draw.
 */
export const STRESS_PATTERNS = ['spaced', 'burst', 'refused', 'cancelled', 'held'] as const;
export type StressPattern = (typeof STRESS_PATTERNS)[number];

/** Tray slots in the order they are played, for each pattern. */
const ORDERS: Readonly<Record<StressPattern, readonly number[]>> = {
  spaced: [0, 1, 2],
  burst: [2, 0, 1],
  refused: [1, 2, 0],
  cancelled: [1, 0, 2],
  held: [2, 1, 0],
};

export interface StressMove {
  trayIndex: number;
  col: number;
  row: number;
  /** A cell where the piece cannot go, for a release that must be refused. */
  refused: { col: number; row: number } | null;
  /** What the move does, computed with the game rules. */
  result: MoveResult;
}

/** The three moves that empty a tray, in the order they are played; the last brings a new draw. */
export interface StressCycle {
  pattern: StressPattern;
  moves: readonly StressMove[];
}

function bestMove(state: GameState, trayIndex: number): StressMove | null {
  const piece = state.tray[trayIndex];
  if (!piece) {
    return null;
  }
  let best: MoveResult | null = null;
  let refused: StressMove['refused'] = null;
  // Bottom rows first: the first of the moves that clear the most lines is kept.
  for (let row = GRID_SIZE - 1; row >= 0; row--) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!canPlace(state.grid, piece, col, row)) {
        refused = refused ?? { col, row };
        continue;
      }
      const result = playMove(state, trayIndex, col, row);
      const cleared = result ? result.clearedRows.length + result.clearedCols.length : -1;
      const bestCleared = best ? best.clearedRows.length + best.clearedCols.length : -1;
      if (result && cleared > bestCleared) {
        best = result;
      }
    }
  }
  return best ? { trayIndex, col: best.col, row: best.row, refused, result: best } : null;
}

/**
 * A long scripted game for the stress test: for every draw, the three pieces are placed where
 * they clear the most lines, in the order of the pattern of that draw. Stops early if the game
 * ends.
 */
export function buildStressPlan(seed = STRESS_SEED, cycles = STRESS_CYCLES): StressCycle[] {
  const plan: StressCycle[] = [];
  let state = createGame(seed, 'free');
  for (let cycle = 0; cycle < cycles && !state.isOver; cycle++) {
    const pattern = STRESS_PATTERNS[cycle % STRESS_PATTERNS.length];
    const moves: StressMove[] = [];
    for (const trayIndex of ORDERS[pattern]) {
      const move = bestMove(state, trayIndex);
      if (!move) {
        return plan;
      }
      moves.push(move);
      state = move.result.next;
    }
    plan.push({ pattern, moves });
  }
  return plan;
}
