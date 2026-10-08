import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { now } from '../clock';
import { DEV_FLAGS } from '../dev/devFlags';
import { STRESS_SEED } from '../dev/stressPlan';
import { useStressTest } from '../dev/useStressTest';
import { GameHeader } from '../components/GameHeader';
import { Grid } from '../components/Grid';
import { ScoreHeader } from '../components/ScoreHeader';
import { Tray } from '../components/Tray';
import type { MoveResult } from '../game/moves';
import {
  BIG_PIECES_GAME,
  FINISHED_FREE_GAME,
  DEMO_GAME,
  DEMO_MOVES,
  FINISHED_GAME,
  NEAR_END_GAME,
  SAMPLE_GAME,
  type DemoMove,
} from '../game/sampleGame';
import { createGame, startGame, type GameMode, type GameState } from '../game/state';
import { useDemoMoves } from '../hooks/useDemoMoves';
import { playHaptic } from '../haptics';
import { useBestScore } from '../hooks/useBestScore';
import { TRAY_MARGIN, useBoardLayout } from '../hooks/useBoardLayout';
import { useFeedback } from '../hooks/useFeedback';
import { useGame } from '../hooks/useGame';
import { usePieceDrag } from '../hooks/usePieceDrag';
import { MOTION } from '../motion';
import { shareGame } from '../share';
import { UI } from '../theme';
import { ResultScreen } from './ResultScreen';

/**
 * Development only: start the app with EXPO_PUBLIC_SAMPLE_GAME set to `1` (the mockup's game),
 * `end` (one move away from the end), `over` (the mockup's finished game), `record` (the same, as a new record), `overfree` (the
 * same, as a free game), `demo` (a short scripted game
 * that plays by itself, to watch the animations) `big` (the largest pieces in the tray) or `stress` (a long game
 * that plays by itself and checks that the tray on screen matches the game).
 */
interface GameResult {
  isNewRecord: boolean;
}

const SAMPLE_GAME_NAME = DEV_FLAGS.sampleGame;
const SAMPLE_GAMES: Readonly<Record<string, GameState>> = {
  '1': SAMPLE_GAME,
  end: NEAR_END_GAME,
  over: FINISHED_GAME,
  record: FINISHED_GAME,
  overfree: FINISHED_FREE_GAME,
  demo: DEMO_GAME,
  big: BIG_PIECES_GAME,
  stress: createGame(STRESS_SEED, 'free'),
};
/** The sample games that are already over open on their result screen. */
const INITIAL_RESULT: GameResult | null =
  SAMPLE_GAME_NAME === 'over' || SAMPLE_GAME_NAME === 'record' || SAMPLE_GAME_NAME === 'overfree'
    ? { isNewRecord: SAMPLE_GAME_NAME === 'record' }
    : null;
/** Development only: true when a sample game is asked for, to open the app directly on it. */
export const OPENS_ON_SAMPLE_GAME =
  SAMPLE_GAME_NAME !== undefined && SAMPLE_GAMES[SAMPLE_GAME_NAME] !== undefined;
const DEMO_SCRIPT = SAMPLE_GAME_NAME === 'demo' ? DEMO_MOVES : null;
/** In the demo, a piece is released this fraction of a cell away from its target. */
const DEMO_RELEASE_OFFSET = 0.45;
/** The end-of-game feedback comes after the feedback of the last move, not on top of it. */
const GAME_OVER_FEEDBACK_DELAY_MS = 450;

const SCORE_MARGIN = 24;
/** Space above the header, and between the header and the score. */
const HEADER_TOP = 13;
const HEADER_BOTTOM = 20;
const HEADER_HEIGHT = 44;
/** Height of the score block, and space between it and the grid. */
const SCORE_HEIGHT = 86;
const GRID_TOP = 14;
/** The tray never touches the grid. */
const MIN_TRAY_GAP = 8;
const MIN_BOTTOM_PADDING = 16;
/** Height of the tray compared to a grid cell. */
const TRAY_HEIGHT_RATIO = 3.45;

interface GameScreenProps {
  mode: GameMode;
  /** A game to resume instead of starting a new one. */
  initialGame?: GameState;
  /**
   * Called after every move of a daily challenge, with its new state, so that it can be saved.
   * `isNewRecord` is true when that move ended the game on a new best score.
   */
  onDailyMove: (game: GameState, isNewRecord: boolean) => void;
  /** Back to the home screen. */
  onExit: () => void;
  /** Starts a new free game. */
  onStartFreeGame: () => void;
}

