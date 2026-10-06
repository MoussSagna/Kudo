import { GRID_SIZE } from '../theme';

export interface GridPosition {
  col: number;
  row: number;
}

/**
 * The grid cell aimed at by a piece whose top-left corner is at (left, top) on screen, for a grid
 * whose first cell starts at (gridLeft, gridTop). Rounds to the nearest cell; null when that cell
 * is outside the grid.
 */
export function targetCell(
  left: number,
  top: number,
  gridLeft: number,
  gridTop: number,
  cellSize: number,
): GridPosition | null {
  'worklet';
  // Adding 0 turns the -0 that Math.round returns just left of or above the grid into 0.
  const col = Math.round((left - gridLeft) / cellSize) + 0;
  const row = Math.round((top - gridTop) / cellSize) + 0;
  if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) {
    return null;
  }
  return { col, row };
}
