import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Grid } from '../components/Grid';
import { ScoreHeader } from '../components/ScoreHeader';
import { Tray } from '../components/Tray';
import type { MoveResult } from '../game/moves';
import { buildShareText } from '../game/share';
import {
  BIG_PIECES_GAME,
  DEMO_GAME,
  DEMO_MOVES,
  FINISHED_GAME,
  NEAR_END_GAME,
  SAMPLE_GAME,
  type DemoMove,
} from '../game/sampleGame';
import { createGame, type GameState } from '../game/state';
import { useDemoMoves } from '../hooks/useDemoMoves';
import { playHaptic } from '../haptics';
import { useBestScore } from '../hooks/useBestScore';
import { TRAY_MARGIN, useBoardLayout } from '../hooks/useBoardLayout';
import { useFeedback } from '../hooks/useFeedback';
import { useGame } from '../hooks/useGame';
import { usePieceDrag } from '../hooks/usePieceDrag';
import { MOTION } from '../motion';
import { UI } from '../theme';
import { ResultScreen } from './ResultScreen';

/**
 * Development only: start the app with EXPO_PUBLIC_SAMPLE_GAME set to `1` (the mockup's game),
 * `end` (one move away from the end), `over` (the mockup's finished game), `record` (the same, as a new record), `demo` (a short scripted game
 * that plays by itself, to watch the animations) or `big` (the largest pieces in the tray).
 */
interface GameResult {
  isNewRecord: boolean;
}

const SAMPLE_GAME_NAME = __DEV__ ? process.env.EXPO_PUBLIC_SAMPLE_GAME : undefined;
const SAMPLE_GAMES: Readonly<Record<string, GameState>> = {
  '1': SAMPLE_GAME,
  end: NEAR_END_GAME,
  over: FINISHED_GAME,
  record: FINISHED_GAME,
  demo: DEMO_GAME,
  big: BIG_PIECES_GAME,
};
/** The sample games that are already over open on their result screen. */
const INITIAL_RESULT: GameResult | null =
  SAMPLE_GAME_NAME === 'over' || SAMPLE_GAME_NAME === 'record'
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
/** Room kept above the score for the header (back, title, pause) of the mockup. */
const HEADER_HEIGHT = 77;
const MIN_BOTTOM_PADDING = 34;
/** Height of the tray compared to a grid cell. */
const TRAY_HEIGHT_RATIO = 3.45;

function createInitialGame() {
  return (SAMPLE_GAME_NAME && SAMPLE_GAMES[SAMPLE_GAME_NAME]) || createGame(Date.now());
}

export function GameScreen() {
  const insets = useSafeAreaInsets();
  const { cellSize, trayWidth } = useBoardLayout();
  const { game, lastMove, place, restart } = useGame(createInitialGame);
  const { gridRef, preview, onTargetChange } = usePieceDrag(game);
  const feedback = useFeedback();
  const trayHeight = Math.round(cellSize * TRAY_HEIGHT_RATIO);
  const { best, submit: submitScore } = useBestScore();
  /** Set once the game is over and its result screen is due. */
  const [result, setResult] = useState<GameResult | null>(INITIAL_RESULT);

  /** The sound and the vibration of a move that was just played. */
  const giveFeedback = (move: MoveResult) => {
    feedback.move(move);
    if (move.next.isOver) {
      const isNewRecord = submitScore(move.next.score);
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

  /** Opens the system share sheet. Cancelling it, or a phone that cannot share, is not an error. */
  const handleShare = () => {
    Share.share({ message: buildShareText(game) }).catch(() => undefined);
  };

  const handleRestart = () => {
    setResult(null);
    restart();
  };

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
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + HEADER_HEIGHT,
            paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
          },
        ]}
      >
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
          onShare={handleShare}
          onRestart={handleRestart}
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
    paddingHorizontal: SCORE_MARGIN,
  },
  grid: {
    marginTop: 14,
    alignItems: 'center',
  },
  tray: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: TRAY_MARGIN,
  },
});
