import { StyleSheet, View } from 'react-native';

import { GRID_SIZE, UI } from '../theme';

/** How far the frame goes beyond the cells of its row. */
const OVERFLOW = 3;

interface RowMarkProps {
  row: number;
  cellSize: number;
}

function rowFrame({ row, cellSize }: RowMarkProps) {
  return {
    left: -OVERFLOW,
    top: row * cellSize - OVERFLOW,
    width: GRID_SIZE * cellSize + 2 * OVERFLOW,
    height: cellSize + 2 * OVERFLOW,
  };
}

/** A yellow frame around the row the player has to complete. */
export function RowOutline(props: RowMarkProps) {
  return <View pointerEvents="none" style={[styles.mark, styles.outline, rowFrame(props)]} />;
}

/** A pale band over the row that was just cleared. */
export function ClearedRowBand(props: RowMarkProps) {
  return <View pointerEvents="none" style={[styles.mark, styles.band, rowFrame(props)]} />;
}

const styles = StyleSheet.create({
  mark: {
    position: 'absolute',
    borderRadius: 14,
  },
  outline: {
    borderWidth: 3,
    borderColor: UI.accent,
  },
  band: {
    opacity: 0.14,
    backgroundColor: UI.text,
  },
});
