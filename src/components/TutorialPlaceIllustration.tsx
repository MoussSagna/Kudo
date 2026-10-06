import { Image, StyleSheet, View } from 'react-native';

import type { Cell } from '../game/pieces';
import { BLOCK_IMAGES, UI } from '../theme';
import { MINI_CELL_SIZE, MINI_GRID_PADDING, MiniGrid, type MiniGridRows } from './MiniGrid';

const ROWS: MiniGridRows = [
  [null, null, null, null, null, null],
  [null, null, 'yellow', null, null, null],
  [null, null, null, null, null, null],
  ['red', 'red', null, null, null, null],
  ['red', 'green', 'green', null, 'cyan', null],
  ['green', 'green', 'purple', 'cyan', 'cyan', null],
];

/** The piece being dragged, and where it is about to land. */
const PIECE_CELLS: readonly Cell[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
];
const TARGET_CELLS: readonly Cell[] = PIECE_CELLS.map(([column, row]) => [column + 3, row + 2]);

const ARROW_COLUMN = 3;
const ARROW_HEIGHT = 40;
const ARROW_STROKE = 3;
const ARROW_HEAD = 17;

/** Tutorial step 1: a piece dragged from the tray towards the grid. */
export function TutorialPlaceIllustration() {
  return (
    <MiniGrid rows={ROWS} ghost={{ color: 'blue', cells: TARGET_CELLS }}>
      <View style={styles.arrow}>
        <View style={styles.arrowShaft} />
        <View style={[styles.arrowHead, styles.arrowHeadLeft]} />
        <View style={[styles.arrowHead, styles.arrowHeadRight]} />
      </View>
      <View style={styles.piece}>
        {PIECE_CELLS.map(([column, row]) => (
          <Image
            key={`${column}-${row}`}
            source={BLOCK_IMAGES.blue}
            style={[styles.block, { left: column * MINI_CELL_SIZE, top: row * MINI_CELL_SIZE }]}
          />
        ))}
      </View>
    </MiniGrid>
  );
}

const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    left: MINI_GRID_PADDING + (ARROW_COLUMN + 0.5) * MINI_CELL_SIZE - ARROW_HEAD / 2,
    top: 160,
    width: ARROW_HEAD,
    height: ARROW_HEIGHT,
    alignItems: 'center',
  },
  arrowShaft: {
    width: ARROW_STROKE,
    height: ARROW_HEIGHT,
    borderRadius: ARROW_STROKE / 2,
    backgroundColor: UI.accent,
  },
  arrowHead: {
    position: 'absolute',
    top: -1,
    width: ARROW_STROKE,
    height: ARROW_HEAD,
    borderRadius: ARROW_STROKE / 2,
    backgroundColor: UI.accent,
  },
  arrowHeadLeft: {
    left: 2,
    transform: [{ rotate: '45deg' }],
  },
  arrowHeadRight: {
    right: 2,
    transform: [{ rotate: '-45deg' }],
  },
  piece: {
    position: 'absolute',
    left: 124,
    top: 212,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  block: {
    position: 'absolute',
    width: MINI_CELL_SIZE,
    height: MINI_CELL_SIZE,
  },
});
