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
import { FONTS, UI } from '../theme';
import { formatScore } from './formatScore';

const REDUCED_MOTION_DIM = 0.5;

interface ScoreHeaderProps {
  score: number;
}

/** The score, which pulses whenever it changes. */
export function ScoreHeader({ score }: ScoreHeaderProps) {
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
  score: {
    alignSelf: 'flex-start',
    transformOrigin: 'left center',
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 61,
    lineHeight: 67,
  },
});
