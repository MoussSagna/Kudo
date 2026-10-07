import { useRef, useState } from 'react';

import { playMove, type MoveResult } from '../game/moves';
import type { GameState } from '../game/state';

/** The last move played, for the interface to animate it. */
export interface MoveEvent extends MoveResult {
  /** Changes with every move. */
  id: number;
  /** Where the piece was released: its top-left corner, in points from the first grid cell. */
  from: { left: number; top: number };
}

/** Holds the game state. Every rule goes through `playMove`. */
export function useGame(createInitialGame: () => GameState) {
  const [game, setGame] = useState(createInitialGame);
  const [lastMove, setLastMove] = useState<MoveEvent | null>(null);
  const moveCount = useRef(0);

  /**
   * Plays the piece of a tray slot with its top-left corner at (col, row). Returns what the move
   * changed, or null when the move is invalid.
   */
  const place = (
    trayIndex: number,
    col: number,
    row: number,
    from: { left: number; top: number },
  ): MoveResult | null => {
    const result = playMove(game, trayIndex, col, row);
    if (!result) {
      return null;
    }
    moveCount.current += 1;
    setGame(result.next);
    setLastMove({ ...result, id: moveCount.current, from });
    return result;
  };

  return { game, lastMove, place };
}
