import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LaunchTagline } from '../components/LaunchTagline';
import { LaunchTitle } from '../components/LaunchTitle';
import { Logo, type LogoMotion } from '../components/Logo';
import type { RiseIn } from '../hooks/useRiseIn';
import { UI } from '../theme';

/**
 * Every duration and delay of the launch animation, in milliseconds (distances in points).
 * Total = emptyCellFade + 7 × blockStagger + blockSettle + pulse + taglineDelay + taglineFade
 * + endHold, to keep at or under 2300.
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
  endHoldMs: 125,
  reducedMotionHoldMs: 1000,
} as const;

const FALLING_BLOCKS = 8;
const PULSE_DELAY_MS =
  LAUNCH.emptyCellFadeMs + LAUNCH.blockStaggerMs * (FALLING_BLOCKS - 1) + LAUNCH.blockSettleMs;
const TITLE_DELAY_MS = PULSE_DELAY_MS + LAUNCH.pulseMs;

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

interface LaunchScreenProps {
  onDone: () => void;
}

export function LaunchScreen({ onDone }: LaunchScreenProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!reducedMotion) {
      return;
    }
    const timer = setTimeout(onDone, LAUNCH.reducedMotionHoldMs);
    return () => clearTimeout(timer);
  }, [onDone, reducedMotion]);

  const taglineRise = useMemo<RiseIn>(
    () => ({
      delayMs: TITLE_DELAY_MS + LAUNCH.taglineDelayMs,
      distance: LAUNCH.taglineRiseDistance,
      durationMs: LAUNCH.taglineFadeMs,
      holdMs: LAUNCH.endHoldMs,
      onEnd: onDone,
    }),
    [onDone],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Logo motion={reducedMotion ? undefined : LOGO_MOTION} />
      <LaunchTitle rise={reducedMotion ? undefined : TITLE_RISE} />
      <LaunchTagline rise={reducedMotion ? undefined : taglineRise} />
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
});
