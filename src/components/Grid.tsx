import { Image, StyleSheet, View } from 'react-native';

import type { Grid as GridState } from '../game/state';
import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, UI } from '../theme';

export const GRID_PADDING = 6;

interface GridProps {
  grid: GridState;
  cellSize: number;
}

/** The board: one block image per occupied cell, an empty-cell image elsewhere. */
export function Grid({ grid, cellSize }: GridProps) {
  const cellStyle = { width: cellSize, height: cellSize };

  return (
    <View style={styles.panel}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((color, col) => (
            <Image
              key={col}
              source={color ? BLOCK_IMAGES[color] : CELL_EMPTY_IMAGE}
              style={cellStyle}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: GRID_PADDING,
    borderRadius: 22,
    backgroundColor: UI.panel,
  },
  row: {
    flexDirection: 'row',
  },
});
