import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEV_FLAGS } from '../dev/devFlags';

/**
 * Development only: EXPO_PUBLIC_RESET_DATA=1 erases everything the app has saved (tutorial seen,
 * best scores, daily challenge, streak) when it starts. Resolves once the storage can be read.
 */
export const storageReady: Promise<void> = DEV_FLAGS.resetData
  ? AsyncStorage.clear().catch(() => undefined)
  : Promise.resolve();
