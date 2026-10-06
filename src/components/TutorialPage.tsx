import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS, UI } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import { ProgressDots } from './ProgressDots';

const MIN_TOUCH_SIZE = 44;

interface TutorialPageProps {
  index: number;
  total: number;
  illustration: ReactNode;
  title: string;
  body: string;
  buttonLabel: string;
  onNext: () => void;
  onSkip: () => void;
}

export function TutorialPage({
  index,
  total,
  illustration,
  title,
  body,
  buttonLabel,
  onNext,
  onSkip,
}: TutorialPageProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.page,
        { paddingTop: insets.top + 13, paddingBottom: Math.max(insets.bottom, 24) },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.step}>
          {index + 1} / {total}
        </Text>
        <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skip}>
          <Text style={styles.skipLabel}>Passer</Text>
        </Pressable>
      </View>
      <View style={styles.illustration}>{illustration}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <View style={styles.dots}>
        <ProgressDots count={total} activeIndex={index} />
      </View>
      <PrimaryButton label={buttonLabel} onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    height: MIN_TOUCH_SIZE,
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  skipLabel: {
    color: UI.textSoft,
    fontFamily: FONTS.bodyMedium,
    fontSize: 16,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
