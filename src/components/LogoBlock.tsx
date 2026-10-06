import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, type BlockColor } from '../theme';

export const LOGO_BLOCK_SIZE = 60;

export interface BlockEnter {
  delayMs: number;
  fadeMs: number;
  /** Height the block falls from, 0 for a fade in place. */
  dropDistance: number;
  dropMs: number;
  /** How high the block bounces back after landing. */
  bounceHeight: number;
  bounceMs: number;
}

interface LogoBlockProps {
  color: BlockColor | null;
  enter?: BlockEnter;
}

export function LogoBlock({ color, enter }: LogoBlockProps) {
  const opacity = useSharedValue(enter ? 0 : 1);
  const translateY = useSharedValue(enter ? -enter.dropDistance : 0);

  useEffect(() => {
    if (!enter) {
      return;
    }
    const halfBounce = enter.bounceMs / 2;
    opacity.value = withDelay(enter.delayMs, withTiming(1, { duration: enter.fadeMs }));
    translateY.value = withDelay(
      enter.delayMs,
      withSequence(
        withTiming(0, { duration: enter.dropMs, easing: Easing.in(Easing.quad) }),
        withTiming(-enter.bounceHeight, { duration: halfBounce, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: halfBounce, easing: Easing.in(Easing.quad) }),
      ),
    );
  }, [enter, opacity, translateY]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={color ? BLOCK_IMAGES[color] : CELL_EMPTY_IMAGE}
      style={[styles.block, enterStyle]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    width: LOGO_BLOCK_SIZE,
    height: LOGO_BLOCK_SIZE,
  },
});
