import { Pressable, StyleSheet, View } from 'react-native';

import { UI } from '../theme';

const BUTTON_SIZE = 44;
const ICON_WIDTH = 16;
const LINE_HEIGHT = 2;
const KNOB_SIZE = 6;
const KNOB_OFFSET = 3;

interface SettingsButtonProps {
  onPress: () => void;
}

/** The round button opening the settings: two sliders, drawn with views. */
export function SettingsButton({ onPress }: SettingsButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Réglages"
      onPress={onPress}
      style={styles.button}
    >
      <View style={styles.slider}>
        <View style={styles.line} />
        <View style={[styles.knob, { left: KNOB_OFFSET }]} />
      </View>
      <View style={styles.slider}>
        <View style={styles.line} />
        <View style={[styles.knob, { right: KNOB_OFFSET }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: UI.cell,
  },
  slider: {
    width: ICON_WIDTH,
    height: KNOB_SIZE,
    justifyContent: 'center',
  },
  line: {
    height: LINE_HEIGHT,
    borderRadius: LINE_HEIGHT / 2,
    backgroundColor: UI.text,
  },
  knob: {
    position: 'absolute',
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    borderWidth: LINE_HEIGHT,
    borderColor: UI.text,
    backgroundColor: UI.cell,
  },
});
