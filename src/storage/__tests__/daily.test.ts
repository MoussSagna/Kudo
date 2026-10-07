import AsyncStorage from '@react-native-async-storage/async-storage';

import { EMPTY_DAILY_DATA, recordDailyMove } from '../../game/daily';
import { SAMPLE_GAME } from '../../game/sampleGame';
import { DAILY_KEY, readDailyData, writeDailyData } from '../daily';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const withProgress = recordDailyMove(EMPTY_DAILY_DATA, SAMPLE_GAME);

describe('daily challenge storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('reads nothing in progress when nothing is stored', async () => {
    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);
  });

  it('reads back the challenge in progress, with its day', async () => {
    await writeDailyData(withProgress);

    await expect(readDailyData()).resolves.toEqual(withProgress);
    expect(withProgress.inProgress?.day).toBe('2026-10-06');
  });

  it('uses a single versioned key', async () => {
    await writeDailyData(withProgress);

    expect(DAILY_KEY).toBe('kubo:daily:v1');
    await expect(AsyncStorage.getAllKeys()).resolves.toEqual([DAILY_KEY]);
  });

  it('ignores what is not JSON', async () => {
    await AsyncStorage.setItem(DAILY_KEY, '{not json');

    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);
  });

  it('ignores an unknown format', async () => {
    await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(['a', 'b']));
    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);

    await AsyncStorage.setItem(DAILY_KEY, JSON.stringify({ inProgress: { day: 'yesterday' } }));
    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);
  });

  it('ignores a damaged game or one that is not a daily challenge', async () => {
    const saved = JSON.parse(JSON.stringify({ inProgress: { day: '2026-10-06', game: {} } }));
    await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(saved));
    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);

    await writeDailyData({ inProgress: { day: '2026-10-06', game: { ...SAMPLE_GAME, mode: 'free' } } });
    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);
  });

  it('reads nothing in progress when reading fails', async () => {
    jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('read failed'));

    await expect(readDailyData()).resolves.toEqual(EMPTY_DAILY_DATA);
  });

  it('ignores a failed write', async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('write failed'));

    await expect(writeDailyData(withProgress)).resolves.toBeUndefined();
  });
});
