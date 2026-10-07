import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GameMode } from '../game/state';

/** One best score per mode. The free game keeps the key used before the modes existed. */
export const BEST_SCORE_KEYS: Readonly<Record<GameMode, string>> = {
  free: 'kubo:bestScore:v1',
  daily: 'kubo:bestScore:daily:v1',
};

/** The best score of a mode saved on this phone; 0 when there is none or when it cannot be read. */
export async function readBestScore(mode: GameMode): Promise<number> {
  try {
    const stored = Number(await AsyncStorage.getItem(BEST_SCORE_KEYS[mode]));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return 0;
  }
}

/** Saves the best score of a mode. A failure is ignored: the record is just not kept. */
export async function saveBestScore(mode: GameMode, score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(BEST_SCORE_KEYS[mode], String(score));
  } catch {
    // Nothing to do: the record stays in memory until the app is closed.
  }
}
