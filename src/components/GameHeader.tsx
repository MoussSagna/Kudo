import { Pressable, StyleSheet, Text, View } from 'react-native';

import { capitalize, dateFromDailySeed, formatWeekdayAndDate } from '../game/dates';
import type { GameMode } from '../game/state';
import { FONTS, UI } from '../theme';
import { Chevron } from './Chevron';

const BUTTON_SIZE = 44;

interface GameHeaderProps {
  mode: GameMode;
  /** Seed of the game: for the daily challenge, it tells the day. */
  seed: number;
  onBack: () => void;
}

/** The top of the game screen: the way back to the home screen, and which game this is. */
export function GameHeader({ mode, seed, onBack }: GameHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour à l'accueil"
        onPress={onBack}
        style={styles.back}
      >
        <Chevron direction="left" color={UI.text} />
      </Pressable>
      <View pointerEvents="none" style={styles.title}>
        <Text style={styles.mode}>{mode === 'daily' ? 'DÉFI DU JOUR' : 'PARTIE LIBRE'}</Text>
        {mode === 'daily' ? (
          <Text style={styles.date}>{capitalize(formatWeekdayAndDate(dateFromDailySeed(seed)))}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: BUTTON_SIZE,
    paddingHorizontal: 19,
    justifyContent: 'center',
  },
  back: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.cell,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mode: {
    color: UI.accent,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    letterSpacing: 1.1,
  },
  date: {
    marginTop: 2,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 15.5,
  },
});
