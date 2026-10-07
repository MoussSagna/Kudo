import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { MOTION } from '../motion';
import { BLOCK_COLORS, FONTS, UI } from '../theme';
import { formatScore } from '../game/formatScore';

const REDUCED_MOTION_DIM = 0.5;
/** The streak badge shows from this multiplier on. */
const MIN_STREAK_SHOWN = 2;

interface ScoreHeaderProps {
  score: number;
  best: number;
  /** Multiplier the next clear will get. */
  streak: number;
}

/** The score, which pulses whenever it changes, with the current streak and the best score. */
export function ScoreHeader({ score, best, streak }: ScoreHeaderProps) {
  const reducedMotion = useReducedMotion();
  /** 0 at rest, 1 at the peak of the pulse. */
  const pulse = useSharedValue(0);
  const previousScore = useRef(score);

  useEffect(() => {
    if (previousScore.current === score) {
      return;
    }
    previousScore.current = score;
    const half = { duration: MOTION.scorePulseMs / 2, reduceMotion: ReduceMotion.Never };
    pulse.value = withSequence(withTiming(1, half), withTiming(0, half));
  }, [pulse, score]);

  const pulseStyle = useAnimatedStyle(() =>
    reducedMotion
      ? { opacity: 1 - pulse.value * REDUCED_MOTION_DIM }
      : { transform: [{ scale: 1 + pulse.value * (MOTION.scorePulseScale - 1) }] },
  );

  return (
    <View>
      <Text style={styles.label}>SCORE</Text>
      <Animated.Text style={[styles.score, pulseStyle]}>{formatScore(score)}</Animated.Text>
      {streak >= MIN_STREAK_SHOWN ? (
        <View style={styles.streak}>
          <Text style={styles.streakLabel}>Série ×{streak}</Text>
        </View>
      ) : null}
      <Text style={styles.best}>Meilleur : {formatScore(best)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyBold,
    fontSize: 14.5,
    letterSpacing: 0.7,
  },
  streak: {
    position: 'absolute',
    top: 17,
    right: 0,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: BLOCK_COLORS.green,
  },
  streakLabel: {
    color: UI.background,
    fontFamily: FONTS.title,
    fontSize: 14.5,
  },
  best: {
    position: 'absolute',
    top: 56,
    right: 0,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 20,
  },
  score: {
    alignSelf: 'flex-start',
    transformOrigin: 'left center',
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 61,
    lineHeight: 67,
  },
});
