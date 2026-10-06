import { StyleSheet, View } from 'react-native';

import type { BlockColor } from '../theme';
import { LogoBlock } from './LogoBlock';

const LOGO_GAP = 6;

const LOGO_ROWS: readonly (readonly (BlockColor | null)[])[] = [
  ['purple', 'purple', 'cyan'],
  [null, 'yellow', 'cyan'],
  ['red', 'yellow', 'yellow'],
];

export function Logo() {
  return (
    <View style={styles.grid}>
      {LOGO_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((color, columnIndex) => (
            <LogoBlock key={columnIndex} color={color} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: LOGO_GAP,
  },
  row: {
    flexDirection: 'row',
    gap: LOGO_GAP,
  },
});
