import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FONTS, TEXT_SCALE, UI } from '../theme';

const MIN_TOUCH_SIZE = 44;

interface TutorialHeaderProps {
  stepIndex: number;
  stepCount: number;
  onSkip: () => void;
}

/** « 1 / 3 » on the left, « Passer » on the right. */
export function TutorialHeader({ stepIndex, stepCount, onSkip }: TutorialHeaderProps) {
  return (
    <View style={styles.header}>
      <Text
        accessibilityLabel={`Étape ${stepIndex + 1} sur ${stepCount}`}
        maxFontSizeMultiplier={TEXT_SCALE.title}
        style={styles.step}
      >
        {stepIndex + 1} / {stepCount}
      </Text>
      <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skip}>
        <Text maxFontSizeMultiplier={TEXT_SCALE.title} style={styles.skipLabel}>Passer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: MIN_TOUCH_SIZE,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  step: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    letterSpacing: 1,
  },
  skip: {
    minWidth: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    paddingLeft: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipLabel: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyMedium,
    fontSize: 16,
  },
});
