import type { MoveResult } from './moves';

/** How a move should sound and feel: a plain placement, a single clear, or a combo. */
export type MoveFeedback = 'place' | 'clear' | 'combo';

/**
 * A move that clears nothing is a placement. A clear is a combo when it empties two lines or
 * more, or when the previous move had cleared too (the streak multiplier was above 1).
 */
export function moveFeedback(result: MoveResult): MoveFeedback {
  const cleared = result.clearedRows.length + result.clearedCols.length;
  if (cleared === 0) {
    return 'place';
  }
  const streakBeforeMove = result.next.streak - 1;
  return cleared >= 2 || streakBeforeMove > 1 ? 'combo' : 'clear';
}
