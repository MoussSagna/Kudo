import { useCallback, useState } from 'react';

import { applyMove } from '../game/moves';
import { createGame, type GameState } from '../game/state';

/** Holds the game state. Every rule goes through `applyMove`. */
export function useGame(createInitialGame: () => GameState) {
  const [game, setGame] = useState(createInitialGame);

  /** Plays the piece of a tray slot with its top-left corner at (col, row). */
  const place = useCallback((trayIndex: number, col: number, row: number) => {
    setGame((current) => applyMove(current, trayIndex, col, row));
  }, []);

  const restart = useCallback(() => {
    setGame(createGame(Date.now()));
  }, []);

  return { game, place, restart };
}
