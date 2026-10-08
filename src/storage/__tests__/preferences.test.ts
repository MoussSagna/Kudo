import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getPreferences,
  loadPreferences,
  PREFERENCES_KEY,
  resetPreferences,
  setPreference,
  subscribeToPreferences,
} from '../preferences';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('preferences', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    resetPreferences();
  });

  it('enables sounds and haptics by default', () => {
    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('changes one value at once, without touching the other', () => {
    setPreference('sounds', false);

    expect(getPreferences()).toEqual({ sounds: false, haptics: true });
  });

  it('goes back to the defaults when reset', async () => {
    await setPreference('haptics', false);
    resetPreferences();

    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('tells its listeners about every change, until they unsubscribe', async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToPreferences(listener);

    await setPreference('sounds', false);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    await setPreference('sounds', true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps everything enabled when nothing is stored', async () => {
    await loadPreferences();

    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('reads back what was saved', async () => {
    await setPreference('sounds', false);
    resetPreferences();

    await loadPreferences();

    expect(getPreferences()).toEqual({ sounds: false, haptics: true });
  });

  it('saves both values under a single versioned key', async () => {
    await setPreference('haptics', false);

    expect(PREFERENCES_KEY).toBe('kubo:preferences:v1');
    await expect(AsyncStorage.getAllKeys()).resolves.toEqual([PREFERENCES_KEY]);
    expect(JSON.parse((await AsyncStorage.getItem(PREFERENCES_KEY)) ?? '')).toEqual({
      sounds: true,
      haptics: false,
    });
  });

  it('tells its listeners when the saved values are loaded', async () => {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify({ sounds: false, haptics: false }));
    const listener = jest.fn();
    const unsubscribe = subscribeToPreferences(listener);

    await loadPreferences();
    unsubscribe();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(getPreferences()).toEqual({ sounds: false, haptics: false });
  });

  it.each([
    ['not JSON', '{oops'],
    ['not an object', '"off"'],
    ['null', 'null'],
    ['an array', '[false, false]'],
    ['an empty object', '{}'],
  ])('enables everything when the stored value is %s', async (_, stored) => {
    await AsyncStorage.setItem(PREFERENCES_KEY, stored);

    await loadPreferences();

    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('enables a value that is not a boolean, and keeps the readable one', async () => {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify({ sounds: 'no', haptics: false }));

    await loadPreferences();

    expect(getPreferences()).toEqual({ sounds: true, haptics: false });
  });

  it('enables everything when reading fails', async () => {
    jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('read failed'));

    await loadPreferences();

    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('applies a change even when saving it fails', async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('write failed'));

    await expect(setPreference('sounds', false)).resolves.toBeUndefined();

    expect(getPreferences().sounds).toBe(false);
  });
});
