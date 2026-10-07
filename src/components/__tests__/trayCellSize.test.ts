import { PIECES } from '../../game/pieces';
import { trayCellSize } from '../trayCellSize';

describe('trayCellSize', () => {
  it('is limited by the narrowest side of a slot', () => {
    expect(trayCellSize(117, 152)).toBe(20);
    expect(trayCellSize(152, 117)).toBe(20);
  });

  it('is the largest size that keeps 8 pt around a 5-block bar', () => {
    const cell = trayCellSize(117, 152);

    expect(5 * cell).toBeLessThanOrEqual(117 - 16);
    expect(5 * (cell + 1)).toBeGreaterThan(117 - 16);
  });

  it('leaves at least 8 pt around every piece, in both directions', () => {
    const slotWidth = 121;
    const slotHeight = 155;
    const cell = trayCellSize(slotWidth, slotHeight);

    for (const piece of PIECES) {
      const columns = Math.max(...piece.cells.map(([col]) => col)) + 1;
      const rows = Math.max(...piece.cells.map(([, row]) => row)) + 1;

      expect((slotWidth - columns * cell) / 2).toBeGreaterThanOrEqual(8);
      expect((slotHeight - rows * cell) / 2).toBeGreaterThanOrEqual(8);
    }
  });
});
