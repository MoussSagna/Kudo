import AsyncStorage from '@react-native-async-storage/async-storage';

import { EMPTY_DAILY_DATA, type DailyData, type DailyEntry } from '../game/daily';
import { isDayKey } from '../game/days';
import { deserializeGame, serializeGame } from '../game/serialize';
import { EMPTY_STREAK, type Streak } from '../game/streak';

export const DAILY_KEY = 'kubo:daily:v1';

function serializeEntry(entry: DailyEntry | null) {
  return entry ? { day: entry.day, game: serializeGame(entry.game) } : null;
}

/** Null for anything that is not a day with a well-formed daily game. */
function deserializeEntry(value: unknown): DailyEntry | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const { day, game } = value as { day?: unknown; game?: unknown };
  const parsed = deserializeGame(game);
  return isDayKey(day) && parsed?.mode === 'daily' ? { day, game: parsed } : null;
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** An empty streak for anything that is not a well-formed one. */
function deserializeStreak(value: unknown): Streak {
  if (typeof value !== 'object' || value === null) {
    return EMPTY_STREAK;
  }
  const { count, best, lastDay, days } = value as Record<string, unknown>;
  if (!isCount(count) || !isCount(best) || best < count) {
    return EMPTY_STREAK;
  }
  if (!Array.isArray(days) || !days.every(isDayKey)) {
    return EMPTY_STREAK;
  }
  if (lastDay === null) {
    return count === 0 ? { count, best, lastDay, days } : EMPTY_STREAK;
  }
  return isDayKey(lastDay) && count >= 1 ? { count, best, lastDay, days } : EMPTY_STREAK;
}

/** What is saved about the daily challenge. Anything missing or unreadable is ignored. */
export async function readDailyData(): Promise<DailyData> {
  try {
    const stored: unknown = JSON.parse((await AsyncStorage.getItem(DAILY_KEY)) ?? 'null');
    if (typeof stored !== 'object' || stored === null) {
      return EMPTY_DAILY_DATA;
    }
    const { inProgress, result, streak } = stored as Record<string, unknown>;
    return {
      inProgress: deserializeEntry(inProgress),
      result: deserializeEntry(result),
      streak: deserializeStreak(streak),
    };
  } catch {
    return EMPTY_DAILY_DATA;
  }
}

/** A failure is ignored: the game goes on, the challenge is just not kept. */
export async function writeDailyData(data: DailyData): Promise<void> {
  try {
    await AsyncStorage.setItem(
      DAILY_KEY,
      JSON.stringify({
        inProgress: serializeEntry(data.inProgress),
        result: serializeEntry(data.result),
        streak: data.streak,
      }),
    );
  } catch {
    // Nothing to do.
  }
}
