import { useSyncExternalStore } from 'react';

import { getPreferences, subscribeToPreferences } from '../storage/preferences';

/** The player's preferences, kept up to date: the screen redraws when one of them changes. */
export function usePreferences() {
  return useSyncExternalStore(subscribeToPreferences, getPreferences);
}
