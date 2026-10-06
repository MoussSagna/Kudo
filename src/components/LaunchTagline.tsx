import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useRiseIn, type RiseIn } from '../hooks/useRiseIn';
import { FONTS, UI } from '../theme';

interface LaunchTaglineProps {
  rise?: RiseIn;
}

export function LaunchTagline({ rise }: LaunchTaglineProps) {
  const riseStyle = useRiseIn(rise);

  return <Animated.Text style={[styles.tagline, riseStyle]}>Un puzzle par jour.</Animated.Text>;
}

const styles = StyleSheet.create({
  tagline: {
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 17,
    marginTop: 2,
  },
});
