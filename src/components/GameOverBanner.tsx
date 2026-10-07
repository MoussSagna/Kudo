import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, UI } from '../theme';
import { formatScore } from './formatScore';

interface GameOverBannerProps {
  score: number;
  onRestart: () => void;
}

/** Provisional end-of-game banner, until the end-of-game screen exists. */
export function GameOverBanner({ score, onRestart }: GameOverBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Partie terminée</Text>
      <Text style={styles.score}>{formatScore(score)}</Text>
      <Pressable accessibilityRole="button" onPress={onRestart} style={styles.button}>
        <Text style={styles.buttonLabel}>Rejouer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.cell,
  },
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 26,
  },
  score: {
    color: UI.accent,
    fontFamily: FONTS.title,
    fontSize: 44,
  },
  button: {
    minWidth: 180,
    height: 52,
    marginTop: 12,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.accent,
  },
  buttonLabel: {
    color: UI.background,
    fontFamily: FONTS.title,
    fontSize: 20,
  },
});
