import AsyncStorage from '@react-native-async-storage/async-storage';

import { hasSeenTutorial, markTutorialSeen, TUTORIAL_SEEN_KEY } from '../tutorial';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('tutorial storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('reports the tutorial as not seen when nothing is stored', async () => {
    await expect(hasSeenTutorial()).resolves.toBe(false);
  });

  it('reports the tutorial as seen once it has been marked', async () => {
    await markTutorialSeen();

    await expect(hasSeenTutorial()).resolves.toBe(true);
  });

  it('uses a single versioned key', async () => {
    await markTutorialSeen();

    expect(TUTORIAL_SEEN_KEY).toBe('kubo:tutorialSeen:v1');
    await expect(AsyncStorage.getAllKeys()).resolves.toEqual([TUTORIAL_SEEN_KEY]);
  });

  it('reports the tutorial as not seen when reading fails', async () => {
    jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('read failed'));

    await expect(hasSeenTutorial()).resolves.toBe(false);
  });

  it('ignores a failed write', async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('write failed'));

    await expect(markTutorialSeen()).resolves.toBeUndefined();
    await expect(hasSeenTutorial()).resolves.toBe(false);
  });
});
