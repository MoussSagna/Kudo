import type { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { Cell } from '../game/pieces';
import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, UI, type BlockColor } from '../theme';

export const MINI_CELL_SIZE = 44;
export const MINI_GRID_PADDING = 6;

const GHOST_OPACITY = 0.3;

export type MiniGridRows = readonly (readonly (BlockColor | null)[])[];

interface MiniGridProps {
  rows: MiniGridRows;
  /** Translucent preview of a piece about to be placed. */
  ghost?: { color: BlockColor; cells: readonly Cell[] };
  /** Decorations drawn over the grid, positioned from the panel's top-left corner. */
  children?: ReactNode;
}

/** A small, static grid used as an illustration. */
export function MiniGrid({ rows, ghost, children }: MiniGridProps) {
  return (
    <View style={styles.panel}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((color, columnIndex) => (
            <Image
              key={columnIndex}
              source={color ? BLOCK_IMAGES[color] : CELL_EMPTY_IMAGE}
              style={styles.cell}
            />
          ))}
        </View>
      ))}
      {ghost?.cells.map(([column, row]) => (
        <Image
          key={`${column}-${row}`}
          source={BLOCK_IMAGES[ghost.color]}
          style={[
            styles.cell,
            styles.ghost,
            {
              left: MINI_GRID_PADDING + column * MINI_CELL_SIZE,
              top: MINI_GRID_PADDING + row * MINI_CELL_SIZE,
            },
          ]}
        />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: MINI_GRID_PADDING,
    borderRadius: 22,
    backgroundColor: UI.panel,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: MINI_CELL_SIZE,
    height: MINI_CELL_SIZE,
  },
  ghost: {
    position: 'absolute',
    opacity: GHOST_OPACITY,
  },
});
