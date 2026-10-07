import { StyleSheet, View } from 'react-native';
import type Animated from 'react-native-reanimated';
import { useSharedValue, type AnimatedRef } from 'react-native-reanimated';

import type { Tray as TrayState } from '../game/state';
import { UI } from '../theme';
import { DraggablePiece } from './DraggablePiece';
import { trayCellSize } from './trayCellSize';

const NO_PIECE = -1;

interface TrayProps {
  tray: TrayState;
  /** Changes with every new tray, so that a slot starts fresh with its new piece. */
  trayKey: string;
  /** False once the game is over: pieces can no longer be picked up. */
  enabled: boolean;
  /** Width of the tray, shared equally by its slots. */
  width: number;
  height: number;
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
  width,
  height,
  gridCellSize,
  gridRef,
  onTargetChange,
  onDrop,
  onPickUp,
  onReturn,
}: TrayProps) {
  const activeIndex = useSharedValue(NO_PIECE);
  const cellSize = trayCellSize(width / Math.max(tray.length, 1), height);

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
              trayCellSize={cellSize}
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
