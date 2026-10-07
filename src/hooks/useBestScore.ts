import { useCallback, useEffect, useState } from 'react';

import type { GameMode } from '../game/state';
import { readBestScore, saveBestScore } from '../storage/bestScore';

/**
 * The best score of a mode saved on this phone, 0 until it is loaded. `submit` records a finished game and
 * tells whether it beat the record.
 */
export function useBestScore(mode: GameMode) {
  const [best, setBest] = useState(0);

  useEffect(() => {
    let cancelled = false;
    readBestScore(mode).then((stored) => {
      if (!cancelled) {
        setBest((current) => Math.max(current, stored));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const submit = useCallback(
    (score: number): boolean => {
      if (score <= best) {
        return false;
      }
      setBest(score);
      saveBestScore(mode, score);
      return true;
    },
    [best, mode],
  );

  return { best, submit };
}
