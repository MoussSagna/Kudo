import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, TEXT_SCALE, UI } from '../theme';

const FACE_HEIGHT = 58;
const EDGE_HEIGHT = 5;

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  /** Drawn before the label. */
  icon?: ReactNode;
}

/** The main action of a screen: a yellow button with a darker bottom edge. */
export function PrimaryButton({ label, onPress, icon }: PrimaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.edge}>
      {({ pressed }) => (
        <View style={[styles.face, pressed && styles.facePressed]}>
          {icon}
          <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.label}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: {
    alignSelf: 'stretch',
    height: FACE_HEIGHT + EDGE_HEIGHT,
    borderRadius: 24,
    backgroundColor: UI.accentEdge,
  },
  face: {
    height: FACE_HEIGHT,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: UI.accent,
  },
  facePressed: {
    transform: [{ translateY: EDGE_HEIGHT / 2 }],
  },
  label: {
    color: UI.background,
    fontFamily: FONTS.title,
    fontSize: 21,
  },
});
