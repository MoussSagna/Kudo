import AsyncStorage from '@react-native-async-storage/async-storage';

import { BEST_SCORE_KEY, readBestScore, saveBestScore } from '../bestScore';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('best score storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('reads 0 when nothing is stored', async () => {
    await expect(readBestScore()).resolves.toBe(0);
  });

  it('reads back the score that was saved', async () => {
    await saveBestScore(1780);

    await expect(readBestScore()).resolves.toBe(1780);
  });

  it('uses a single versioned key', async () => {
    await saveBestScore(42);

    expect(BEST_SCORE_KEY).toBe('kubo:bestScore:v1');
    await expect(AsyncStorage.getAllKeys()).resolves.toEqual([BEST_SCORE_KEY]);
  });

  it('reads 0 when the stored value is not a score', async () => {
    await AsyncStorage.setItem(BEST_SCORE_KEY, 'not a number');
    await expect(readBestScore()).resolves.toBe(0);

    await AsyncStorage.setItem(BEST_SCORE_KEY, '-5');
    await expect(readBestScore()).resolves.toBe(0);
  });

  it('reads 0 when reading fails', async () => {
    jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('read failed'));

    await expect(readBestScore()).resolves.toBe(0);
  });

  it('ignores a failed write', async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('write failed'));

    await expect(saveBestScore(100)).resolves.toBeUndefined();
  });
});
