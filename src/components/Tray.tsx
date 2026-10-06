import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import type { Tray as TrayState } from '../game/state';
import { UI } from '../theme';
import { DraggablePiece } from './DraggablePiece';

/** Rows of blocks the tray leaves room for, so that its height does not depend on its pieces. */
const TRAY_ROWS = 5;
const NO_PIECE = -1;

interface TrayProps {
  tray: TrayState;
  /** Changes with every new tray, so that a slot starts fresh with its new piece. */
  draws: number;
  cellSize: number;
  gridCellSize: number;
}

/** The pieces offered to the player, one per slot; a played slot stays empty. */
export function Tray({ tray, draws, cellSize, gridCellSize }: TrayProps) {
  const activeIndex = useSharedValue(NO_PIECE);

  return (
    <View style={[styles.panel, { height: TRAY_ROWS * cellSize }]}>
      {tray.map((piece, index) => (
        <View key={index} style={styles.slot}>
          {piece ? (
            <DraggablePiece
              key={draws}
              piece={piece}
              index={index}
              trayCellSize={cellSize}
              gridCellSize={gridCellSize}
              activeIndex={activeIndex}
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
