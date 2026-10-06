import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import type { Piece } from '../game/pieces';
import { PieceView } from './PieceView';

/** How far above the finger the piece is held, so that the finger does not hide it. */
const LIFT = 70;
const PICK_UP_MS = 120;
const RETURN_SPRING = { duration: 220, dampingRatio: 0.8 };
const NO_PIECE = -1;

interface DraggablePieceProps {
  piece: Piece;
  index: number;
  /** Size of a block in the tray, and on the grid once the piece is picked up. */
  trayCellSize: number;
  gridCellSize: number;
  /** Index of the tray slot being dragged, shared by the slots so that only one moves at a time. */
  activeIndex: SharedValue<number>;
}

/** A tray piece that follows the finger, at grid size, while it is dragged. */
export function DraggablePiece({
  piece,
  index,
  trayCellSize,
  gridCellSize,
  activeIndex,
}: DraggablePieceProps) {
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const lift = useSharedValue(0);
  const scale = useSharedValue(1);
  const pickedUpScale = gridCellSize / trayCellSize;

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onTouchesDown((_event, manager) => {
      if (activeIndex.get() !== NO_PIECE && activeIndex.get() !== index) {
        manager.fail();
      }
    })
    .onStart(() => {
      activeIndex.set(index);
      lift.value = withTiming(LIFT, { duration: PICK_UP_MS });
      scale.value = withTiming(pickedUpScale, { duration: PICK_UP_MS });
    })
    .onUpdate((event) => {
      dragX.value = event.translationX;
      dragY.value = event.translationY;
    })
    .onEnd(() => {
      dragX.value = withSpring(0, RETURN_SPRING);
      dragY.value = withSpring(0, RETURN_SPRING);
      lift.value = withSpring(0, RETURN_SPRING);
      scale.value = withSpring(1, RETURN_SPRING);
    })
    .onFinalize(() => {
      if (activeIndex.get() === index) {
        activeIndex.set(NO_PIECE);
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
      <Animated.View style={dragStyle}>
        <PieceView piece={piece} cellSize={trayCellSize} />
      </Animated.View>
    </GestureDetector>
  );
}
