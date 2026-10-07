import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Grid } from '../components/Grid';
import { formatScore } from '../game/formatScore';
import type { GameState } from '../game/state';
import { MOTION } from '../motion';
import { FONTS, UI } from '../theme';

const MINI_CELL_SIZE = 22.5;

interface ResultScreenProps {
  game: GameState;
  isNewRecord: boolean;
  onRestart: () => void;
}

/** The end of a game: score, final grid, statistics, and a way to play again. */
export function ResultScreen({ game, isNewRecord, onRestart }: ResultScreenProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: MOTION.resultFadeMs,
      reduceMotion: ReduceMotion.Never,
    });
  }, [opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const stats = [
    { value: String(game.stats.piecesPlaced), label: 'pièces posées' },
    { value: String(game.stats.linesCleared), label: 'lignes effacées' },
    { value: `×${game.stats.bestStreak}`, label: 'meilleure série' },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, fadeStyle]}>
      <LinearGradient
        colors={[UI.backgroundTop, UI.background]}
        style={[styles.screen, { paddingTop: insets.top + 49, paddingBottom: insets.bottom }]}
      >
        <Text style={styles.title}>Partie terminée</Text>
        <Text style={styles.score}>{formatScore(game.score)}</Text>
        <View style={styles.recordSlot}>
          {isNewRecord ? (
            <View style={styles.record}>
              <Text style={styles.recordLabel}>★ Nouveau record</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.grid}>
          <Grid grid={game.grid} cellSize={MINI_CELL_SIZE} />
        </View>
        <View style={styles.stats}>
          {stats.map(({ value, label }) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={onRestart} style={styles.secondaryButton}>
          <Text style={styles.secondaryLabel}>Rejouer</Text>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 30,
    lineHeight: 36,
  },
  score: {
    marginTop: 20,
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 88,
    lineHeight: 96,
  },
  recordSlot: {
    height: 32,
    marginTop: 4,
  },
  record: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: UI.accent,
  },
  recordLabel: {
    color: UI.background,
    fontFamily: FONTS.title,
    fontSize: 15,
  },
  grid: {
    marginTop: 22,
  },
  stats: {
    marginTop: 22,
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 10,
  },
  stat: {
    flex: 1,
    height: 76,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.cell,
  },
  statValue: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 24.5,
    lineHeight: 30,
  },
  statLabel: {
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    height: 56,
    marginTop: 29,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.cell,
  },
  secondaryLabel: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 18,
  },
});
