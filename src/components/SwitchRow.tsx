import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MOTION } from '../motion';
import { BLOCK_COLORS, FONTS, UI } from '../theme';

const TRACK_WIDTH = 60;
const TRACK_HEIGHT = 34;
const THUMB_SIZE = 26;
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - 2 * THUMB_INSET;

interface SwitchRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

/**
 * A setting that is on or off. The whole row is the switch: it is one large touch target, and
 * screen readers announce its label, its description and its state.
 */
export function SwitchRow({ label, description, value, onChange }: SwitchRowProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: MOTION.switchMs });
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [UI.dotInactive, BLOCK_COLORS.green],
    ),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={styles.row}
    >
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  texts: {
    flex: 1,
  },
  label: {
    color: UI.text,
    fontFamily: FONTS.bodyBold,
    fontSize: 17,
    lineHeight: 22,
  },
  description: {
    marginTop: 1,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 21,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    padding: THUMB_INSET,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: UI.text,
  },
});
