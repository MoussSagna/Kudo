import { useCallback, useState } from 'react';
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { MOTION } from '../motion';

/** A fade has no movement: it is kept as it is when the device asks for reduced motion. */
const FADE = { duration: MOTION.screenFadeMs, reduceMotion: ReduceMotion.Never };

/**
 * Keeps the route being shown and fades between routes: `navigate` fades the current screen out,
 * swaps the route, then fades the new screen in. Routes must be plain data.
 */
export function useScreenFade<Route>(initialRoute: Route) {
  const [route, setRoute] = useState(initialRoute);
  const opacity = useSharedValue(1);

  const show = useCallback(
    (next: Route) => {
      setRoute(next);
      opacity.set(withTiming(1, FADE));
    },
    [opacity],
  );

  const navigate = useCallback(
    (next: Route) => {
      opacity.set(
        withTiming(0, FADE, (finished) => {
          if (finished) {
            scheduleOnRN(show, next);
          }
        }),
      );
    },
    [opacity, show],
  );

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return { route, navigate, fadeStyle };
}
