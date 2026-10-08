import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { now } from '../clock';
import { Chevron } from '../components/Chevron';
import { PrimaryButton } from '../components/PrimaryButton';
import { SettingsButton } from '../components/SettingsButton';
import {
  dayKey,
  formatCountdown,
  msUntilNextDay,
  spokenHoursAndMinutes,
  weekOf,
  type DayKey,
} from '../game/days';
import { formatScore } from '../game/formatScore';
import type { Streak } from '../game/streak';
import { useIsCompactScreen } from '../hooks/useIsCompactScreen';
import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, FONTS, TEXT_SCALE, UI } from '../theme';

const BUTTON_SIZE = 44;
const DAY_SIZE = 35;
const WEEK_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEK_DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const TICK_MS = 1000;
const MIN_BOTTOM_PADDING = 23;

interface TomorrowScreenProps {
  /** The day whose challenge is finished. */
  today: DayKey;
  score: number;
  streak: Streak;
  /** Length of the streak as it stands today. */
  streakToday: number;
  onBack: () => void;
  onOpenSettings: () => void;
  onPlayFree: () => void;
  onShowResult: () => void;
  /** Called when midnight passes: the next challenge is available. */
  onDayOver: () => void;
}

/** What a screen reader says of the week: the days with a finished challenge, by their name. */
function playedDaysLabel(week: readonly DayKey[], playedDays: readonly DayKey[]): string {
  const played = WEEK_DAYS.filter((_, index) => playedDays.includes(week[index]));
  return played.length > 0
    ? `Jours joués cette semaine : ${played.join(', ')}.`
    : 'Aucun jour joué cette semaine.';
}

