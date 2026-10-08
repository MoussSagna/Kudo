/** What the player lets the game do. The settings screen will change and save these values. */
export interface Preferences {
  sounds: boolean;
  haptics: boolean;
}

const DEFAULT_PREFERENCES: Preferences = { sounds: true, haptics: true };

let preferences: Preferences = { ...DEFAULT_PREFERENCES };
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getPreferences(): Readonly<Preferences> {
  return preferences;
}

export function setPreference(name: keyof Preferences, enabled: boolean): void {
  preferences = { ...preferences, [name]: enabled };
  notify();
}

export function resetPreferences(): void {
  preferences = { ...DEFAULT_PREFERENCES };
  notify();
}

/** Calls `listener` after every change; returns the function that stops it. */
export function subscribeToPreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
