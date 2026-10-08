import { dayOfSeed, type DayKey } from './days';
import type { GameState } from './state';
import { EMPTY_STREAK, extendStreak, type Streak } from './streak';

/** A daily challenge with the day it belongs to. */
export interface DailyEntry {
  day: DayKey;
  game: GameState;
}

/** What is kept about the daily challenge. */
export interface DailyData {
  /** The challenge being played, if it was left before its end. */
  inProgress: DailyEntry | null;
  /** The last challenge finished, in its final state: date, score, grid and statistics. */
  result: DailyEntry | null;
  /** The run of consecutive days on which a challenge was finished. */
  streak: Streak;
}

export const EMPTY_DAILY_DATA: DailyData = { inProgress: null, result: null, streak: EMPTY_STREAK };

/** Where today's challenge stands. */
export type DailyStatus =
  | { kind: 'new' }
  | { kind: 'inProgress'; game: GameState }
  | { kind: 'done'; game: GameState };

/**
 * Today's challenge can be played once: when it is finished, it is done until the day changes.
 * A challenge started on another day and never finished is abandoned: it does not count.
 */
export function dailyStatus(data: DailyData, today: DayKey): DailyStatus {
  if (data.result?.day === today) {
    return { kind: 'done', game: data.result.game };
  }
  if (data.inProgress?.day === today) {
    return { kind: 'inProgress', game: data.inProgress.game };
  }
  return { kind: 'new' };
}

/**
 * The data after a move of a daily challenge. The challenge belongs to the day of its seed, even
 * when it is finished after midnight. Its last move turns it into the result of that day, and
 * that day counts for the streak.
 */
export function recordDailyMove(data: DailyData, game: GameState): DailyData {
  const entry = { day: dayOfSeed(game.seed), game };
  return game.isOver
    ? { inProgress: null, result: entry, streak: extendStreak(data.streak, entry.day) }
    : { ...data, inProgress: entry };
}
