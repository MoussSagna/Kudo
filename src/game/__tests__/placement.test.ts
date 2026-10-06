import { canPlace, placePiece } from '../placement';
import { createEmptyGrid } from '../state';
import { gridFrom, pieceById } from '../notation';

const dot = pieceById('dot');
const h3 = pieceById('h3');
const v3 = pieceById('v3');
const sq2 = pieceById('sq2');
const lD = pieceById('L_d');

describe('canPlace', () => {
  const empty = createEmptyGrid();

  it('accepts a piece in each corner of an empty grid', () => {
    expect(canPlace(empty, sq2, 0, 0)).toBe(true);
    expect(canPlace(empty, sq2, 6, 0)).toBe(true);
    expect(canPlace(empty, sq2, 0, 6)).toBe(true);
    expect(canPlace(empty, sq2, 6, 6)).toBe(true);
  });

  it('accepts a piece flush against the right and bottom edges', () => {
    expect(canPlace(empty, h3, 5, 7)).toBe(true);
    expect(canPlace(empty, v3, 7, 5)).toBe(true);
  });

  it('rejects a piece crossing the right or bottom edge', () => {
    expect(canPlace(empty, h3, 6, 0)).toBe(false);
    expect(canPlace(empty, v3, 0, 6)).toBe(false);
    expect(canPlace(empty, sq2, 7, 7)).toBe(false);
  });

  it('rejects a piece crossing the left or top edge', () => {
    expect(canPlace(empty, dot, -1, 0)).toBe(false);
    expect(canPlace(empty, dot, 0, -1)).toBe(false);
  });

  it('rejects a piece overlapping an occupied cell', () => {
    const grid = placePiece(empty, dot, 3, 3);

    expect(canPlace(grid, dot, 3, 3)).toBe(false);
    expect(canPlace(grid, sq2, 2, 2)).toBe(false);
    expect(canPlace(grid, h3, 1, 3)).toBe(false);
  });

  it('accepts a piece next to occupied cells', () => {
    const grid = placePiece(empty, dot, 3, 3);

    expect(canPlace(grid, sq2, 4, 3)).toBe(true);
    expect(canPlace(grid, h3, 0, 3)).toBe(true);
  });

  it('only checks the cells of the piece, not its bounding box', () => {
    const grid = placePiece(empty, dot, 0, 1);

    expect(canPlace(grid, lD, 0, 0)).toBe(true);
  });
});

describe('placePiece', () => {
  it('puts the piece on the grid in its color', () => {
    const grid = placePiece(createEmptyGrid(), lD, 3, 2);

    expect(grid).toEqual(
      gridFrom([
        '........',
        '........',
        '...ooo..',
        '.....o..',
        '........',
        '........',
        '........',
        '........',
      ]),
    );
  });

  it('keeps the blocks already on the grid', () => {
    const before = placePiece(createEmptyGrid(), sq2, 0, 0);
    const after = placePiece(before, v3, 7, 5);

    expect(after[0][0]).toBe('orange');
    expect(after[1][1]).toBe('orange');
    expect(after[5][7]).toBe('green');
    expect(after[7][7]).toBe('green');
  });

  it('does not mutate the grid it receives', () => {
    const grid = createEmptyGrid();
    const snapshot = JSON.stringify(grid);

    const placed = placePiece(grid, sq2, 2, 2);

    expect(JSON.stringify(grid)).toBe(snapshot);
    expect(placed).not.toBe(grid);
  });
});
