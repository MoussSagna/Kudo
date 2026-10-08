import AsyncStorage from '@react-native-async-storage/async-storage';

/** What the player lets the game do. The settings screen changes these values. */
export interface Preferences {
  sounds: boolean;
  haptics: boolean;
}

export const PREFERENCES_KEY = 'kubo:preferences:v1';

const DEFAULT_PREFERENCES: Preferences = { sounds: true, haptics: true };

/**
 * The single source of truth: sounds and vibrations read it every time they are about to play,
 * so a change applies at once.
 */
let preferences: Preferences = { ...DEFAULT_PREFERENCES };
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getPreferences(): Readonly<Preferences> {
  return preferences;
}

/** Anything that is not an explicit « off » is « on »: a missing or damaged value enables it. */
function isEnabled(value: unknown): boolean {
  return value !== false;
}

/**
 * Reads the saved preferences; called once when the app starts, before any sound can play.
 * Nothing saved, or something unreadable, leaves everything enabled.
 */
export async function loadPreferences(): Promise<void> {
  let stored: unknown = null;
  try {
    stored = JSON.parse((await AsyncStorage.getItem(PREFERENCES_KEY)) ?? 'null');
  } catch {
    // Unreadable: the defaults apply.
  }
  const { sounds, haptics } = (
    typeof stored === 'object' && stored !== null ? stored : {}
  ) as Record<string, unknown>;
  preferences = { sounds: isEnabled(sounds), haptics: isEnabled(haptics) };
  notify();
}

/**
 * Changes a preference: it applies at once, then it is saved. A failed write is ignored: the
 * change still holds until the app is closed.
 */
export async function setPreference(name: keyof Preferences, enabled: boolean): Promise<void> {
  preferences = { ...preferences, [name]: enabled };
  notify();
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Nothing to do.
  }
}

/** Back to the defaults, in memory only. */
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
