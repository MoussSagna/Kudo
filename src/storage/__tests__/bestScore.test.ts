import AsyncStorage from '@react-native-async-storage/async-storage';

import { BEST_SCORE_KEYS, readBestScore, saveBestScore } from '../bestScore';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('best score storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('reads 0 when nothing is stored', async () => {
    await expect(readBestScore('free')).resolves.toBe(0);
    await expect(readBestScore('daily')).resolves.toBe(0);
  });

  it('reads back the score that was saved', async () => {
    await saveBestScore('free', 1780);

    await expect(readBestScore('free')).resolves.toBe(1780);
  });

  it('keeps one best score per mode', async () => {
    await saveBestScore('free', 1780);
    await saveBestScore('daily', 640);

    await expect(readBestScore('free')).resolves.toBe(1780);
    await expect(readBestScore('daily')).resolves.toBe(640);
  });

  it('uses one versioned key per mode', async () => {
    await saveBestScore('free', 42);
    await saveBestScore('daily', 7);

    expect(BEST_SCORE_KEYS).toEqual({
      free: 'kubo:bestScore:v1',
      daily: 'kubo:bestScore:daily:v1',
    });
    expect([...(await AsyncStorage.getAllKeys())].sort()).toEqual(
      Object.values(BEST_SCORE_KEYS).sort(),
    );
  });

  it('reads the score saved before the modes existed as the free game score', async () => {
    await AsyncStorage.setItem('kubo:bestScore:v1', '2480');

    await expect(readBestScore('free')).resolves.toBe(2480);
    await expect(readBestScore('daily')).resolves.toBe(0);
  });

  it('reads 0 when the stored value is not a score', async () => {
    await AsyncStorage.setItem(BEST_SCORE_KEYS.free, 'not a number');
    await expect(readBestScore('free')).resolves.toBe(0);

    await AsyncStorage.setItem(BEST_SCORE_KEYS.free, '-5');
    await expect(readBestScore('free')).resolves.toBe(0);
  });

  it('reads 0 when reading fails', async () => {
    jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('read failed'));

    await expect(readBestScore('daily')).resolves.toBe(0);
  });

  it('ignores a failed write', async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('write failed'));

    await expect(saveBestScore('daily', 100)).resolves.toBeUndefined();
  });
});
