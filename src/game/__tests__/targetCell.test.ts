import { targetCell } from '../targetCell';

const GRID_LEFT = 21;
const GRID_TOP = 250;
const CELL = 44;

function at(col: number, row: number, offsetX = 0, offsetY = 0) {
  return targetCell(
    GRID_LEFT + col * CELL + offsetX,
    GRID_TOP + row * CELL + offsetY,
    GRID_LEFT,
    GRID_TOP,
    CELL,
  );
}

describe('targetCell', () => {
  it('returns the cell a piece is exactly aligned with', () => {
    expect(at(0, 0)).toEqual({ col: 0, row: 0 });
    expect(at(3, 5)).toEqual({ col: 3, row: 5 });
    expect(at(7, 7)).toEqual({ col: 7, row: 7 });
  });

  it('rounds to the nearest cell when the piece is slightly off', () => {
    expect(at(3, 5, 10, -10)).toEqual({ col: 3, row: 5 });
    expect(at(3, 5, -21, 21)).toEqual({ col: 3, row: 5 });
  });

  it('moves to the next cell once past the middle between two cells', () => {
    expect(at(3, 5, 21, 0)).toEqual({ col: 3, row: 5 });
    expect(at(3, 5, 23, 0)).toEqual({ col: 4, row: 5 });
    expect(at(3, 5, 0, 23)).toEqual({ col: 3, row: 6 });
    expect(at(3, 5, -23, -23)).toEqual({ col: 2, row: 4 });
  });

  it('still aims at an edge cell when the piece overflows the grid by less than half a cell', () => {
    expect(at(0, 0, -20, -20)).toEqual({ col: 0, row: 0 });
    expect(at(7, 7, 20, 20)).toEqual({ col: 7, row: 7 });
  });

  it('returns null when the nearest cell is outside the grid', () => {
    expect(at(0, 0, -23, 0)).toBeNull();
    expect(at(0, 0, 0, -23)).toBeNull();
    expect(at(8, 3)).toBeNull();
    expect(at(3, 8)).toBeNull();
    expect(at(-4, 20)).toBeNull();
  });
});
