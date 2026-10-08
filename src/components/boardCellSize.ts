import { GRID_SIZE } from '../theme';

/** Under this size, blocks would be too small to aim at with a finger. */
const MIN_CELL_SIZE = 24;

/**
 * Size of a grid cell: the largest one for which the grid fits in `gridWidth` and the grid with
 * the tray under it, `trayHeightRatio` cells high, fit in `boardHeight`. On most phones the width
 * decides; on short screens the height does, so that the board never needs scrolling.
 */
export function boardCellSize(
  gridWidth: number,
  boardHeight: number,
  trayHeightRatio: number,
): number {
  const fitsWidth = Math.floor(gridWidth / GRID_SIZE);
  const fitsHeight = Math.floor(boardHeight / (GRID_SIZE + trayHeightRatio));
  return Math.max(MIN_CELL_SIZE, Math.min(fitsWidth, fitsHeight));
}
