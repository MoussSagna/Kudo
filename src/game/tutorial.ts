import { playMove } from './moves';
import { gridFrom, pieceById } from './notation';
import { INITIAL_STATS, type GameState } from './state';
import type { GridPosition } from './targetCell';

/** The tutorial offers a single piece, in the middle slot of the tray. */
export const TUTORIAL_TRAY_INDEX = 1;

/** One hands-on step of the tutorial: a prepared grid, one piece, and where it should go. */
export interface TutorialStep {
  game: GameState;
  /** Where the tutorial suggests placing the piece: its top-left corner. */
  suggestion: GridPosition;
  /** When true, only a move that clears at least one line is accepted. */
  mustClearLine: boolean;
}

function tutorialGame(rows: readonly string[], pieceId: string): GameState {
  return {
    mode: 'free',
    seed: 0,
    grid: gridFrom(rows),
    tray: [null, pieceById(pieceId), null],
    score: 0,
    streak: 1,
    draws: 1,
    isOver: false,
    stats: INITIAL_STATS,
  };
}

/** Step 1: place a piece anywhere it fits. */
export const PLACE_STEP: TutorialStep = {
  game: tutorialGame(
    [
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      'r......y',
      'rr.gg.yy',
    ],
    'L_d',
  ),
  suggestion: { col: 3, row: 3 },
  mustClearLine: false,
};

/** Step 2: complete a row with the piece; nothing else is accepted. */
export const CLEAR_STEP: TutorialStep = {
  game: tutorialGame(
    [
      '........',
      '........',
      '........',
      '........',
      '........',
      '...p....',
      'oyy...cr',
      'b.rr.pp.',
    ],
    'h3',
  ),
  suggestion: { col: 3, row: 6 },
  mustClearLine: true,
};

/** The grid cells covered by the piece of a step when it is placed where the step suggests. */
export function suggestionCells(step: TutorialStep): GridPosition[] {
  const piece = step.game.tray[TUTORIAL_TRAY_INDEX];
  return (piece?.cells ?? []).map(([col, row]) => ({
    col: step.suggestion.col + col,
    row: step.suggestion.row + row,
  }));
}

/**
 * Whether the tutorial lets this move through. It must be a valid move of the game, and for a
 * step that teaches clearing, it must clear at least one line.
 */
export function isTutorialMoveAccepted(
  step: TutorialStep,
  state: GameState,
  trayIndex: number,
  col: number,
  row: number,
): boolean {
  const move = playMove(state, trayIndex, col, row);
  if (!move) {
    return false;
  }
  return !step.mustClearLine || move.clearedRows.length + move.clearedCols.length > 0;
}

/** The state of a step once its piece is placed where the step suggests. */
export function solvedTutorialState(step: TutorialStep): GameState {
  const move = playMove(step.game, TUTORIAL_TRAY_INDEX, step.suggestion.col, step.suggestion.row);
  return move ? move.next : step.game;
}
