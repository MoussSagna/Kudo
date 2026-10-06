import { GRID_SIZE } from '../theme';
import type { Piece } from './pieces';
import type { Grid } from './state';

/** True when every cell of the piece, placed with its top-left corner at (col, row), is inside the grid and empty. */
export function canPlace(grid: Grid, piece: Piece, col: number, row: number): boolean {
  return piece.cells.every(([cellCol, cellRow]) => {
    const targetCol = col + cellCol;
    const targetRow = row + cellRow;
    return (
      targetCol >= 0 &&
      targetCol < GRID_SIZE &&
      targetRow >= 0 &&
      targetRow < GRID_SIZE &&
      grid[targetRow][targetCol] === null
    );
  });
}

/** A new grid with the piece on it, in its color. The move must be valid: check `canPlace` first. */
export function placePiece(grid: Grid, piece: Piece, col: number, row: number): Grid {
  const placed = grid.map((gridRow) => [...gridRow]);
  for (const [cellCol, cellRow] of piece.cells) {
    placed[row + cellRow][col + cellCol] = piece.color;
  }
  return placed;
}