/** After today's challenge: the time left before the next one, and the streak to keep alive. */
export function TomorrowScreen({
  today,
  score,
  streak,
  streakToday,
  onBack,
  onOpenSettings,
  onPlayFree,
  onShowResult,
  onDayOver,
}: TomorrowScreenProps) {
  const insets = useSafeAreaInsets();
  const isCompact = useIsCompactScreen();
  const [remainingMs, setRemainingMs] = useState(() => msUntilNextDay(now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const date = now();
      if (dayKey(date) === today) {
        setRemainingMs(msUntilNextDay(date));
      } else {
        onDayOver();
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [onDayOver, today]);

  return (
    <LinearGradient colors={[UI.backgroundTop, UI.background]} style={styles.background}>
      {/* The screen only scrolls when a large system text size makes it taller than the phone. */}
      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.screen,
          {
            paddingTop: insets.top + (isCompact ? 6 : 13),
            paddingBottom: Math.max(insets.bottom, isCompact ? 12 : MIN_BOTTOM_PADDING),
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour à l'accueil"
            onPress={onBack}
            style={styles.back}
          >
            <Chevron direction="left" color={UI.text} />
          </Pressable>
          <SettingsButton onPress={onOpenSettings} />
        </View>

        <View style={[styles.summary, isCompact && styles.summaryCompact]}>
          <View style={[styles.done, isCompact && styles.doneCompact]}>
            <Image source={BLOCK_IMAGES.green} style={styles.doneBlock} />
            <View style={styles.doneCheck} />
          </View>
          <Text
            accessibilityRole="header"
            maxFontSizeMultiplier={TEXT_SCALE.title}
            style={[styles.title, isCompact && styles.titleCompact]}
          >
            Défi du jour terminé
          </Text>
          <Text
            maxFontSizeMultiplier={TEXT_SCALE.body}
            style={[styles.score, isCompact && styles.scoreCompact]}
          >
            Ton score : <Text style={styles.scoreValue}>{formatScore(score)} points</Text>
          </Text>
        </View>

        <View style={[styles.cards, isCompact && styles.cardsCompact]}>
          <View
            accessible
            accessibilityLabel={`Prochain défi dans ${spokenHoursAndMinutes(remainingMs)}. Nouvelles pièces chaque jour à minuit.`}
            style={[styles.countdown, isCompact && styles.countdownCompact]}
          >
            <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.countdownLabel}>
              PROCHAIN DÉFI DANS
            </Text>
            <Text
              maxFontSizeMultiplier={TEXT_SCALE.fixed}
              style={[styles.countdownTime, isCompact && styles.countdownTimeCompact]}
            >
              {formatCountdown(remainingMs)}
            </Text>
            <Text maxFontSizeMultiplier={TEXT_SCALE.body} style={styles.countdownText}>
              Nouvelles pièces chaque jour à minuit
            </Text>
          </View>

          <View style={[styles.streak, isCompact && styles.streakCompact]}>
            <View style={styles.streakHeader}>
              <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.streakTitle}>
                Série : {streakToday} {streakToday > 1 ? 'jours' : 'jour'}
              </Text>
              <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.streakBest}>
                Record : {streak.best}
              </Text>
            </View>
            <View
              accessible
              accessibilityLabel={playedDaysLabel(weekOf(today), streak.days)}
              style={styles.week}
            >
              {weekOf(today).map((day, index) => {
                const isPlayed = streak.days.includes(day);
                return (
                  <View key={day} style={styles.day}>
                    <Image
                      source={isPlayed ? BLOCK_IMAGES.orange : CELL_EMPTY_IMAGE}
                      style={styles.dayBlock}
                    />
                    <Text
                      maxFontSizeMultiplier={TEXT_SCALE.fixed}
                      style={[styles.dayLetter, isPlayed && styles.dayLetterPlayed]}
                    >
                      {WEEK_LETTERS[index]}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text
              maxFontSizeMultiplier={TEXT_SCALE.body}
              style={[styles.streakText, isCompact && styles.streakTextCompact]}
            >
              Reviens demain pour la prolonger.
            </Text>
          </View>
        </View>

        <PrimaryButton label="Partie libre" onPress={onPlayFree} />
        <Pressable
          accessibilityRole="button"
          onPress={onShowResult}
          style={[styles.secondaryButton, isCompact && styles.secondaryButtonCompact]}
        >
          <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.secondaryLabel}>
            Revoir mon résultat
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  screen: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.cell,
  },
  summary: {
    marginTop: 28,
    alignItems: 'center',
  },
  done: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBlock: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  /** Short screens: the same content, smaller and closer together. */
  summaryCompact: {
    marginTop: -8,
  },
  doneCompact: {
    transform: [{ scale: 0.65 }],
  },
  titleCompact: {
    marginTop: -6,
    fontSize: 25,
    lineHeight: 30,
  },
  scoreCompact: {
    marginTop: 4,
    fontSize: 15,
  },
  cardsCompact: {
    gap: 10,
  },
  countdownCompact: {
    minHeight: 116,
  },
  countdownTimeCompact: {
    fontSize: 44,
    lineHeight: 52,
  },
  streakCompact: {
    paddingTop: 14,
    paddingBottom: 12,
  },
  streakTextCompact: {
    marginTop: 8,
  },
  secondaryButtonCompact: {
    height: 48,
    marginTop: 8,
  },
  doneCheck: {
    width: 14,
    height: 26,
    marginTop: -10,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: UI.background,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    marginTop: 12,
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 30,
    lineHeight: 36,
  },
  score: {
    marginTop: 12,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 16.5,
  },
  scoreValue: {
    color: UI.text,
    fontFamily: FONTS.bodyBold,
  },
  cards: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 25,
    paddingVertical: 12,
  },
  countdown: {
    minHeight: 156,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.cell,
  },
  countdownLabel: {
    color: UI.accent,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
  },
  countdownTime: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 56,
    lineHeight: 66,
    fontVariant: ['tabular-nums'],
  },
  countdownText: {
    textAlign: 'center',
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 14.5,
  },
  streak: {
    paddingHorizontal: 23,
    paddingTop: 22,
    paddingBottom: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.tray,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakTitle: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 19,
  },
  streakBest: {
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 14.5,
  },
  week: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: DAY_SIZE,
    alignItems: 'center',
  },
  dayBlock: {
    width: DAY_SIZE,
    height: DAY_SIZE,
  },
  dayLetter: {
    marginTop: 8,
    color: UI.textMuted,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  dayLetterPlayed: {
    color: UI.text,
    fontFamily: FONTS.bodyBold,
  },
  streakText: {
    marginTop: 14,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
  },
  secondaryButton: {
    height: 55,
    marginTop: 10,
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
