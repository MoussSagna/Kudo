import { useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  isTutorialMoveAccepted,
  solvedTutorialState,
  suggestionCells,
  TUTORIAL_TRAY_INDEX,
  type TutorialStep,
} from '../game/tutorial';
import { TRAY_MARGIN, useBoardLayout } from '../hooks/useBoardLayout';
import { useFeedback } from '../hooks/useFeedback';
import { useGame } from '../hooks/useGame';
import { usePieceDrag } from '../hooks/usePieceDrag';
import { MOTION } from '../motion';
import { BLOCK_COLORS, FONTS, UI } from '../theme';
import { Grid } from './Grid';
import { PrimaryButton } from './PrimaryButton';
import { Tray } from './Tray';
import { BlinkingCells, DragArrow, PointsBadge } from './TutorialHints';

/** Height of the tray compared to a grid cell. */
const TRAY_HEIGHT_RATIO = 3.1;
/** Height kept for the title and its text, so that the grid does not move between states. */
const TEXT_HEIGHT = 121;

export interface TutorialPlayStepProps {
  step: TutorialStep;
  /** Development only: open the step as if its piece had already been placed. */
  startSolved: boolean;
  title: string;
  text: string;
  solvedTitle: string;
  solvedText: string;
  /** Shown when a move is refused. */
  hint?: string;
  /** The points earned, shown over the grid once the step is solved. */
  badge: { label: string; col: number; row: number };
  /** Drawn over the grid cells while the step is not solved, given the size of a cell. */
  renderGuide?: (cellSize: number) => ReactNode;
  /** Drawn over the grid cells once the step is solved. */
  renderSolvedMark?: (cellSize: number) => ReactNode;
  onNext: () => void;
}

/**
 * A hands-on step of the tutorial: the real grid, tray and drag-and-drop of the game, with one
 * piece to place. Once it is placed, a message and a « Suivant » button replace the tray.
 */
export function TutorialPlayStep({
  step,
  startSolved,
  title,
  text,
  solvedTitle,
  solvedText,
  hint,
  badge,
  renderGuide,
  renderSolvedMark,
  onNext,
}: TutorialPlayStepProps) {
  const { cellSize, trayWidth } = useBoardLayout();
  const { game, lastMove, place } = useGame(() =>
    startSolved ? solvedTutorialState(step) : step.game,
  );
  const { gridRef, preview, onTargetChange } = usePieceDrag(game);
  const feedback = useFeedback();
  const [isPlaced, setIsPlaced] = useState(startSolved);
  const [isSolved, setIsSolved] = useState(startSolved);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const solvedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solvedOpacity = useSharedValue(startSolved ? 1 : 0);

  useEffect(
    () => () => {
      if (solvedTimer.current) {
        clearTimeout(solvedTimer.current);
      }
    },
    [],
  );

  const piece = step.game.tray[TUTORIAL_TRAY_INDEX];

  const handleDrop = (index: number, col: number, row: number, left: number, top: number) => {
    if (!isTutorialMoveAccepted(step, game, index, col, row)) {
      setIsHintVisible(true);
      return false;
    }
    const move = place(index, col, row, { left, top });
    if (!move) {
      return false;
    }
    feedback.move(move);
    setIsPlaced(true);
    setIsHintVisible(false);
    // The message waits for the move's own animations: the landing, then the clear if any.
    const hasCleared = move.clearedRows.length + move.clearedCols.length > 0;
    const animationMs =
      MOTION.landMs +
      MOTION.landBounceMs +
      (hasCleared ? MOTION.clearFlashMs + MOTION.clearShrinkMs + MOTION.clearStaggerMs * 8 : 0);
    solvedTimer.current = setTimeout(() => {
      setIsSolved(true);
      solvedOpacity.value = withTiming(1, {
        duration: MOTION.tutorialSuccessFadeMs,
        reduceMotion: ReduceMotion.Never,
      });
    }, animationMs);
    return true;
  };

  const solvedStyle = useAnimatedStyle(() => ({ opacity: solvedOpacity.value }));

  return (
    <View style={styles.step}>
      <View style={styles.text}>
        {isSolved ? (
          <Animated.View style={solvedStyle}>
            <View style={styles.solvedTitleRow}>
              <View style={styles.check}>
                <View style={styles.checkMark} />
              </View>
              <Text style={styles.title}>{solvedTitle}</Text>
            </View>
            <Text style={styles.body}>{solvedText}</Text>
          </Animated.View>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{text}</Text>
          </>
        )}
      </View>
      <View style={styles.grid}>
        <Animated.View ref={gridRef}>
          <Grid grid={game.grid} cellSize={cellSize} preview={preview} lastMove={lastMove}>
            {!isPlaced && piece ? (
              <BlinkingCells
                cells={suggestionCells(step)}
                color={piece.color}
                cellSize={cellSize}
              />
            ) : null}
            {!isPlaced ? renderGuide?.(cellSize) : null}
            {isSolved ? (
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, solvedStyle]}>
                {renderSolvedMark?.(cellSize)}
                <PointsBadge
                  label={badge.label}
                  centerX={badge.col * cellSize}
                  centerY={badge.row * cellSize}
                />
              </Animated.View>
            ) : null}
          </Grid>
        </Animated.View>
      </View>
      <View style={styles.bottom}>
        {isSolved ? (
          <Animated.View style={[styles.next, solvedStyle]}>
            <PrimaryButton label="Suivant" onPress={onNext} />
          </Animated.View>
        ) : (
          <View style={styles.tray}>
            {isHintVisible && hint ? <Text style={styles.hint}>{hint}</Text> : null}
            <View>
              <Tray
                tray={isPlaced ? [null, null, null] : game.tray}
                trayKey="tutorial"
                enabled={!isPlaced}
                width={trayWidth}
                height={Math.round(cellSize * TRAY_HEIGHT_RATIO)}
                gridCellSize={cellSize}
                gridRef={gridRef}
                onTargetChange={onTargetChange}
                onDrop={handleDrop}
                onPickUp={feedback.pickUp}
                onReturn={feedback.refuse}
              />
              {isPlaced ? null : (
                <View pointerEvents="none" style={styles.arrow}>
                  <DragArrow />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
  },
  text: {
    height: TEXT_HEIGHT,
    paddingTop: 18,
    paddingHorizontal: 24,
  },
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 28,
    lineHeight: 34,
  },
  solvedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLOCK_COLORS.green,
  },
  checkMark: {
    width: 8,
    height: 14,
    marginTop: -3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: UI.background,
    transform: [{ rotate: '45deg' }],
  },
  body: {
    marginTop: 5,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    alignItems: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tray: {
    paddingHorizontal: TRAY_MARGIN,
    marginBottom: 18,
  },
  hint: {
    marginBottom: 10,
    textAlign: 'center',
    color: UI.accent,
    fontFamily: FONTS.bodyMedium,
    fontSize: 15,
  },
  arrow: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  next: {
    paddingHorizontal: 24,
    marginBottom: 52,
  },
});
