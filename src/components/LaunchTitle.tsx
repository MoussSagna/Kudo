import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useRiseIn, type RiseIn } from '../hooks/useRiseIn';
import { FONTS, UI } from '../theme';

interface LaunchTitleProps {
  rise?: RiseIn;
}

export function LaunchTitle({ rise }: LaunchTitleProps) {
  const riseStyle = useRiseIn(rise);

  return <Animated.Text style={[styles.title, riseStyle]}>Kubo</Animated.Text>;
}

const styles = StyleSheet.create({
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 84,
    marginTop: 18,
  },
});
