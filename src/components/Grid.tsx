import { Image, StyleSheet, View } from 'react-native';

import type { Piece } from '../game/pieces';
import type { Grid as GridState } from '../game/state';
import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, UI } from '../theme';

export const GRID_PADDING = 6;

const PREVIEW_OPACITY = 0.4;

/** Where a dragged piece would land: its top-left corner is at (col, row). */
export interface GridPreview {
  piece: Piece;
  col: number;
  row: number;
}

interface GridProps {
  grid: GridState;
  cellSize: number;
  preview?: GridPreview | null;
}

/**
 * The board: one block image per occupied cell, an empty-cell image elsewhere, and the
 * translucent cells of the piece being dragged when it can be placed.
 */
export function Grid({ grid, cellSize, preview }: GridProps) {
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
      {preview?.piece.cells.map(([cellCol, cellRow]) => (
        <Image
          key={`${cellCol}-${cellRow}`}
          source={BLOCK_IMAGES[preview.piece.color]}
          style={[
            cellStyle,
            styles.preview,
            {
              left: GRID_PADDING + (preview.col + cellCol) * cellSize,
              top: GRID_PADDING + (preview.row + cellRow) * cellSize,
            },
          ]}
        />
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
  preview: {
    position: 'absolute',
    opacity: PREVIEW_OPACITY,
  },
});
