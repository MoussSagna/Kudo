import { useEffect, useState } from 'react';

import { now } from '../clock';
import { dailyStatus, EMPTY_DAILY_DATA, recordDailyMove, type DailyData } from '../game/daily';
import { dayKey } from '../game/days';
import type { GameState } from '../game/state';
import { readDailyData, writeDailyData } from '../storage/daily';
import { storageReady } from '../storage/devReset';

/**
 * Everything about the daily challenge: where today's challenge stands, and how to record its
 * moves. `isLoaded` is false until the saved data has been read.
 */
export function useDailyChallenge() {
  const [data, setData] = useState<DailyData | null>(null);
  const [today] = useState(() => dayKey(now()));

  useEffect(() => {
    let cancelled = false;
    storageReady
      .then(readDailyData)
      .then((stored) => {
        if (!cancelled) {
          setData(stored);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Saves the challenge after one of its moves. */
  const recordMove = (game: GameState) => {
    const next = recordDailyMove(data ?? EMPTY_DAILY_DATA, game);
    setData(next);
    writeDailyData(next);
  };

  return {
    isLoaded: data !== null,
    today,
    status: dailyStatus(data ?? EMPTY_DAILY_DATA, today),
    recordMove,
  };
}

export type DailyChallenge = ReturnType<typeof useDailyChallenge>;
