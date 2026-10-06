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

export async function markTutorialSeen(): Promise<void> {
  await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
}
