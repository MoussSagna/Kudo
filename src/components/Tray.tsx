import { StyleSheet, View } from 'react-native';

import type { Tray as TrayState } from '../game/state';
import { UI } from '../theme';
import { PieceView } from './PieceView';

/** Rows of blocks the tray leaves room for, so that its height does not depend on its pieces. */
const TRAY_ROWS = 5;

interface TrayProps {
  tray: TrayState;
  cellSize: number;
}

/** The pieces offered to the player, one per slot; a played slot stays empty. */
export function Tray({ tray, cellSize }: TrayProps) {
  return (
    <View style={[styles.panel, { height: TRAY_ROWS * cellSize }]}>
      {tray.map((piece, index) => (
        <View key={index} style={styles.slot}>
          {piece ? <PieceView piece={piece} cellSize={cellSize} /> : null}
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
