import * as Haptics from 'expo-haptics';

import { getPreferences } from './storage/preferences';

export type HapticName = 'pick' | 'place' | 'clear' | 'invalid' | 'gameover';

const HAPTICS: Readonly<Record<HapticName, () => Promise<void>>> = {
  pick: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  place: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  clear: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  invalid: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  gameover: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

/** Vibrates, unless the player turned haptics off. A device that cannot vibrate is ignored. */
export function playHaptic(name: HapticName): void {
  if (!getPreferences().haptics) {
    return;
  }
  HAPTICS[name]().catch(() => undefined);
}
