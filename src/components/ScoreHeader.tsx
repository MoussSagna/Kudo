import { StyleSheet, Text, View } from 'react-native';

import { FONTS, UI } from '../theme';
import { formatScore } from './formatScore';

interface ScoreHeaderProps {
  score: number;
}

export function ScoreHeader({ score }: ScoreHeaderProps) {
  return (
    <View>
      <Text style={styles.label}>SCORE</Text>
      <Text style={styles.score}>{formatScore(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyBold,
    fontSize: 14.5,
    letterSpacing: 0.7,
  },
  score: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 61,
    lineHeight: 67,
  },
});
