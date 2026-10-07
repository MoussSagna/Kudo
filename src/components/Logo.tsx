import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { BlockColor } from '../theme';
import { LOGO_BLOCK_SIZE, LogoBlock, type BlockEnter } from './LogoBlock';

const LOGO_GAP = 6;

const LOGO_ROWS: readonly (readonly (BlockColor | null)[])[] = [
  ['purple', 'purple', 'cyan'],
  [null, 'yellow', 'cyan'],
  ['red', 'yellow', 'yellow'],
];

export interface LogoMotion {
  emptyCellFadeMs: number;
  blocksDelayMs: number;
  blockStaggerMs: number;
  blockFadeMs: number;
  blockDropDistance: number;
  blockDropMs: number;
  blockBounceHeight: number;
  blockBounceMs: number;
  pulseDelayMs: number;
  pulseScale: number;
  pulseMs: number;
}

/** One entry per cell, row by row. Blocks fall bottom row first, left to right. */
function buildBlockEnters(motion: LogoMotion): BlockEnter[][] {
  let fallen = 0;
  const enters: BlockEnter[][] = [];
  for (let row = LOGO_ROWS.length - 1; row >= 0; row--) {
    enters[row] = LOGO_ROWS[row].map((color) =>
      color === null
        ? {
            delayMs: 0,
            fadeMs: motion.emptyCellFadeMs,
            dropDistance: 0,
            dropMs: 0,
            bounceHeight: 0,
            bounceMs: 0,
          }
        : {
            delayMs: motion.blocksDelayMs + motion.blockStaggerMs * fallen++,
            fadeMs: motion.blockFadeMs,
            dropDistance: motion.blockDropDistance,
            dropMs: motion.blockDropMs,
            bounceHeight: motion.blockBounceHeight,
            bounceMs: motion.blockBounceMs,
          },
    );
  }
  return enters;
}

interface LogoProps {
  motion?: LogoMotion;
  /** Size of a block and space between two blocks; the launch screen sizes by default. */
  blockSize?: number;
  gap?: number;
}

export function Logo({ motion, blockSize = LOGO_BLOCK_SIZE, gap = LOGO_GAP }: LogoProps) {
  const scale = useSharedValue(1);
  const enters = useMemo(() => (motion ? buildBlockEnters(motion) : undefined), [motion]);

  useEffect(() => {
    if (!motion) {
      return;
    }
    const half = { duration: motion.pulseMs / 2 };
    scale.value = withDelay(
      motion.pulseDelayMs,
      withSequence(withTiming(motion.pulseScale, half), withTiming(1, half)),
    );
  }, [motion, scale]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ gap }, pulseStyle]}>
      {LOGO_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { gap }]}>
          {row.map((color, columnIndex) => (
            <LogoBlock
              key={columnIndex}
              color={color}
              size={blockSize}
              enter={enters?.[rowIndex][columnIndex]}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
