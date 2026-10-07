/** What the player lets the game do. The settings screen will change and save these values. */
export interface Preferences {
  sounds: boolean;
  haptics: boolean;
}

const DEFAULT_PREFERENCES: Preferences = { sounds: true, haptics: true };

let preferences: Preferences = { ...DEFAULT_PREFERENCES };

export function getPreferences(): Readonly<Preferences> {
  return preferences;
}

export function setPreference(name: keyof Preferences, enabled: boolean): void {
  preferences = { ...preferences, [name]: enabled };
}

export function resetPreferences(): void {
  preferences = { ...DEFAULT_PREFERENCES };
}
