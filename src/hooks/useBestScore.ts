import { useCallback, useEffect, useState } from 'react';

import { readBestScore, saveBestScore } from '../storage/bestScore';

/**
 * The best score saved on this phone, 0 until it is loaded. `submit` records a finished game and
 * tells whether it beat the record.
 */
export function useBestScore() {
  const [best, setBest] = useState(0);

  useEffect(() => {
    let cancelled = false;
    readBestScore().then((stored) => {
      if (!cancelled) {
        setBest((current) => Math.max(current, stored));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(
    (score: number): boolean => {
      if (score <= best) {
        return false;
      }
      setBest(score);
      saveBestScore(score);
      return true;
    },
    [best],
  );

  return { best, submit };
}
