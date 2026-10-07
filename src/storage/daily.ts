import AsyncStorage from '@react-native-async-storage/async-storage';

import { EMPTY_DAILY_DATA, type DailyData, type DailyEntry } from '../game/daily';
import { isDayKey } from '../game/days';
import { deserializeGame, serializeGame } from '../game/serialize';

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

/** What is saved about the daily challenge. Anything missing or unreadable is ignored. */
export async function readDailyData(): Promise<DailyData> {
  try {
    const stored: unknown = JSON.parse((await AsyncStorage.getItem(DAILY_KEY)) ?? 'null');
    if (typeof stored !== 'object' || stored === null) {
      return EMPTY_DAILY_DATA;
    }
    const { inProgress, result } = stored as { inProgress?: unknown; result?: unknown };
    return { inProgress: deserializeEntry(inProgress), result: deserializeEntry(result) };
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
      }),
    );
  } catch {
    // Nothing to do.
  }
}
