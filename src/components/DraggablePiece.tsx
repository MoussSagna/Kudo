import { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  ReduceMotion,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type AnimatedRef,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Piece } from '../game/pieces';
import { targetCell } from '../game/targetCell';
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
  /** 0 when the piece has just been drawn, 1 once it has grown into place. */
  const appeared = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    appeared.value = withDelay(
      index * MOTION.trayAppearStaggerMs,
      withTiming(1, { duration: MOTION.trayAppearMs, reduceMotion: ReduceMotion.Never }),
    );
  }, [appeared, index]);

  const { columns, rows } = pieceSpan(piece);
  const pickedUpScale = gridCellSize / trayCellSize;
  const pickedUpWidth = columns * gridCellSize;
  const pickedUpHeight = rows * gridCellSize;

  const returnToTray = () => {
    'worklet';
    dragX.value = withSpring(0, MOTION.returnSpring);
    dragY.value = withSpring(0, MOTION.returnSpring);
    lift.value = withSpring(0, MOTION.returnSpring);
    scale.value = withSpring(1, MOTION.returnSpring);
  };

  const drop = (col: number, row: number, left: number, top: number) => {
    if (!onDrop(index, col, row, left, top)) {
      returnToTray();
      onReturn();
    }
  };

  const pan = Gesture.Pan()
    .enabled(enabled)
    .maxPointers(1)
    .onTouchesDown((_event, manager) => {
      if (activeIndex.get() !== NONE && activeIndex.get() !== index) {
        manager.fail();
      }
    })
    // The refs are only read when the gesture starts, on the UI thread, never during render.
    // eslint-disable-next-line react-hooks/refs
    .onStart(() => {
      activeIndex.set(index);
      const pieceBox = measure(pieceRef);
      const gridBox = measure(gridRef);
      isMeasured.value = pieceBox !== null && gridBox !== null;
      if (pieceBox && gridBox) {
        const centerX = pieceBox.pageX + pieceBox.width / 2;
        const centerY = pieceBox.pageY + pieceBox.height / 2;
        startLeft.value = centerX - pickedUpWidth / 2 - (gridBox.pageX + GRID_PADDING);
        startTop.value = centerY - pickedUpHeight / 2 - LIFT - (gridBox.pageY + GRID_PADDING);
      }
      lift.value = withTiming(LIFT, { duration: MOTION.pickUpMs });
      scale.value = withTiming(pickedUpScale, { duration: MOTION.pickUpMs });
      scheduleOnRN(onPickUp);
    })
    .onUpdate((event) => {
      dragX.value = event.translationX;
      dragY.value = event.translationY;

      const cell = isMeasured.value
        ? targetCell(
            startLeft.value + event.translationX,
            startTop.value + event.translationY,
            0,
            0,
            gridCellSize,
          )
        : null;
      const col = cell ? cell.col : NONE;
      const row = cell ? cell.row : NONE;
      if (col !== targetCol.value || row !== targetRow.value) {
        targetCol.value = col;
        targetRow.value = row;
        scheduleOnRN(onTargetChange, index, col, row);
      }
    })
    .onEnd((event, success) => {
      if (success && targetCol.value !== NONE) {
        scheduleOnRN(
          drop,
          targetCol.value,
          targetRow.value,
          startLeft.value + event.translationX,
          startTop.value + event.translationY,
        );
      } else {
        returnToTray();
        scheduleOnRN(onReturn);
      }
    })
    .onFinalize(() => {
      if (activeIndex.get() === index) {
        activeIndex.set(NONE);
      }
      if (targetCol.value !== NONE) {
        targetCol.value = NONE;
        targetRow.value = NONE;
        scheduleOnRN(onTargetChange, index, NONE, NONE);
      }
    });

  const dragStyle = useAnimatedStyle(() => ({
    zIndex: scale.value > 1 ? 1 : 0,
    opacity: appeared.value,
    transform: [
      { translateX: dragX.value },
      { translateY: dragY.value - lift.value },
      { scale: scale.value * (reducedMotion ? 1 : appeared.value) },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View ref={pieceRef} style={dragStyle}>
        <PieceView piece={piece} cellSize={trayCellSize} />
      </Animated.View>
    </GestureDetector>
  );
}
