import {
  getPreferences,
  resetPreferences,
  setPreference,
  subscribeToPreferences,
} from '../preferences';

describe('preferences', () => {
  afterEach(resetPreferences);

  it('enables sounds and haptics by default', () => {
    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('changes one value without touching the other', () => {
    setPreference('sounds', false);

    expect(getPreferences()).toEqual({ sounds: false, haptics: true });
  });

  it('goes back to the defaults when reset', () => {
    setPreference('haptics', false);
    resetPreferences();

    expect(getPreferences()).toEqual({ sounds: true, haptics: true });
  });

  it('tells its listeners about every change, until they unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToPreferences(listener);

    setPreference('sounds', false);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setPreference('sounds', true);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
