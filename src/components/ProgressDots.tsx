import { StyleSheet, View } from 'react-native';

import { UI } from '../theme';

interface ProgressDotsProps {
  count: number;
  activeIndex: number;
}

export function ProgressDots({ count, activeIndex }: ProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.dot, index === activeIndex && styles.active]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI.dotInactive,
  },
  active: {
    width: 26,
    backgroundColor: UI.accent,
  },
});
