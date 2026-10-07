import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { MoveEvent } from '../hooks/useGame';
import { MOTION } from '../motion';
import { BLOCK_IMAGES, FONTS, UI, type BlockColor } from '../theme';
import { pieceSpan } from './PieceView';

const GAIN_WIDTH = 140;
/** Share of its lifetime the gain label takes to fade in. */
const GAIN_FADE_IN = 0.15;

/** Every animation here handles reduced motion itself, with fades instead of movement. */
function timing(duration: number) {
  return { duration, reduceMotion: ReduceMotion.Never };
}

interface EffectBlockProps {
  color: BlockColor;
  left: number;
  top: number;
  size: number;
  /** Where the block starts from, relative to its cell; null for a block that was already there. */
  landFrom: { dx: number; dy: number } | null;
  /** When the block starts to disappear, or null if it stays on the grid. */
  clearDelayMs: number | null;
  reducedMotion: boolean;
}

function EffectBlock({
  color,
  left,
  top,
  size,
  landFrom,
  clearDelayMs,
  reducedMotion,
}: EffectBlockProps) {
  const isLanding = landFrom !== null;
  /** 0 while the block is where the piece was released, 1 once it is on its cell. */
  const landed = useSharedValue(isLanding ? 0 : 1);
  const bounce = useSharedValue(1);
  const flash = useSharedValue(0);
  const vanished = useSharedValue(0);

  useEffect(() => {
    if (isLanding) {
      landed.value = withTiming(1, timing(MOTION.landMs));
      bounce.value = withDelay(
        MOTION.landMs,
        withSequence(
          withTiming(MOTION.landBounceScale, timing(MOTION.landBounceMs / 2)),
          withTiming(1, timing(MOTION.landBounceMs / 2)),
        ),
      );
    }
    if (clearDelayMs !== null) {
      flash.value = withDelay(
        clearDelayMs,
        withSequence(
          withTiming(1, timing(MOTION.clearFlashMs / 2)),
          withTiming(0, timing(MOTION.clearFlashMs / 2)),
        ),
      );
      vanished.value = withDelay(
        clearDelayMs + MOTION.clearFlashMs,
        withTiming(1, timing(MOTION.clearShrinkMs)),
      );
    }
  }, [bounce, clearDelayMs, flash, isLanding, landed, vanished]);

  const dx = landFrom?.dx ?? 0;
  const dy = landFrom?.dy ?? 0;

  const blockStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: landed.value * (1 - vanished.value) };
    }
    return {
      opacity: 1 - vanished.value,
      transform: [
        { translateX: dx * (1 - landed.value) },
        { translateY: dy * (1 - landed.value) },
        { scale: bounce.value * (1 - vanished.value) },
      ],
    };
  });
  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value * MOTION.clearFlashOpacity,
  }));

  return (
    <Animated.View style={[styles.block, { left, top, width: size, height: size }, blockStyle]}>
      <Image source={BLOCK_IMAGES[color]} style={{ width: size, height: size }} />
      {clearDelayMs !== null ? <Animated.View style={[styles.flash, flashStyle]} /> : null}
    </Animated.View>
  );
}

interface GainLabelProps {
  points: number;
  centerX: number;
  centerY: number;
  reducedMotion: boolean;
}

function GainLabel({ points, centerX, centerY, reducedMotion }: GainLabelProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(MOTION.landMs, withTiming(1, timing(MOTION.gainMs)));
  }, [progress]);

  const labelStyle = useAnimatedStyle(() => {
    const opacity =
      progress.value < GAIN_FADE_IN
        ? progress.value / GAIN_FADE_IN
        : 1 - (progress.value - GAIN_FADE_IN) / (1 - GAIN_FADE_IN);
    return {
      opacity,
      transform: [{ translateY: reducedMotion ? 0 : -MOTION.gainRise * progress.value }],
    };
  });

  return (
    <Animated.Text
      style={[styles.gain, { left: centerX - GAIN_WIDTH / 2, top: centerY - 20 }, labelStyle]}
    >
      +{points}
    </Animated.Text>
  );
}

interface MoveEffectsProps {
  move: MoveEvent;
  cellSize: number;
}

/**
 * The animations of the last move, drawn over the grid cells: the piece sliding to its cells and
 * bouncing, the cleared cells lighting up and shrinking away, and the gain of the clear.
 * Mount it with the move id as key, so that every move starts its own animations.
 */
export function MoveEffects({ move, cellSize }: MoveEffectsProps) {
  const reducedMotion = useReducedMotion();
  const { piece, col, row, placedGrid, clearedRows, clearedCols } = move;

  const isCleared = (cellCol: number, cellRow: number) =>
    clearedRows.includes(cellRow) || clearedCols.includes(cellCol);
  /** Cells disappear one after the other along their line, once the piece has landed. */
  const clearDelay = (cellCol: number, cellRow: number) =>
    MOTION.landMs +
    MOTION.landBounceMs +
    MOTION.clearStaggerMs * (clearedRows.includes(cellRow) ? cellCol : cellRow);

  const landFrom = { dx: move.from.left - col * cellSize, dy: move.from.top - row * cellSize };
  const pieceCells = piece.cells.map(([cellCol, cellRow]) => ({
    cellCol: col + cellCol,
    cellRow: row + cellRow,
  }));
  const isPieceCell = (cellCol: number, cellRow: number) =>
    pieceCells.some((cell) => cell.cellCol === cellCol && cell.cellRow === cellRow);

  const { columns, rows } = pieceSpan(piece);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {placedGrid.flatMap((gridRow, cellRow) =>
        gridRow.map((color, cellCol) =>
          color && isCleared(cellCol, cellRow) && !isPieceCell(cellCol, cellRow) ? (
            <EffectBlock
              key={`${cellCol}-${cellRow}`}
              color={color}
              left={cellCol * cellSize}
              top={cellRow * cellSize}
              size={cellSize}
              landFrom={null}
              clearDelayMs={clearDelay(cellCol, cellRow)}
              reducedMotion={reducedMotion}
            />
          ) : null,
        ),
      )}
      {pieceCells.map(({ cellCol, cellRow }) => (
        <EffectBlock
          key={`piece-${cellCol}-${cellRow}`}
          color={piece.color}
          left={cellCol * cellSize}
          top={cellRow * cellSize}
          size={cellSize}
          landFrom={landFrom}
          clearDelayMs={isCleared(cellCol, cellRow) ? clearDelay(cellCol, cellRow) : null}
          reducedMotion={reducedMotion}
        />
      ))}
      {move.clearPoints > 0 ? (
        <GainLabel
          points={move.clearPoints}
          centerX={(col + columns / 2) * cellSize}
          centerY={(row + rows / 2) * cellSize}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
  },
  flash: {
    ...StyleSheet.absoluteFill,
    margin: 2,
    borderRadius: 10,
    backgroundColor: UI.text,
  },
  gain: {
    position: 'absolute',
    width: GAIN_WIDTH,
    textAlign: 'center',
    color: UI.accent,
    fontFamily: FONTS.title,
    fontSize: 30,
    textShadowColor: UI.background,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
