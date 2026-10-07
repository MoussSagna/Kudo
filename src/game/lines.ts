import { GRID_SIZE } from '../theme';
import type { Grid } from './state';

export interface ClearResult {
  grid: Grid;
  /** Number of rows and columns emptied. */
  cleared: number;
  /** Indexes of the emptied rows and columns, in increasing order. */
  rows: readonly number[];
  cols: readonly number[];
}

/**
 * Empties every full row and column. All of them are detected before anything is emptied, so a
 * cell at the crossing of a full row and a full column counts for both.
 */
export function clearLines(grid: Grid): ClearResult {
  const rows = grid.flatMap((row, rowIndex) => (row.every((cell) => cell !== null) ? [rowIndex] : []));
  const cols: number[] = [];
  for (let col = 0; col < GRID_SIZE; col++) {
    if (grid.every((row) => row[col] !== null)) {
      cols.push(col);
    }
  }

  const cleared = rows.length + cols.length;
  if (cleared === 0) {
    return { grid, cleared, rows, cols };
  }
  return {
    grid: grid.map((row, rowIndex) =>
      row.map((cell, col) => (rows.includes(rowIndex) || cols.includes(col) ? null : cell)),
    ),
    cleared,
    rows,
    cols,
  };
}
