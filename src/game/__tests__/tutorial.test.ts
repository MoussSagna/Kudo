import { clearLines } from '../lines';
import { canPlace } from '../placement';
import {
  isTutorialMoveAccepted,
  PLACE_STEP,
  solvedTutorialState,
  suggestionCells,
  TUTORIAL_TRAY_INDEX,
} from '../tutorial';

describe('PLACE_STEP', () => {
  const { game, suggestion } = PLACE_STEP;

  it('offers a single piece, L_d, in the middle of the tray', () => {
    expect(game.tray.map((piece) => piece?.id ?? null)).toEqual([null, 'L_d', null]);
  });

  it('starts from a grid with no line to clear', () => {
    expect(clearLines(game.grid).cleared).toBe(0);
  });

  it('suggests the cells (3,3), (4,3), (5,3) and (5,4)', () => {
    expect(suggestionCells(PLACE_STEP)).toEqual([
      { col: 3, row: 3 },
      { col: 4, row: 3 },
      { col: 5, row: 3 },
      { col: 5, row: 4 },
    ]);
  });

  it('accepts the suggested move', () => {
    expect(
      isTutorialMoveAccepted(PLACE_STEP, game, TUTORIAL_TRAY_INDEX, suggestion.col, suggestion.row),
    ).toBe(true);
  });

  it('accepts any other valid move', () => {
    expect(isTutorialMoveAccepted(PLACE_STEP, game, TUTORIAL_TRAY_INDEX, 0, 0)).toBe(true);
    expect(isTutorialMoveAccepted(PLACE_STEP, game, TUTORIAL_TRAY_INDEX, 4, 4)).toBe(true);
  });

  it('refuses a move on occupied cells or outside the grid', () => {
    expect(isTutorialMoveAccepted(PLACE_STEP, game, TUTORIAL_TRAY_INDEX, 0, 6)).toBe(false);
    expect(isTutorialMoveAccepted(PLACE_STEP, game, TUTORIAL_TRAY_INDEX, 6, 0)).toBe(false);
  });

  it('refuses a move from an empty tray slot', () => {
    expect(isTutorialMoveAccepted(PLACE_STEP, game, 0, 3, 3)).toBe(false);
  });

  it('is worth 4 points once solved, with the piece on the suggested cells', () => {
    const solved = solvedTutorialState(PLACE_STEP);

    expect(solved.score).toBe(4);
    for (const { col, row } of suggestionCells(PLACE_STEP)) {
      expect(solved.grid[row][col]).toBe('orange');
    }
    expect(canPlace(solved.grid, game.tray[TUTORIAL_TRAY_INDEX]!, 3, 3)).toBe(false);
  });
});
