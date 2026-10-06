import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { LaunchTagline } from '../components/LaunchTagline';
import { LaunchTitle } from '../components/LaunchTitle';
import { Logo, type LogoMotion } from '../components/Logo';
import type { RiseIn } from '../hooks/useRiseIn';
import { UI } from '../theme';

/**
 * Every duration and delay of the launch animation, in milliseconds (distances in points).
 * Total = emptyCellFade + 7 × blockStagger + blockSettle + pulse + taglineDelay + taglineFade
 * + pause + exit, to keep at or under 3000.
 */
const LAUNCH = {
  emptyCellFadeMs: 225,
  blockStaggerMs: 75,
  blockFadeMs: 180,
  blockDropDistance: 180,
  /** Perceptual duration: the spring actually settles in about 1.5 times this value. */
  blockSpring: { duration: 350, dampingRatio: 0.5 },
  /** Time given to the last block to land before the pulse starts. */
  blockSettleMs: 525,
  pulseScale: 1.07,
  pulseMs: 220,
  titleRiseDistance: 22,
  titleFadeMs: 350,
  taglineDelayMs: 180,
  taglineRiseDistance: 14,
  taglineFadeMs: 350,
  /** Everything stays still, long enough to be read, before the exit. */
  pauseMs: 400,
  exitMs: 300,
  exitLogoScale: 0.8,
  titleScreenFadeInMs: 200,
  reducedMotionHoldMs: 1000,
} as const;

export const TITLE_SCREEN_FADE_IN_MS = LAUNCH.titleScreenFadeInMs;

const FALLING_BLOCKS = 8;
const PULSE_DELAY_MS =
  LAUNCH.emptyCellFadeMs + LAUNCH.blockStaggerMs * (FALLING_BLOCKS - 1) + LAUNCH.blockSettleMs;
const TITLE_DELAY_MS = PULSE_DELAY_MS + LAUNCH.pulseMs;
const TAGLINE_DELAY_MS = TITLE_DELAY_MS + LAUNCH.taglineDelayMs;
const EXIT_DELAY_MS = TAGLINE_DELAY_MS + LAUNCH.taglineFadeMs + LAUNCH.pauseMs;
const EXIT_LOGO_SHRINK = 1 - LAUNCH.exitLogoScale;

const LOGO_MOTION: LogoMotion = {
  emptyCellFadeMs: LAUNCH.emptyCellFadeMs,
  blocksDelayMs: LAUNCH.emptyCellFadeMs,
  blockStaggerMs: LAUNCH.blockStaggerMs,
  blockFadeMs: LAUNCH.blockFadeMs,
  blockDropDistance: LAUNCH.blockDropDistance,
  blockSpring: LAUNCH.blockSpring,
  pulseDelayMs: PULSE_DELAY_MS,
  pulseScale: LAUNCH.pulseScale,
  pulseMs: LAUNCH.pulseMs,
};

const TITLE_RISE: RiseIn = {
  delayMs: TITLE_DELAY_MS,
  distance: LAUNCH.titleRiseDistance,
  durationMs: LAUNCH.titleFadeMs,
};

const TAGLINE_RISE: RiseIn = {
  delayMs: TAGLINE_DELAY_MS,
  distance: LAUNCH.taglineRiseDistance,
  durationMs: LAUNCH.taglineFadeMs,
};

interface LaunchScreenProps {
  /** Called when the title screen can start to appear. */
  onDone: () => void;
}

export function LaunchScreen({ onDone }: LaunchScreenProps) {
  const reducedMotion = useReducedMotion();
  const exit = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(onDone, LAUNCH.reducedMotionHoldMs);
      return () => clearTimeout(timer);
    }
    exit.value = withDelay(
      EXIT_DELAY_MS,
      withTiming(1, { duration: LAUNCH.exitMs }, (finished) => {
        if (finished) {
          scheduleOnRN(onDone);
        }
      }),
    );
  }, [exit, onDone, reducedMotion]);

  const logoExitStyle = useAnimatedStyle(() => ({
    opacity: 1 - exit.value,
    transform: [{ scale: 1 - exit.value * EXIT_LOGO_SHRINK }],
  }));
  const textExitStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.value }));

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={logoExitStyle}>
        <Logo motion={reducedMotion ? undefined : LOGO_MOTION} />
      </Animated.View>
      <Animated.View style={[styles.text, textExitStyle]}>
        <LaunchTitle rise={reducedMotion ? undefined : TITLE_RISE} />
        <LaunchTagline rise={reducedMotion ? undefined : TAGLINE_RISE} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
    backgroundColor: UI.background,
  },
  text: {
    alignItems: 'center',
  },
});
