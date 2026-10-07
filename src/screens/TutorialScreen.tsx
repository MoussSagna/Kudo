import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressDots } from '../components/ProgressDots';
import { TutorialHeader } from '../components/TutorialHeader';
import { TutorialPlayStep } from '../components/TutorialPlayStep';
import { PLACE_STEP } from '../game/tutorial';
import { UI } from '../theme';

const STEP_COUNT = 3;
const MIN_BOTTOM_PADDING = 34;

/** A state of the tutorial that development tools can open directly. */
export type TutorialEntry = '1a' | '1b';

interface TutorialScreenProps {
  /** Development only: the state to open; the tutorial normally starts at its first step. */
  entry?: TutorialEntry;
  /** Called when the player skips the tutorial or reaches its end. */
  onDone: () => void;
}

/** The first-launch tutorial: the player learns by doing the gestures of the game. */
export function TutorialScreen({ entry = '1a', onDone }: TutorialScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={[UI.backgroundTop, UI.background]} style={styles.background}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 13,
            paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
          },
        ]}
      >
        <TutorialHeader stepIndex={0} stepCount={STEP_COUNT} onSkip={onDone} />
        <TutorialPlayStep
          step={PLACE_STEP}
          startSolved={entry === '1b'}
          title="Glisse la pièce sur la grille"
          text="Pose-la sur les cases qui clignotent."
          solvedTitle="Bien joué !"
          solvedText="Chaque case posée rapporte 1 point. Les pièces ne tournent pas."
          badge={{ label: '+4', col: 6.7, row: 2.6 }}
          onNext={onDone}
        />
        <ProgressDots count={STEP_COUNT} activeIndex={0} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
