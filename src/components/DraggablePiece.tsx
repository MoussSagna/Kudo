import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  measure,
  ReduceMotion,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type AnimatedRef,
  type SharedValue,
  ZoomIn,
} from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

import type { Piece } from '../game/pieces';
import { targetCell } from '../game/targetCell';
import { useTrayProbe } from '../dev/useTrayProbe';
import { MOTION } from '../motion';
import { GRID_PADDING } from './Grid';
import { pieceSpan, PieceView } from './PieceView';

/** How far above the finger the piece is held, so that the finger does not hide it. */
const LIFT = 70;
const NONE = -1;

interface DraggablePieceProps {
  piece: Piece;
  index: number;
  /** False once the game is over: the piece can no longer be picked up. */
  enabled: boolean;
  /** Changes with every move played: the pieces still in the tray then go back to rest. */
  moveId: number;
  /** Size of a block in the tray, and on the grid once the piece is picked up. */
  trayCellSize: number;
  gridCellSize: number;
  /** The view of the grid panel, measured to know where the cells are on screen. */
  gridRef: AnimatedRef<Animated.View>;
  /** Index of the tray slot being dragged, shared by the slots so that only one moves at a time. */
  activeIndex: SharedValue<number>;
  /** Called when the cell aimed at changes; col and row are -1 when no cell is aimed at. */
  onTargetChange: (index: number, col: number, row: number) => void;
  /**
   * Called when the piece is released over a cell, with the position of its top-left corner in
   * points from the first grid cell; returns false when it cannot be placed there.
   */
  onDrop: (index: number, col: number, row: number, left: number, top: number) => boolean;
  onPickUp: () => void;
  /** Called when the piece goes back to the tray instead of being placed. */
  onReturn: () => void;
}

