import { clearLines } from '../lines';
import { gridFrom } from '../notation';
import { createEmptyGrid } from '../state';

describe('clearLines', () => {
  it('clears nothing on an empty grid', () => {
    const grid = createEmptyGrid();

    expect(clearLines(grid)).toEqual({ grid, cleared: 0 });
  });

  it('clears nothing when no row or column is full', () => {
    const grid = gridFrom([
      'rrrrrrr.',
      'g.......',
      'g.......',
      'g.......',
      'g.......',
      'g.......',
      'g.......',
      '........',
    ]);

    expect(clearLines(grid)).toEqual({ grid, cleared: 0 });
  });

  it('clears one full row and keeps the rest', () => {
    const result = clearLines(
      gridFrom([
        '........',
        '..y.....',
        'rrrrrrrr',
        '.....c..',
        '........',
        '........',
        '........',
        '........',
      ]),
    );

    expect(result.cleared).toBe(1);
    expect(result.grid).toEqual(
      gridFrom([
        '........',
        '..y.....',
        '........',
        '.....c..',
        '........',
        '........',
        '........',
        '........',
      ]),
    );
  });

  it('clears one full column and keeps the rest', () => {
    const result = clearLines(
      gridFrom([
        '...g....',
        '...g..y.',
        '...g....',
        '.c.g....',
        '...g....',
        '...g....',
        '...g....',
        '...g....',
      ]),
    );

    expect(result.cleared).toBe(1);
    expect(result.grid).toEqual(
      gridFrom([
        '........',
        '......y.',
        '........',
        '.c......',
        '........',
        '........',
        '........',
        '........',
      ]),
    );
  });

  it('clears a crossing row and column together', () => {
    const result = clearLines(
      gridFrom([
        '...g....',
        '.y.g....',
        'rrrgrrrr',
        '...g....',
        '...g..c.',
        '...g....',
        '...g....',
        '...g....',
      ]),
    );

    expect(result.cleared).toBe(2);
    expect(result.grid).toEqual(
      gridFrom([
        '........',
        '.y......',
        '........',
        '........',
        '......c.',
        '........',
        '........',
        '........',
      ]),
    );
  });

  it('counts several rows and columns at once', () => {
    const result = clearLines(
      gridFrom([
        'rrrrrrrr',
        'rrrrrrrr',
        'bb......',
        'bb......',
        'bb......',
        'bb......',
        'bb......',
        'bb......',
      ]),
    );

    expect(result.cleared).toBe(4);
    expect(result.grid).toEqual(createEmptyGrid());
  });

  it('does not mutate the grid it receives', () => {
    const grid = gridFrom([
      'rrrrrrrr',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
    ]);
    const snapshot = JSON.stringify(grid);

    clearLines(grid);

    expect(JSON.stringify(grid)).toBe(snapshot);
  });
});
