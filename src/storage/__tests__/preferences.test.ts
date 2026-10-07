import { getPreferences, resetPreferences, setPreference } from '../preferences';

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
});
