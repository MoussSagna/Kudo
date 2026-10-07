import { addDays, type DayKey } from './days';

/** How many past days are remembered, to draw the current week. */
const REMEMBERED_DAYS = 14;

/** The run of consecutive days on which a daily challenge was finished. */
export interface Streak {
  /** Length of the run ending on `lastDay`. */
  count: number;
  /** The longest run ever. */
  best: number;
  /** The last day a challenge was finished, or null if none ever was. */
  lastDay: DayKey | null;
  /** The most recent days a challenge was finished, oldest first. */
  days: readonly DayKey[];
}

export const EMPTY_STREAK: Streak = { count: 0, best: 0, lastDay: null, days: [] };

/**
 * The streak after a challenge is finished on `day`: one more if the previous one was the day
 * before, the same if it was already counted that day, and a fresh start otherwise.
 */
export function extendStreak(streak: Streak, day: DayKey): Streak {
  if (streak.lastDay !== null && day <= streak.lastDay) {
    return streak;
  }
  const count = streak.lastDay === addDays(day, -1) ? streak.count + 1 : 1;
  return {
    count,
    best: Math.max(streak.best, count),
    lastDay: day,
    days: [...streak.days, day].slice(-REMEMBERED_DAYS),
  };
}

/**
 * The streak as it stands today: it holds while the last challenge was finished today or
 * yesterday, and falls back to 0 once a whole day has been missed.
 */
export function currentStreak(streak: Streak, today: DayKey): number {
  const isAlive = streak.lastDay === today || streak.lastDay === addDays(today, -1);
  return isAlive ? streak.count : 0;
}
