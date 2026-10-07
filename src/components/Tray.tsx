import { StyleSheet, View } from 'react-native';
import type Animated from 'react-native-reanimated';
import { useSharedValue, type AnimatedRef } from 'react-native-reanimated';

import type { Tray as TrayState } from '../game/state';
import { UI } from '../theme';
import { DraggablePiece } from './DraggablePiece';

/** Rows of blocks the tray leaves room for, so that its height does not depend on its pieces. */
const TRAY_ROWS = 5;
const NO_PIECE = -1;

interface TrayProps {
  tray: TrayState;
  /** Changes with every new tray, so that a slot starts fresh with its new piece. */
  trayKey: string;
  /** False once the game is over: pieces can no longer be picked up. */
  enabled: boolean;
  cellSize: number;
  gridCellSize: number;
  gridRef: AnimatedRef<Animated.View>;
  onTargetChange: (index: number, col: number, row: number) => void;
  onDrop: (index: number, col: number, row: number, left: number, top: number) => boolean;
}

/** The pieces offered to the player, one per slot; a played slot stays empty. */
export function Tray({
  tray,
  trayKey,
  enabled,
  cellSize,
  gridCellSize,
  gridRef,
  onTargetChange,
  onDrop,
}: TrayProps) {
  const activeIndex = useSharedValue(NO_PIECE);

  return (
    <View style={[styles.panel, { height: TRAY_ROWS * cellSize }]}>
      {tray.map((piece, index) => (
        <View key={index} style={styles.slot}>
          {piece ? (
            <DraggablePiece
              key={trayKey}
              piece={piece}
              index={index}
              enabled={enabled}
              trayCellSize={cellSize}
              gridCellSize={gridCellSize}
              gridRef={gridRef}
              activeIndex={activeIndex}
              onTargetChange={onTargetChange}
              onDrop={onDrop}
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