/** A tray piece that follows the finger, at grid size, while it is dragged. */
export function DraggablePiece({
  piece,
  index,
  enabled,
  moveId,
  trayCellSize,
  gridCellSize,
  gridRef,
  activeIndex,
  onTargetChange,
  onDrop,
  onPickUp,
  onReturn,
}: DraggablePieceProps) {
  const pieceRef = useAnimatedRef<Animated.View>();
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const lift = useSharedValue(0);
  const scale = useSharedValue(1);
  /** Top-left corner of the picked-up piece before any drag, relative to the first grid cell. */
  const startLeft = useSharedValue(0);
  const startTop = useSharedValue(0);
  const isMeasured = useSharedValue(false);
  const targetCol = useSharedValue(NONE);
  const targetRow = useSharedValue(NONE);
  const isDragging = useSharedValue(false);
  const reducedMotion = useReducedMotion();

  const { columns, rows } = pieceSpan(piece);
  const pickedUpScale = gridCellSize / trayCellSize;
  const pickedUpWidth = columns * gridCellSize;
  const pickedUpHeight = rows * gridCellSize;

  const returnToTray = () => {
    'worklet';
    dragX.set(withSpring(0, MOTION.returnSpring));
    dragY.set(withSpring(0, MOTION.returnSpring));
    lift.set(withSpring(0, MOTION.returnSpring));
    scale.set(withSpring(1, MOTION.returnSpring));
  };

  // A piece at rest is visible, at its place, at its normal scale: these are the values the
  // shared values start with, and every way out of a gesture leads back to them. As a last
  // resort, once a move has been played, a piece that is still in the tray and is not being
  // dragged goes back to rest, whatever happened to it.
  useEffect(() => {
    scheduleOnUI(() => {
      'worklet';
      const isAtRest =
        dragX.value === 0 && dragY.value === 0 && lift.value === 0 && scale.value === 1;
      if (!isDragging.value && !isAtRest) {
        dragX.set(withSpring(0, MOTION.returnSpring));
        dragY.set(withSpring(0, MOTION.returnSpring));
        lift.set(withSpring(0, MOTION.returnSpring));
        scale.set(withSpring(1, MOTION.returnSpring));
      }
    });
  }, [dragX, dragY, isDragging, lift, moveId, scale]);

  const drop = (col: number, row: number, left: number, top: number) => {
    if (!onDrop(index, col, row, left, top)) {
      returnToTray();
      onReturn();
    }
  };

  // The four moments of a gesture. They are plain worklets so that the stress test can run a
  // gesture through exactly the same code as the fingers do.
  const beginDrag = () => {
    'worklet';
    activeIndex.set(index);
    isDragging.set(true);
    const pieceBox = measure(pieceRef);
    const gridBox = measure(gridRef);
    isMeasured.value = pieceBox !== null && gridBox !== null;
    if (pieceBox && gridBox) {
      const centerX = pieceBox.pageX + pieceBox.width / 2;
      const centerY = pieceBox.pageY + pieceBox.height / 2;
      startLeft.value = centerX - pickedUpWidth / 2 - (gridBox.pageX + GRID_PADDING);
      startTop.value = centerY - pickedUpHeight / 2 - LIFT - (gridBox.pageY + GRID_PADDING);
    }
    lift.set(withTiming(LIFT, { duration: MOTION.pickUpMs }));
    scale.set(withTiming(pickedUpScale, { duration: MOTION.pickUpMs }));
    scheduleOnRN(onPickUp);
  };

  const moveDrag = (translationX: number, translationY: number) => {
    'worklet';
    dragX.set(translationX);
    dragY.set(translationY);

    const cell = isMeasured.value
      ? targetCell(startLeft.value + translationX, startTop.value + translationY, 0, 0, gridCellSize)
      : null;
    const col = cell ? cell.col : NONE;
    const row = cell ? cell.row : NONE;
    if (col !== targetCol.value || row !== targetRow.value) {
      targetCol.value = col;
      targetRow.value = row;
      scheduleOnRN(onTargetChange, index, col, row);
    }
  };

  const endDrag = (translationX: number, translationY: number, success: boolean) => {
    'worklet';
    if (success && targetCol.value !== NONE) {
      scheduleOnRN(
        drop,
        targetCol.value,
        targetRow.value,
        startLeft.value + translationX,
        startTop.value + translationY,
      );
    } else {
      returnToTray();
      scheduleOnRN(onReturn);
    }
  };

  const finalizeDrag = () => {
    'worklet';
    isDragging.set(false);
    if (activeIndex.get() === index) {
      activeIndex.set(NONE);
    }
    if (targetCol.value !== NONE) {
      targetCol.value = NONE;
      targetRow.value = NONE;
      scheduleOnRN(onTargetChange, index, NONE, NONE);
    }
  };

  /** Frees the tray when the last finger leaves a piece that was touched but not dragged. */
  const releaseClaim = (event: { numberOfTouches: number }) => {
    'worklet';
    if (event.numberOfTouches === 0 && !isDragging.value && activeIndex.get() === index) {
      activeIndex.set(NONE);
    }
  };

  const pan = Gesture.Pan()
    .enabled(enabled)
    .maxPointers(1)
    // The first finger down claims the tray, before the gesture is even recognized: a second
    // finger on another piece is refused, so that two pieces are never dragged together.
    .onTouchesDown((_event, manager) => {
      if (activeIndex.get() === NONE) {
        activeIndex.set(index);
      } else if (activeIndex.get() !== index) {
        manager.fail();
      }
    })
    .onTouchesUp(releaseClaim)
    .onTouchesCancelled(releaseClaim)
    // The refs are only read when the gesture starts, on the UI thread, never during render.
    // eslint-disable-next-line react-hooks/refs
    .onStart(beginDrag)
    .onUpdate((event) => moveDrag(event.translationX, event.translationY))
    .onEnd((event, success) => endDrag(event.translationX, event.translationY, success))
    .onFinalize(finalizeDrag);

  useTrayProbe({
    index,
    pieceId: piece.id,
    gridCellSize,
    pieceRef,
    values: { dragX, dragY, lift, scale, startLeft, startTop },
    beginDrag,
    moveDrag,
    endDrag,
    finalizeDrag,
  });

  // The appearance of a new piece is an entering animation, played over a piece that is already
  // visible for React: if it is interrupted or never runs, the piece is simply there.
  const appear = (reducedMotion ? FadeIn : ZoomIn)
    .delay(index * MOTION.trayAppearStaggerMs)
    .duration(MOTION.trayAppearMs)
    .reduceMotion(ReduceMotion.Never);

  const dragStyle = useAnimatedStyle(() => ({
    zIndex: scale.value > 1 ? 1 : 0,
    transform: [
      { translateX: dragX.value },
      { translateY: dragY.value - lift.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View ref={pieceRef} style={dragStyle}>
        <Animated.View entering={appear} style={styles.appearing}>
          <PieceView piece={piece} cellSize={trayCellSize} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  appearing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
