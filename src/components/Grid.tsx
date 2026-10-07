import { Image, StyleSheet, View } from 'react-native';

import type { Piece } from '../game/pieces';
import type { Grid as GridState } from '../game/state';
import type { MoveEvent } from '../hooks/useGame';
import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, UI } from '../theme';
import { MoveEffects } from './MoveEffects';

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
  /** The last move played, animated over the cells. */
  lastMove?: MoveEvent | null;
}

/**
 * The board: one block image per occupied cell, an empty-cell image elsewhere, the translucent
 * cells of the piece being dragged when it can be placed, and the animations of the last move.
 */
export function Grid({ grid, cellSize, preview, lastMove }: GridProps) {
  const cellStyle = { width: cellSize, height: cellSize };
  /** The blocks of the last piece placed are drawn by its animation, not by the grid. */
  const isDrawnByEffects = (col: number, row: number) =>
    lastMove?.piece.cells.some(
      ([cellCol, cellRow]) => lastMove.col + cellCol === col && lastMove.row + cellRow === row,
    ) ?? false;

  return (
    <View style={styles.panel}>
      <View>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((color, col) => (
              <Image
                key={col}
                source={
                  color && !isDrawnByEffects(col, rowIndex) ? BLOCK_IMAGES[color] : CELL_EMPTY_IMAGE
                }
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
              { left: (preview.col + cellCol) * cellSize, top: (preview.row + cellRow) * cellSize },
            ]}
          />
        ))}
        {lastMove ? <MoveEffects key={lastMove.id} move={lastMove} cellSize={cellSize} /> : null}
      </View>
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
