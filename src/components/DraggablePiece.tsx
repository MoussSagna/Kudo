import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type AnimatedRef,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Piece } from '../game/pieces';
import { targetCell } from '../game/targetCell';
import { GRID_PADDING } from './Grid';
import { pieceSpan, PieceView } from './PieceView';

/** How far above the finger the piece is held, so that the finger does not hide it. */
const LIFT = 70;
const PICK_UP_MS = 120;
const RETURN_SPRING = { duration: 220, dampingRatio: 0.8 };
const NONE = -1;

interface DraggablePieceProps {
  piece: Piece;
  index: number;
  /** Size of a block in the tray, and on the grid once the piece is picked up. */
  trayCellSize: number;
  gridCellSize: number;
  /** The view of the grid panel, measured to know where the cells are on screen. */
  gridRef: AnimatedRef<Animated.View>;
  /** Index of the tray slot being dragged, shared by the slots so that only one moves at a time. */
  activeIndex: SharedValue<number>;
  /** Called when the cell aimed at changes; col and row are -1 when no cell is aimed at. */
  onTargetChange: (index: number, col: number, row: number) => void;
}

/** A tray piece that follows the finger, at grid size, while it is dragged. */
export function DraggablePiece({
  piece,
  index,
  trayCellSize,
  gridCellSize,
  gridRef,
  activeIndex,
  onTargetChange,
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

  const { columns, rows } = pieceSpan(piece);
  const pickedUpScale = gridCellSize / trayCellSize;
  const pickedUpWidth = columns * gridCellSize;
  const pickedUpHeight = rows * gridCellSize;

  const pan = Gesture.Pan()
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
      lift.value = withTiming(LIFT, { duration: PICK_UP_MS });
      scale.value = withTiming(pickedUpScale, { duration: PICK_UP_MS });
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
    .onEnd(() => {
      dragX.value = withSpring(0, RETURN_SPRING);
      dragY.value = withSpring(0, RETURN_SPRING);
      lift.value = withSpring(0, RETURN_SPRING);
      scale.value = withSpring(1, RETURN_SPRING);
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
    transform: [
      { translateX: dragX.value },
      { translateY: dragY.value - lift.value },
      { scale: scale.value },
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
