import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { now } from '../clock';
import { dailyStatus, EMPTY_DAILY_DATA, recordDailyMove, type DailyData } from '../game/daily';
import { addDays, dayKey, seedOfDay, type DayKey } from '../game/days';
import { FINISHED_GAME, SAMPLE_GAME } from '../game/sampleGame';
import type { GameState } from '../game/state';
import { currentStreak, EMPTY_STREAK } from '../game/streak';
import { readDailyData, writeDailyData } from '../storage/daily';
import { storageReady } from '../storage/devReset';

/**
 * Development only: EXPO_PUBLIC_SAMPLE_DAILY=progress shows today's challenge as left in the
 * middle of the mockup's game, and `done` as finished with the mockup's result, at the end of a
 * streak of 5 days whose record is 12; `tomorrow` is the same and opens the app on the
 * « Reviens demain » screen; `result` is the same as a new record, and opens the app on that
 * result seen again. Nothing is read from or written to the storage then.
 */
const SAMPLE_DAILY = __DEV__ ? process.env.EXPO_PUBLIC_SAMPLE_DAILY : undefined;

/** Development only: true when the app must open on the « Reviens demain » screen. */
export const OPENS_ON_TOMORROW_SCREEN = SAMPLE_DAILY === 'tomorrow';
/** Development only: true when the app must open on today's result, seen again. */
export const OPENS_ON_DAILY_RESULT = SAMPLE_DAILY === 'result';

function sampleDailyData(today: DayKey): DailyData | null {
  const seed = seedOfDay(today);
  if (SAMPLE_DAILY === 'progress') {
    return {
      inProgress: { day: today, game: { ...SAMPLE_GAME, seed } },
      result: null,
      streak: EMPTY_STREAK,
    };
  }
  if (SAMPLE_DAILY === 'done' || SAMPLE_DAILY === 'tomorrow' || SAMPLE_DAILY === 'result') {
    return {
      inProgress: null,
      result: {
        day: today,
        game: { ...FINISHED_GAME, seed },
        isNewRecord: SAMPLE_DAILY === 'result',
      },
      streak: {
        count: 5,
        best: 12,
        lastDay: today,
        days: [-4, -3, -2, -1, 0].map((offset) => addDays(today, offset)),
      },
    };
  }
  return null;
}

/**
 * Everything about the daily challenge: where today's challenge stands, and how to record its
 * moves. `isLoaded` is false until the saved data has been read.
 */
export function useDailyChallenge() {
  const [today, setToday] = useState(() => dayKey(now()));
  const [sample] = useState(() => sampleDailyData(today));
  const [data, setData] = useState<DailyData | null>(sample);
  /** The data after the last move, known at once: moves can follow each other within a render. */
  const latestData = useRef(data);

  useEffect(() => {
    if (sample) {
      return;
    }
    let cancelled = false;
    storageReady
      .then(readDailyData)
      .then((stored) => {
        if (!cancelled) {
          latestData.current = stored;
          setData(stored);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sample]);

  /** Reads the clock again: the day may have changed while the app was open. */
  const refreshToday = useCallback(() => setToday(dayKey(now())), []);

  // The day may change while the app is in the background: read the clock when it comes back.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshToday();
      }
    });
    return () => subscription.remove();
  }, [refreshToday]);

  /** Saves the challenge after one of its moves; the last one makes it the result of its day. */
  const recordMove = (game: GameState, isNewRecord: boolean) => {
    const next = recordDailyMove(latestData.current ?? EMPTY_DAILY_DATA, game, isNewRecord);
    latestData.current = next;
    setData(next);
    if (!sample) {
      writeDailyData(next);
    }
  };

  return {
    isLoaded: data !== null,
    today,
    status: dailyStatus(data ?? EMPTY_DAILY_DATA, today),
    /** The run of consecutive days, as saved, and its length as it stands today. */
    streak: (data ?? EMPTY_DAILY_DATA).streak,
    streakToday: currentStreak((data ?? EMPTY_DAILY_DATA).streak, today),
    recordMove,
    refreshToday,
  };
}

export type DailyChallenge = ReturnType<typeof useDailyChallenge>;
