import { GRID_SIZE } from '../theme';
import type { Grid } from './state';

export interface ClearResult {
  grid: Grid;
  /** Number of rows and columns emptied. */
  cleared: number;
}

/**
 * Empties every full row and column. All of them are detected before anything is emptied, so a
 * cell at the crossing of a full row and a full column counts for both.
 */
export function clearLines(grid: Grid): ClearResult {
  const fullRows = new Set<number>();
  const fullCols = new Set<number>();

  grid.forEach((row, rowIndex) => {
    if (row.every((cell) => cell !== null)) {
      fullRows.add(rowIndex);
    }
  });
  for (let col = 0; col < GRID_SIZE; col++) {
    if (grid.every((row) => row[col] !== null)) {
      fullCols.add(col);
    }
  }

  const cleared = fullRows.size + fullCols.size;
  if (cleared === 0) {
    return { grid, cleared };
  }
  return {
    grid: grid.map((row, rowIndex) =>
      row.map((cell, col) => (fullRows.has(rowIndex) || fullCols.has(col) ? null : cell)),
    ),
    cleared,
  };
}
