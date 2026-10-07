import type { Piece } from '../game/pieces';

/** Space kept between the largest pieces and the edges of their tray slot. */
const SLOT_MARGIN = 10;

/**
 * Size of a block for a piece shown in a tray slot: the usual size, reduced for the pieces that
 * would otherwise touch the edges of the slot. Long pieces get the same size whether they lie
 * down or stand up.
 */
export function fitTrayCellSize(
  piece: Piece,
  usualCellSize: number,
  slotWidth: number,
  slotHeight: number,
): number {
  const longestSide = Math.max(...piece.cells.map(([col, row]) => Math.max(col, row))) + 1;
  const available = Math.min(slotWidth, slotHeight) - 2 * SLOT_MARGIN;
  return Math.min(usualCellSize, Math.floor(available / longestSide));
}
