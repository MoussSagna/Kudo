import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chevron } from '../components/Chevron';
import { Logo } from '../components/Logo';
import { PrimaryButton } from '../components/PrimaryButton';
import { SettingsButton } from '../components/SettingsButton';
import type { DailyStatus } from '../game/daily';
import { capitalize, formatWeekdayAndDate } from '../game/dates';
import { formatScore } from '../game/formatScore';
import { BLOCK_COLORS, FONTS, UI } from '../theme';

const MIN_TOUCH_SIZE = 44;
const DAILY_BUTTON_LABELS: Readonly<Record<DailyStatus['kind'], string>> = {
  new: 'Jouer',
  inProgress: 'Reprendre',
  done: 'Voir',
};
/** The top bar holds the streak badge, when there is a streak, and the settings button. */
const TOP_BAR_TOP = 13;
const TOP_BAR_HEIGHT = 44;
const MIN_BOTTOM_PADDING = 24;

interface HomeScreenProps {
  /** The day of the daily challenge. */
  today: Date;
  /** Where today's challenge stands. */
  daily: DailyStatus;
  /** Consecutive days with a finished challenge, as it stands today. */
  streak: number;
  freeBestScore: number;
  /** Plays or resumes today's challenge, or shows it again once it is finished. */
  onOpenDaily: () => void;
  onPlayFree: () => void;
  onShowTutorial: () => void;
  onOpenSettings: () => void;
}

/** Where the app opens: the daily challenge, the free game, and the way back to the tutorial. */
export function HomeScreen({
  today,
  daily,
  streak,
  freeBestScore,
  onOpenDaily,
  onPlayFree,
  onShowTutorial,
  onOpenSettings,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[UI.backgroundTop, UI.background]}
      style={[
        styles.screen,
        {
          paddingTop: insets.top + TOP_BAR_TOP,
          paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
        },
      ]}
    >
      <View style={styles.topBar}>
        {streak >= 1 ? (
          <View style={styles.streak}>
            <View style={styles.flame} />
            <Text style={styles.streakLabel}>
              Série : {streak} {streak > 1 ? 'jours' : 'jour'}
            </Text>
          </View>
        ) : null}
        <View style={styles.settings}>
          <SettingsButton onPress={onOpenSettings} />
        </View>
      </View>

      <View style={styles.brand}>
        <Logo blockSize={40} gap={4} />
        <Text style={styles.name}>Kubo</Text>
        <Text style={styles.tagline}>Un puzzle par jour.</Text>
      </View>

      <View style={styles.daily}>
        <Text style={styles.dailyLabel}>DÉFI DU JOUR</Text>
        <Text style={styles.dailyDate}>
          {daily.kind === 'done' ? 'Défi terminé' : capitalize(formatWeekdayAndDate(today))}
        </Text>
        <Text style={styles.dailyText}>
          {daily.kind === 'done'
            ? `Ton score : ${formatScore(daily.game.score)} points. Reviens demain pour le prochain défi.`
            : 'Une seule tentative. Les mêmes pièces pour tout le monde.'}
        </Text>
        <View style={styles.dailyButton}>
          <PrimaryButton label={DAILY_BUTTON_LABELS[daily.kind]} onPress={onOpenDaily} />
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={onPlayFree} style={styles.free}>
        <View>
          <Text style={styles.freeTitle}>Partie libre</Text>
          <Text style={styles.freeBest}>Meilleur score : {formatScore(freeBestScore)}</Text>
        </View>
        <Chevron direction="right" color={UI.textSoft} size={11} />
      </Pressable>

      <Pressable accessibilityRole="button" onPress={onShowTutorial} style={styles.help}>
        <Text style={styles.helpLabel}>Comment jouer ?</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: 'row',
  },
  streak: {
    height: TOP_BAR_HEIGHT,
    paddingLeft: 20,
    paddingRight: 16,
    borderRadius: TOP_BAR_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: UI.cell,
  },
  settings: {
    marginLeft: 'auto',
  },
  /** A drop with its point up: a square with one sharp corner, turned by 45 degrees. */
  flame: {
    width: 11,
    height: 11,
    marginTop: 3,
    borderWidth: 2.5,
    borderRadius: 6,
    borderTopLeftRadius: 1,
    borderColor: BLOCK_COLORS.orange,
    transform: [{ rotate: '45deg' }],
  },
  streakLabel: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 15,
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  name: {
    marginTop: 8,
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 76,
    lineHeight: 88,
  },
  tagline: {
    marginTop: 7,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 17,
  },
  daily: {
    paddingHorizontal: 23,
    paddingTop: 22,
    paddingBottom: 18,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.cell,
  },
  dailyLabel: {
    color: UI.accent,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
  },
  dailyDate: {
    marginTop: 7,
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 30,
    lineHeight: 36,
  },
  dailyText: {
    marginTop: 8,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 21.5,
  },
  dailyButton: {
    marginTop: 18,
  },
  free: {
    height: 78,
    marginTop: 14,
    paddingLeft: 21,
    paddingRight: 28,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: UI.tray,
  },
  freeTitle: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 18.5,
  },
  freeBest: {
    marginTop: 2,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
  },
  help: {
    alignSelf: 'center',
    height: MIN_TOUCH_SIZE,
    marginTop: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  helpLabel: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyMedium,
    fontSize: 16.5,
  },
});
