import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { now } from '../clock';
import { Chevron } from '../components/Chevron';
import { PrimaryButton } from '../components/PrimaryButton';
import { SettingsButton } from '../components/SettingsButton';
import { dayKey, formatCountdown, msUntilNextDay, weekOf, type DayKey } from '../game/days';
import { formatScore } from '../game/formatScore';
import type { Streak } from '../game/streak';
import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, FONTS, UI } from '../theme';

const BUTTON_SIZE = 44;
const DAY_SIZE = 35;
const WEEK_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
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
    <LinearGradient
      colors={[UI.backgroundTop, UI.background]}
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 13,
          paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
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

      <View style={styles.summary}>
        <View style={styles.done}>
          <Image source={BLOCK_IMAGES.green} style={styles.doneBlock} />
          <View style={styles.doneCheck} />
        </View>
        <Text style={styles.title}>Défi du jour terminé</Text>
        <Text style={styles.score}>
          Ton score : <Text style={styles.scoreValue}>{formatScore(score)} points</Text>
        </Text>
      </View>

      <View style={styles.cards}>
        <View style={styles.countdown}>
          <Text style={styles.countdownLabel}>PROCHAIN DÉFI DANS</Text>
          <Text style={styles.countdownTime}>{formatCountdown(remainingMs)}</Text>
          <Text style={styles.countdownText}>Nouvelles pièces chaque jour à minuit</Text>
        </View>

        <View style={styles.streak}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>
              Série : {streakToday} {streakToday > 1 ? 'jours' : 'jour'}
            </Text>
            <Text style={styles.streakBest}>Record : {streak.best}</Text>
          </View>
          <View style={styles.week}>
            {weekOf(today).map((day, index) => {
              const isPlayed = streak.days.includes(day);
              return (
                <View key={day} style={styles.day}>
                  <Image
                    source={isPlayed ? BLOCK_IMAGES.orange : CELL_EMPTY_IMAGE}
                    style={styles.dayBlock}
                  />
                  <Text style={[styles.dayLetter, isPlayed && styles.dayLetterPlayed]}>
                    {WEEK_LETTERS[index]}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.streakText}>Reviens demain pour la prolonger.</Text>
        </View>
      </View>

      <PrimaryButton label="Partie libre" onPress={onPlayFree} />
      <Pressable accessibilityRole="button" onPress={onShowResult} style={styles.secondaryButton}>
        <Text style={styles.secondaryLabel}>Revoir mon résultat</Text>
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
    flex: 1,
    justifyContent: 'center',
    gap: 25,
  },
  countdown: {
    height: 156,
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
