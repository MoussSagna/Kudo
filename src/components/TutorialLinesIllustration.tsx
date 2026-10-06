import { StyleSheet, Text, View } from 'react-native';

import { FONTS, UI } from '../theme';
import { MINI_CELL_SIZE, MINI_GRID_PADDING, MiniGrid, type MiniGridRows } from './MiniGrid';

const ROWS: MiniGridRows = [
  [null, null, 'green', null, null, null],
  [null, null, 'green', null, 'yellow', null],
  ['red', 'red', 'green', 'blue', 'blue', 'orange'],
  [null, null, 'green', null, null, null],
  ['purple', null, 'green', null, 'cyan', null],
  ['purple', 'purple', 'green', 'cyan', 'cyan', null],
];

const FULL_LINE_INDEX = 2;
const OUTLINE_MARGIN = 3;
const OUTLINE_LENGTH = ROWS.length * MINI_CELL_SIZE + OUTLINE_MARGIN * 2;
const OUTLINE_THICKNESS = MINI_CELL_SIZE + OUTLINE_MARGIN * 2;
const OUTLINE_START = MINI_GRID_PADDING - OUTLINE_MARGIN;
const OUTLINE_LINE_OFFSET = OUTLINE_START + FULL_LINE_INDEX * MINI_CELL_SIZE;

/** Tutorial step 2: a full row and a full column, cleared together. */
export function TutorialLinesIllustration() {
  return (
    <MiniGrid rows={ROWS}>
      <View style={[styles.outline, styles.rowOutline]} />
      <View style={[styles.outline, styles.columnOutline]} />
      <View style={styles.badgeEdge}>
        <View style={styles.badgeFace}>
          <Text style={styles.badgeLabel}>+40</Text>
        </View>
      </View>
    </MiniGrid>
  );
}

const styles = StyleSheet.create({
  outline: {
    position: 'absolute',
    borderWidth: 2.5,
    borderRadius: 13,
    borderColor: UI.accent,
  },
  rowOutline: {
    left: OUTLINE_START,
    top: OUTLINE_LINE_OFFSET,
    width: OUTLINE_LENGTH,
    height: OUTLINE_THICKNESS,
  },
  columnOutline: {
    left: OUTLINE_LINE_OFFSET,
    top: OUTLINE_START,
    width: OUTLINE_THICKNESS,
    height: OUTLINE_LENGTH,
  },
  badgeEdge: {
    position: 'absolute',
    right: -16,
    top: -16,
    width: 70,
    height: 46,
    borderRadius: 23,
    backgroundColor: UI.accentEdge,
  },
  badgeFace: {
    height: 41,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.accent,
  },
  badgeLabel: {
    color: UI.background,
    fontFamily: FONTS.title,
    fontSize: 22,
  },
});
