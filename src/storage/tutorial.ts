import AsyncStorage from '@react-native-async-storage/async-storage';

export const TUTORIAL_SEEN_KEY = 'kubo:tutorialSeen:v1';

/** Resolves to false when nothing is stored or when the storage cannot be read. */
export async function hasSeenTutorial(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(TUTORIAL_SEEN_KEY)) === 'true';
  } catch {
    return false;
  }
}

/** A failure is ignored: the tutorial will simply be shown again at the next launch. */
export async function markTutorialSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
  } catch {
    // Nothing to do.
  }
}
