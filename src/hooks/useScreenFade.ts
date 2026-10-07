import { useState } from 'react';
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

  const show = (next: Route) => {
    setRoute(next);
    opacity.value = withTiming(1, FADE);
  };

  const navigate = (next: Route) => {
    opacity.value = withTiming(0, FADE, (finished) => {
      if (finished) {
        scheduleOnRN(show, next);
      }
    });
  };

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return { route, navigate, fadeStyle };
}
