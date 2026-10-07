import AsyncStorage from '@react-native-async-storage/async-storage';

export const BEST_SCORE_KEY = 'kubo:bestScore:v1';

/** The best score saved on this phone; 0 when there is none or when it cannot be read. */
export async function readBestScore(): Promise<number> {
  try {
    const stored = Number(await AsyncStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return 0;
  }
}

/** Saves the best score. A failure is ignored: the game goes on, the record is just not kept. */
export async function saveBestScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Nothing to do: the record stays in memory until the app is closed.
  }
}
