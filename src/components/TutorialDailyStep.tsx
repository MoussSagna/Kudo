import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { BLOCK_COLORS, BLOCK_IMAGES, CELL_EMPTY_IMAGE, FONTS, UI, type BlockColor } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import { ProgressDots } from './ProgressDots';
import { ShareIcon } from './ShareIcon';

const ICON_COLOR = BLOCK_COLORS.green;
const ICON_SIZE = 20;
const ICON_STROKE = 2.5;
const DAY_SIZE = 35;
const TODAY_INDEX = 2;

/** A fixed illustration of a week: two days played, today, and four days to come. */
const WEEK: readonly { letter: string; color: BlockColor | null }[] = [
  { letter: 'L', color: 'orange' },
  { letter: 'M', color: 'orange' },
  { letter: 'M', color: 'yellow' },
  { letter: 'J', color: null },
  { letter: 'V', color: null },
  { letter: 'S', color: null },
  { letter: 'D', color: null },
];

function ClockIcon() {
  return (
    <View style={[styles.icon, styles.clockFace]}>
      <View style={styles.clockHourHand} />
      <View style={styles.clockMinuteHand} />
    </View>
  );
}

function PeopleIcon() {
  return (
    <View style={styles.icon}>
      <View style={[styles.personHead, styles.secondPersonHead]} />
      <View style={[styles.personBody, styles.secondPersonBody]} />
      <View style={styles.personHead} />
      <View style={styles.personBody} />
    </View>
  );
}

const FEATURES: readonly { icon: ReactNode; label: string }[] = [
  { icon: <ClockIcon />, label: 'Un nouveau défi chaque jour' },
  { icon: <PeopleIcon />, label: 'Les mêmes pièces pour tous' },
  { icon: <ShareIcon color={ICON_COLOR} />, label: 'Un score à partager' },
];

interface TutorialDailyStepProps {
  stepIndex: number;
  stepCount: number;
  onDone: () => void;
}

/** The last step of the tutorial: what the daily challenge is. Nothing to do but read. */
export function TutorialDailyStep({ stepIndex, stepCount, onDone }: TutorialDailyStepProps) {
  return (
    <View style={styles.step}>
      <View style={styles.illustration}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>DÉFI DU JOUR</Text>
            <Text style={styles.streak}>Série : 3 jours</Text>
          </View>
          <View style={styles.week}>
            {WEEK.map(({ letter, color }, index) => (
              <View key={index} style={styles.day}>
                <Image
                  source={color ? BLOCK_IMAGES[color] : CELL_EMPTY_IMAGE}
                  style={styles.dayBlock}
                />
                {index === TODAY_INDEX ? <View style={styles.todayRing} /> : null}
                <Text
                  style={[
                    styles.dayLetter,
                    index <= TODAY_INDEX && styles.dayLetterPlayed,
                    index === TODAY_INDEX && styles.dayLetterToday,
                  ]}
                >
                  {letter}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.divider} />
          {FEATURES.map(({ icon, label }) => (
            <View key={label} style={styles.feature}>
              {icon}
              <Text style={styles.featureLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.title}>Un défi par jour</Text>
      <Text style={styles.body}>
        Tu n&apos;as qu&apos;une tentative. La partie s&apos;arrête quand plus aucune pièce ne rentre.
      </Text>
      <View style={styles.dots}>
        <ProgressDots count={stepCount} activeIndex={stepIndex} />
      </View>
      <PrimaryButton label="C'est parti" onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
    paddingHorizontal: 24,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 310,
    paddingHorizontal: 23,
    paddingTop: 24,
    paddingBottom: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.cell,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: UI.accent,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
  },
  streak: {
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 14,
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
  todayRing: {
    position: 'absolute',
    left: -4,
    top: -4,
    width: DAY_SIZE + 8,
    height: DAY_SIZE + 8,
    borderWidth: 2.5,
    borderRadius: 12,
    borderColor: UI.text,
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
  dayLetterToday: {
    color: UI.accent,
  },
  divider: {
    height: 1,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: UI.cellEdge,
  },
  feature: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureLabel: {
    color: UI.text,
    fontFamily: FONTS.bodyMedium,
    fontSize: 16.5,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  clockFace: {
    borderWidth: ICON_STROKE,
    borderRadius: ICON_SIZE / 2,
    borderColor: ICON_COLOR,
  },
  clockHourHand: {
    position: 'absolute',
    left: 6.25,
    top: 2.5,
    width: ICON_STROKE,
    height: 6.5,
    borderRadius: 1,
    backgroundColor: ICON_COLOR,
  },
  clockMinuteHand: {
    position: 'absolute',
    left: 6.25,
    top: 6.5,
    width: 6,
    height: ICON_STROKE,
    borderRadius: 1,
    backgroundColor: ICON_COLOR,
  },
  personHead: {
    position: 'absolute',
    left: 2.5,
    top: 1,
    width: 8.5,
    height: 8.5,
    borderWidth: ICON_STROKE,
    borderRadius: 4.25,
    borderColor: ICON_COLOR,
  },
  personBody: {
    position: 'absolute',
    left: 0,
    top: 11.5,
    width: 13.5,
    height: 7.5,
    borderWidth: ICON_STROKE,
    borderBottomWidth: 0,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderColor: ICON_COLOR,
  },
  secondPersonHead: {
    left: 11,
  },
  secondPersonBody: {
    left: 8.5,
    width: 11.5,
  },
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 32,
    lineHeight: 36,
  },
  body: {
    marginTop: 8,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 17,
    lineHeight: 25.5,
  },
  dots: {
    marginTop: 30,
    marginBottom: 22,
  },
});
