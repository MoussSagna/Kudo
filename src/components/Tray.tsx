import { StyleSheet, View } from 'react-native';
import type Animated from 'react-native-reanimated';
import { useSharedValue, type AnimatedRef } from 'react-native-reanimated';

import type { Tray as TrayState } from '../game/state';
import { UI } from '../theme';
import { DraggablePiece } from './DraggablePiece';
import { fitTrayCellSize } from './fitTrayCellSize';

/** Rows of blocks the tray leaves room for, so that its height does not depend on its pieces. */
const TRAY_ROWS = 5;
const NO_PIECE = -1;

interface TrayProps {
  tray: TrayState;
  /** Changes with every new tray, so that a slot starts fresh with its new piece. */
  trayKey: string;
  /** False once the game is over: pieces can no longer be picked up. */
  enabled: boolean;
  /** Usual size of a block in the tray; the longest pieces are drawn smaller to fit their slot. */
  cellSize: number;
  /** Width of the tray, shared equally by its slots. */
  width: number;
  gridCellSize: number;
  gridRef: AnimatedRef<Animated.View>;
  onTargetChange: (index: number, col: number, row: number) => void;
  onDrop: (index: number, col: number, row: number, left: number, top: number) => boolean;
  onPickUp: () => void;
  onReturn: () => void;
}

/** The pieces offered to the player, one per slot; a played slot stays empty. */
export function Tray({
  tray,
  trayKey,
  enabled,
  cellSize,
  width,
  gridCellSize,
  gridRef,
  onTargetChange,
  onDrop,
  onPickUp,
  onReturn,
}: TrayProps) {
  const activeIndex = useSharedValue(NO_PIECE);
  const height = TRAY_ROWS * cellSize;
  const slotWidth = width / Math.max(tray.length, 1);

  return (
    <View style={[styles.panel, { height }]}>
      {tray.map((piece, index) => (
        <View key={index} style={styles.slot}>
          {piece ? (
            <DraggablePiece
              key={trayKey}
              piece={piece}
              index={index}
              enabled={enabled}
              trayCellSize={fitTrayCellSize(piece, cellSize, slotWidth, height)}
              gridCellSize={gridCellSize}
              gridRef={gridRef}
              activeIndex={activeIndex}
              onTargetChange={onTargetChange}
              onDrop={onDrop}
              onPickUp={onPickUp}
              onReturn={onReturn}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.tray,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