export function GameScreen({
  mode,
  initialGame,
  onDailyMove,
  onExit,
  onStartFreeGame,
}: GameScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + HEADER_TOP;
  const paddingBottom = Math.max(insets.bottom, MIN_BOTTOM_PADDING);
  const { cellSize, trayWidth, trayHeight } = useBoardLayout(
    paddingTop +
      HEADER_HEIGHT +
      HEADER_BOTTOM +
      SCORE_HEIGHT +
      GRID_TOP +
      MIN_TRAY_GAP +
      paddingBottom,
    TRAY_HEIGHT_RATIO,
  );
  const { game, lastMove, place } = useGame(
    () =>
      (SAMPLE_GAME_NAME && SAMPLE_GAMES[SAMPLE_GAME_NAME]) || initialGame || startGame(mode, now()),
  );
  const { gridRef, preview, onTargetChange } = usePieceDrag(game);
  const feedback = useFeedback();
  const { best, submit: submitScore } = useBestScore(game.mode);
  /** Set once the game is over and its result screen is due. */
  const [result, setResult] = useState<GameResult | null>(INITIAL_RESULT);

  /** The sound and the vibration of a move that was just played. */
  const giveFeedback = (move: MoveResult) => {
    feedback.move(move);
    const isNewRecord = move.next.isOver && submitScore(move.next.score);
    if (move.next.mode === 'daily') {
      onDailyMove(move.next, isNewRecord);
    }
    if (move.next.isOver) {
      setTimeout(() => {
        feedback.playSound(isNewRecord ? 'highscore' : 'gameover');
        playHaptic('gameover');
      }, GAME_OVER_FEEDBACK_DELAY_MS);
      setTimeout(() => setResult({ isNewRecord }), MOTION.resultDelayMs);
    }
  };

  const playAt = (index: number, col: number, row: number, left: number, top: number) => {
    const move = place(index, col, row, { left, top });
    if (move) {
      giveFeedback(move);
    }
    return move !== null;
  };

  /**
   * A daily challenge is saved after every move, so leaving it loses nothing. A free game is not
   * saved: leaving it once points are scored asks for a confirmation.
   */
  const handleBack = () => {
    if (game.mode === 'daily' || game.score === 0 || game.isOver) {
      onExit();
      return;
    }
    Alert.alert('Quitter la partie ?', 'Ta progression sera perdue.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Quitter', style: 'destructive', onPress: onExit },
    ]);
  };

  useStressTest(SAMPLE_GAME_NAME === 'stress', game);

  useDemoMoves(DEMO_SCRIPT, ({ trayIndex, col, row }: DemoMove) => {
    playAt(
      trayIndex,
      col,
      row,
      (col + DEMO_RELEASE_OFFSET) * cellSize,
      (row + DEMO_RELEASE_OFFSET) * cellSize,
    );
  });

  return (
    <LinearGradient colors={[UI.backgroundTop, UI.background]} style={styles.background}>
      <View style={[styles.content, { paddingTop, paddingBottom }]}>
        <GameHeader mode={game.mode} seed={game.seed} onBack={handleBack} />
        <View style={styles.score}>
          <ScoreHeader score={game.score} best={best} streak={game.streak} />
        </View>
        <View style={styles.grid}>
          <Animated.View ref={gridRef}>
            <Grid grid={game.grid} cellSize={cellSize} preview={preview} lastMove={lastMove} />
          </Animated.View>
        </View>
        <View style={styles.tray}>
          <Tray
            tray={game.tray}
            trayKey={`${game.seed}-${game.draws}`}
            moveId={lastMove?.id ?? 0}
            enabled={!game.isOver}
            width={trayWidth}
            height={trayHeight}
            gridCellSize={cellSize}
            gridRef={gridRef}
            onTargetChange={onTargetChange}
            onDrop={playAt}
            onPickUp={feedback.pickUp}
            onReturn={feedback.refuse}
          />
        </View>
      </View>
      {result ? (
        <ResultScreen
          game={game}
          isNewRecord={result.isNewRecord}
          onShare={() => shareGame(game)}
          onStartFreeGame={onStartFreeGame}
          onHome={onExit}
        />
      ) : null}
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
  score: {
    height: SCORE_HEIGHT,
    marginTop: HEADER_BOTTOM,
    paddingHorizontal: SCORE_MARGIN,
  },
  grid: {
    marginTop: GRID_TOP,
    alignItems: 'center',
  },
  tray: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: TRAY_MARGIN,
  },
});
