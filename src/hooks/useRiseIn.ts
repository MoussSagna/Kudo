import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export interface RiseIn {
  delayMs: number;
  distance: number;
  durationMs: number;
  /** Called once the rise and the hold that follows it are over. */
  onEnd?: () => void;
  holdMs?: number;
}

/** Fades an element in while it rises to its place. Without `rise`, the element is static. */
export function useRiseIn(rise?: RiseIn) {
  const progress = useSharedValue(rise ? 0 : 1);
  const distance = rise?.distance ?? 0;

  useEffect(() => {
    if (!rise) {
      return;
    }
    const { delayMs, durationMs, onEnd, holdMs = 0 } = rise;
    progress.value = withDelay(
      delayMs,
      withSequence(
        withTiming(1, { duration: durationMs }),
        withTiming(1, { duration: holdMs }, (finished) => {
          if (finished && onEnd) {
            scheduleOnRN(onEnd);
          }
        }),
      ),
    );
  }, [progress, rise]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));
}
