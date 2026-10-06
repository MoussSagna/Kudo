import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, UI } from '../theme';

const FACE_HEIGHT = 58;
const EDGE_HEIGHT = 5;

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
}

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.edge}>
      {({ pressed }) => (
        <View style={[styles.face, pressed && styles.facePressed]}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: {
    height: FACE_HEIGHT + EDGE_HEIGHT,
    borderRadius: 24,
    backgroundColor: UI.accentEdge,
  },
  face: {
    height: FACE_HEIGHT,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
