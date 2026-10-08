import { boardCellSize } from '../boardCellSize';

describe('boardCellSize', () => {
  it('fills the width when the screen is tall enough', () => {
    expect(boardCellSize(352, 600, 3.45)).toBe(44);
  });

  it('shrinks on a short screen so that the grid and the tray fit in the height', () => {
    const cellSize = boardCellSize(337, 400, 3.45);

    expect(cellSize).toBe(34);
    expect(cellSize * (8 + 3.45)).toBeLessThanOrEqual(400);
  });

  it('never goes under a size a finger can aim at', () => {
    expect(boardCellSize(337, 100, 3.45)).toBe(24);
  });
});
