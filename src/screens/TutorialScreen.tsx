import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressDots } from '../components/ProgressDots';
import { TutorialDailyStep } from '../components/TutorialDailyStep';
import { TutorialHeader } from '../components/TutorialHeader';
import { TutorialPlayStep } from '../components/TutorialPlayStep';
import { ClearedRowBand, RowOutline } from '../components/TutorialRowMarks';
import { CLEAR_STEP, PLACE_STEP } from '../game/tutorial';
import { UI } from '../theme';

const STEP_COUNT = 3;
const MIN_BOTTOM_PADDING = 34;
const CLEAR_STEP_ROW = CLEAR_STEP.suggestion.row;

/** A state of the tutorial that development tools can open directly. */
export type TutorialEntry = '1a' | '1b' | '2a' | '2b' | '3';

const ENTRY_STEP: Readonly<Record<TutorialEntry, number>> = {
  '1a': 0,
  '1b': 0,
  '2a': 1,
  '2b': 1,
  '3': 2,
};

interface TutorialScreenProps {
  /** Development only: the state to open; the tutorial normally starts at its first step. */
  entry?: TutorialEntry;
  /** Called when the player skips the tutorial or reaches its end. */
  onDone: () => void;
}

/** The first-launch tutorial: the player learns by doing the gestures of the game. */
export function TutorialScreen({ entry = '1a', onDone }: TutorialScreenProps) {
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(ENTRY_STEP[entry]);
  /** A development entry only applies to the step it opens, not to the ones that follow. */
  const startSolved = (entry === '1b' || entry === '2b') && stepIndex === ENTRY_STEP[entry];

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
        <TutorialHeader stepIndex={stepIndex} stepCount={STEP_COUNT} onSkip={onDone} />
        {stepIndex === 0 ? (
          <TutorialPlayStep
            key="place"
            step={PLACE_STEP}
            startSolved={startSolved}
            title="Glisse la pièce sur la grille"
            text="Pose-la sur les cases qui clignotent."
            solvedTitle="Bien joué !"
            solvedText="Chaque case posée rapporte 1 point. Les pièces ne tournent pas."
            badge={{ label: '+4', col: 6.7, row: 2.6 }}
            onNext={() => setStepIndex(1)}
          />
        ) : null}
        {stepIndex === 1 ? (
          <TutorialPlayStep
            key="clear"
            step={CLEAR_STEP}
            startSolved={startSolved}
            title="Complète la ligne"
            text="Il lui manque trois cases. Une ligne pleine disparaît."
            solvedTitle="Ligne effacée !"
            solvedText="Les colonnes comptent aussi. Plusieurs d'un coup rapportent beaucoup plus."
            hint="Vise les trois cases vides de la ligne"
            badge={{ label: '+10', col: 4, row: CLEAR_STEP_ROW + 0.5 }}
            renderGuide={(cellSize) => <RowOutline row={CLEAR_STEP_ROW} cellSize={cellSize} />}
            renderSolvedMark={(cellSize) => (
              <ClearedRowBand row={CLEAR_STEP_ROW} cellSize={cellSize} />
            )}
            onNext={() => setStepIndex(2)}
          />
        ) : null}
        {stepIndex === 2 ? (
          <TutorialDailyStep stepIndex={stepIndex} stepCount={STEP_COUNT} onDone={onDone} />
        ) : (
          <ProgressDots count={STEP_COUNT} activeIndex={stepIndex} />
        )}
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
