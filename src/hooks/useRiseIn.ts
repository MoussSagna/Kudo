import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

export interface RiseIn {
  delayMs: number;
  distance: number;
  durationMs: number;
}

/** Fades an element in while it rises to its place. Without `rise`, the element is static. */
export function useRiseIn(rise?: RiseIn) {
  const progress = useSharedValue(rise ? 0 : 1);
  const distance = rise?.distance ?? 0;

  useEffect(() => {
    if (!rise) {
      return;
    }
    progress.value = withDelay(rise.delayMs, withTiming(1, { duration: rise.durationMs }));
  }, [progress, rise]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));
}
