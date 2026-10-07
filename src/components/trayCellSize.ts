import { PIECES } from '../game/pieces';

/** Space kept between the longest pieces and the edges of their tray slot. */
const SLOT_MARGIN = 8;

/** Length, in cells, of the longest side of any piece. */
const LONGEST_SIDE = Math.max(
  ...PIECES.flatMap((piece) => piece.cells.map(([col, row]) => Math.max(col, row) + 1)),
);

/**
 * Size of a block in the tray, the same for every piece: the largest one that keeps the longest
 * pieces, lying down or standing up, at least `SLOT_MARGIN` away from the edges of a slot.
 */
export function trayCellSize(slotWidth: number, slotHeight: number): number {
  return Math.floor((Math.min(slotWidth, slotHeight) - 2 * SLOT_MARGIN) / LONGEST_SIDE);
}
