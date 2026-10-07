import { StyleSheet, View } from 'react-native';

const SIZE = 20;
const STROKE = 2.5;

interface ShareIconProps {
  color: string;
}

/** An arrow rising out of a tray, drawn with plain views. */
export function ShareIcon({ color }: ShareIconProps) {
  const fill = { backgroundColor: color };

  return (
    <View style={styles.icon}>
      <View style={[styles.shaft, fill]} />
      <View style={[styles.head, styles.headLeft, fill]} />
      <View style={[styles.head, styles.headRight, fill]} />
      <View style={[styles.tray, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: SIZE,
    height: SIZE,
  },
  shaft: {
    position: 'absolute',
    left: (SIZE - STROKE) / 2,
    top: 1,
    width: STROKE,
    height: 12,
    borderRadius: STROKE / 2,
  },
  head: {
    position: 'absolute',
    top: 0,
    width: STROKE,
    height: 7.5,
    borderRadius: STROKE / 2,
  },
  headLeft: {
    left: (SIZE - STROKE) / 2 - 2.4,
    transform: [{ rotate: '45deg' }],
  },
  headRight: {
    left: (SIZE - STROKE) / 2 + 2.4,
    transform: [{ rotate: '-45deg' }],
  },
  tray: {
    position: 'absolute',
    left: 2,
    bottom: 0,
    width: 16,
    height: 8,
    borderWidth: STROKE,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
