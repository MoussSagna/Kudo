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
import { PrimaryButton } from '../components/PrimaryButton';
import { ShareIcon } from '../components/ShareIcon';
import { dateFromDailySeed, formatWeekdayAndDate } from '../game/dates';
import { dayOfSeed, formatHoursAndMinutes } from '../game/days';
import { formatScore } from '../game/formatScore';
import type { GameState } from '../game/state';
import { useIsCompactScreen } from '../hooks/useIsCompactScreen';
import { useTimeUntilNextDay } from '../hooks/useTimeUntilNextDay';
import { MOTION } from '../motion';
import { FONTS, TEXT_SCALE, UI } from '../theme';

const MINI_CELL_SIZE = 22.5;
const COMPACT_MINI_CELL_SIZE = 19;

interface ResultScreenProps {
  game: GameState;
  isNewRecord: boolean;
  onShare: () => void;
  /** Starts a new free game: « Rejouer » after a free game, « Partie libre » after the daily one. */
  onStartFreeGame: () => void;
  onHome: () => void;
}

/**
 * The end of a game: score, final grid, statistics, and ways to share it, play a free game or go
 * back to the home screen. The daily challenge also shows its day and, until that day is over,
 * the time left before the next challenge.
 */
export function ResultScreen({
  game,
  isNewRecord,
  onShare,
  onStartFreeGame,
  onHome,
}: ResultScreenProps) {
  const insets = useSafeAreaInsets();
  const isCompact = useIsCompactScreen();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: MOTION.resultFadeMs,
      reduceMotion: ReduceMotion.Never,
    });
  }, [opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const isDaily = game.mode === 'daily';
  const nextDailyInMs = useTimeUntilNextDay(isDaily ? dayOfSeed(game.seed) : null);

  const stats = [
    { value: String(game.stats.piecesPlaced), label: 'pièces posées' },
    { value: String(game.stats.linesCleared), label: 'lignes effacées' },
    { value: `×${game.stats.bestStreak}`, label: 'meilleure série' },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, fadeStyle]}>
      <LinearGradient
        colors={[UI.backgroundTop, UI.background]}
        style={[
          styles.screen,
          { paddingTop: insets.top + (isCompact ? 12 : 24), paddingBottom: insets.bottom },
        ]}
      >
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          maxFontSizeMultiplier={TEXT_SCALE.title}
          style={styles.day}
        >
          {isDaily
            ? `Défi du ${formatWeekdayAndDate(dateFromDailySeed(game.seed))}`.toUpperCase()
            : ''}
        </Text>
        <Text
          accessibilityRole="header"
          maxFontSizeMultiplier={TEXT_SCALE.title}
          style={[styles.title, isCompact && styles.titleCompact]}
        >
          Partie terminée
        </Text>
        <Text maxFontSizeMultiplier={TEXT_SCALE.fixed} style={[styles.score, isCompact && styles.scoreCompact]}>
          {formatScore(game.score)}
        </Text>
        <View style={styles.recordSlot}>
          {isNewRecord ? (
            <View style={styles.record}>
              <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.recordLabel}>
                ★ Nouveau record
              </Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.grid, isCompact && styles.tight]}>
          <Grid grid={game.grid} cellSize={isCompact ? COMPACT_MINI_CELL_SIZE : MINI_CELL_SIZE} />
        </View>
        <View style={[styles.stats, isCompact && styles.tight]}>
          {stats.map(({ value, label }) => (
            <View key={label} accessible style={[styles.stat, isCompact && styles.statCompact]}>
              <Text maxFontSizeMultiplier={TEXT_SCALE.fixed} style={styles.statValue}>{value}</Text>
              <Text maxFontSizeMultiplier={TEXT_SCALE.fixed} style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
        {nextDailyInMs === null ? null : (
          <Text
            maxFontSizeMultiplier={TEXT_SCALE.body}
            style={[styles.nextDaily, isCompact && styles.tight]}
          >
            Prochain défi dans{' '}
            <Text style={styles.nextDailyTime}>{formatHoursAndMinutes(nextDailyInMs)}</Text>
          </Text>
        )}
        <View
          style={[
            styles.share,
            nextDailyInMs !== null && styles.shareAfterNextDaily,
            isCompact && styles.tight,
          ]}
        >
          <PrimaryButton
            label="Partager mon score"
            onPress={onShare}
            icon={<ShareIcon color={UI.background} />}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onStartFreeGame}
          style={[styles.secondaryButton, isCompact && styles.secondaryButtonCompact]}
        >
          <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.secondaryLabel}>
            {isDaily ? 'Partie libre' : 'Rejouer'}
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onHome} style={[styles.home, isCompact && styles.homeCompact]}>
          <Text maxFontSizeMultiplier={TEXT_SCALE.body} style={styles.homeLabel}>
            Retour à l&apos;accueil
          </Text>
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
  day: {
    height: 18,
    color: UI.textSoft,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.6,
  },
  title: {
    marginTop: 7,
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
  /** Short screens: the same blocks, closer to each other. */
  tight: {
    marginTop: 10,
  },
  titleCompact: {
    marginTop: 2,
    fontSize: 26,
    lineHeight: 30,
  },
  scoreCompact: {
    marginTop: 2,
    fontSize: 60,
    lineHeight: 66,
  },
  statCompact: {
    height: 60,
  },
  secondaryButtonCompact: {
    height: 48,
    marginTop: 8,
  },
  homeCompact: {
    marginTop: 0,
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
  nextDaily: {
    marginTop: 14,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 20,
  },
  nextDailyTime: {
    color: UI.text,
    fontFamily: FONTS.bodyBold,
    fontVariant: ['tabular-nums'],
  },
  share: {
    alignSelf: 'stretch',
    marginTop: 29,
  },
  shareAfterNextDaily: {
    marginTop: 14,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    height: 56,
    marginTop: 9,
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
  home: {
    height: 44,
    marginTop: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  homeLabel: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyMedium,
    fontSize: 16.5,
  },
});
