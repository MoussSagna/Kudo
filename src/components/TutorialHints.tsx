import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { GridPosition } from '../game/targetCell';
import { MOTION } from '../motion';
import { BLOCK_IMAGES, FONTS, UI, type BlockColor } from '../theme';

const BLINK_MIN_OPACITY = 0.2;
const BLINK_MAX_OPACITY = 0.6;
const ARROW_WIDTH = 20;
const ARROW_HEIGHT = 24;
const ARROW_STROKE = 3;
const BADGE_FACE_HEIGHT = 38;
const BADGE_EDGE_HEIGHT = 5;

/** Goes back and forth between 0 and 1 for ever; stays at a fixed value with reduced motion. */
function usePulse(durationMs: number, restValue: number) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(reducedMotion ? restValue : 0);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    pulse.value = withRepeat(
      withTiming(1, { duration: durationMs, reduceMotion: ReduceMotion.Never }),
      -1,
      true,
    );
  }, [durationMs, pulse, reducedMotion]);

  return pulse;
}

interface BlinkingCellsProps {
  cells: readonly GridPosition[];
  color: BlockColor;
  cellSize: number;
}

/** The cells where the tutorial suggests placing the piece, blinking over the grid. */
export function BlinkingCells({ cells, color, cellSize }: BlinkingCellsProps) {
  const pulse = usePulse(MOTION.tutorialBlinkMs, 0.5);
  const blinkStyle = useAnimatedStyle(() => ({
    opacity: BLINK_MIN_OPACITY + pulse.value * (BLINK_MAX_OPACITY - BLINK_MIN_OPACITY),
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, blinkStyle]}>
      {cells.map(({ col, row }) => (
        <Image
          key={`${col}-${row}`}
          source={BLOCK_IMAGES[color]}
          style={{
            position: 'absolute',
            left: col * cellSize,
            top: row * cellSize,
            width: cellSize,
            height: cellSize,
          }}
        />
      ))}
    </Animated.View>
  );
}

/** An arrow pointing up, bobbing, to invite the player to drag the piece towards the grid. */
export function DragArrow() {
  const pulse = usePulse(MOTION.tutorialArrowMs, 0);
  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -MOTION.tutorialArrowRise * pulse.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.arrow, bobStyle]}>
      <View style={styles.arrowShaft} />
      <View style={[styles.arrowHead, styles.arrowHeadLeft]} />
      <View style={[styles.arrowHead, styles.arrowHeadRight]} />
    </Animated.View>
  );
}

interface PointsBadgeProps {
  label: string;
  /** Center of the badge, in points from the first grid cell. */
  centerX: number;
  centerY: number;
}

/** The points just earned, shown over the grid once a step is solved. */
export function PointsBadge({ label, centerX, centerY }: PointsBadgeProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.badge,
        { left: centerX - 60, top: centerY - (BADGE_FACE_HEIGHT + BADGE_EDGE_HEIGHT) / 2 },
      ]}
    >
      <View style={styles.badgeEdge}>
        <View style={styles.badgeFace}>
          <Text style={styles.badgeLabel}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    width: ARROW_WIDTH,
    height: ARROW_HEIGHT,
    alignItems: 'center',
  },
  arrowShaft: {
    width: ARROW_STROKE,
    height: ARROW_HEIGHT,
    borderRadius: ARROW_STROKE / 2,
    backgroundColor: UI.accent,
  },
  arrowHead: {
    position: 'absolute',
    top: -1,
    width: ARROW_STROKE,
    height: 13,
    borderRadius: ARROW_STROKE / 2,
    backgroundColor: UI.accent,
  },
  arrowHeadLeft: {
    left: 4.5,
    transform: [{ rotate: '45deg' }],
  },
  arrowHeadRight: {
    right: 4.5,
    transform: [{ rotate: '-45deg' }],
  },
  badge: {
    position: 'absolute',
    width: 120,
    alignItems: 'center',
  },
  badgeEdge: {
    height: BADGE_FACE_HEIGHT + BADGE_EDGE_HEIGHT,
    borderRadius: 22,
    backgroundColor: UI.accentEdge,
  },
  badgeFace: {
    height: BADGE_FACE_HEIGHT,
    paddingHorizontal: 15,
    borderRadius: 22,
    justifyContent: 'center',
    backgroundColor: UI.accent,
  },
  badgeLabel: {
    color: UI.background,
    fontFamily: FONTS.title,
    fontSize: 21,
  },
});
