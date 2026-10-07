import { pieceById } from '../../game/notation';
import { PIECES } from '../../game/pieces';
import { fitTrayCellSize } from '../fitTrayCellSize';

const USUAL = 30;
const SLOT_WIDTH = 117;
const SLOT_HEIGHT = 150;

function sizeOf(id: string) {
  return fitTrayCellSize(pieceById(id), USUAL, SLOT_WIDTH, SLOT_HEIGHT);
}

describe('fitTrayCellSize', () => {
  it('keeps the usual size for the pieces that fit', () => {
    expect(sizeOf('dot')).toBe(30);
    expect(sizeOf('sq2')).toBe(30);
    expect(sizeOf('L_d')).toBe(30);
    expect(sizeOf('sq3')).toBe(30);
  });

  it('shrinks the 5-block bars, lying down or standing up, to the same size', () => {
    expect(sizeOf('h5')).toBe(19);
    expect(sizeOf('v5')).toBe(19);
  });

  it('shrinks the 4-block bars a little', () => {
    expect(sizeOf('h4')).toBe(24);
    expect(sizeOf('v4')).toBe(24);
  });

  it('leaves a margin around every piece, in both directions', () => {
    for (const piece of PIECES) {
      const cell = fitTrayCellSize(piece, USUAL, SLOT_WIDTH, SLOT_HEIGHT);
      const columns = Math.max(...piece.cells.map(([col]) => col)) + 1;
      const rows = Math.max(...piece.cells.map(([, row]) => row)) + 1;

      expect(columns * cell).toBeLessThanOrEqual(SLOT_WIDTH - 20);
      expect(rows * cell).toBeLessThanOrEqual(SLOT_HEIGHT - 20);
    }
  });
});
