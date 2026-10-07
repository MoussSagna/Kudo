import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Grid, GRID_PADDING, type GridPreview } from '../components/Grid';
import { ScoreHeader } from '../components/ScoreHeader';
import { Tray } from '../components/Tray';
import { moveFeedback } from '../game/feedback';
import type { MoveResult } from '../game/moves';
import { canPlace } from '../game/placement';
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
import { useGame } from '../hooks/useGame';
import { useSounds } from '../hooks/useSounds';
import { MOTION } from '../motion';
import { GRID_SIZE, UI } from '../theme';
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
const DEMO_SCRIPT = SAMPLE_GAME_NAME === 'demo' ? DEMO_MOVES : null;
/** In the demo, a piece is released this fraction of a cell away from its target. */
const DEMO_RELEASE_OFFSET = 0.45;
/** The end-of-game feedback comes after the feedback of the last move, not on top of it. */
const GAME_OVER_FEEDBACK_DELAY_MS = 450;

const GRID_MARGIN = 13;
const TRAY_MARGIN = 19;
const SCORE_MARGIN = 24;
/** Room kept above the score for the header (back, title, pause) of the mockup. */
const HEADER_HEIGHT = 77;
const MIN_BOTTOM_PADDING = 34;
/** Size of a tray block compared to a grid cell. */
const TRAY_CELL_RATIO = 0.68;

function createInitialGame() {
  return (SAMPLE_GAME_NAME && SAMPLE_GAMES[SAMPLE_GAME_NAME]) || createGame(Date.now());
}

export function GameScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { game, lastMove, place, restart } = useGame(createInitialGame);
  const cellSize = Math.floor((width - 2 * (GRID_MARGIN + GRID_PADDING)) / GRID_SIZE);
  const trayCellSize = Math.round(cellSize * TRAY_CELL_RATIO);
  const gridRef = useAnimatedRef<Animated.View>();
  /** The tray slot being dragged and the cell it aims at, whether the piece fits there or not. */
  const [target, setTarget] = useState<{ index: number; col: number; row: number } | null>(null);

  const handleTargetChange = useCallback((index: number, col: number, row: number) => {
    setTarget(col < 0 ? null : { index, col, row });
  }, []);

  const playSound = useSounds();
  const { best, submit: submitScore } = useBestScore();
  /** Set once the game is over and its result screen is due. */
  const [result, setResult] = useState<GameResult | null>(INITIAL_RESULT);

  /** The sound and the vibration of a move that was just played. */
  const giveFeedback = (move: MoveResult) => {
    const feedback = moveFeedback(move);
    playSound(feedback);
    playHaptic(feedback === 'place' ? 'place' : 'clear');
    if (move.next.isOver) {
      const isNewRecord = submitScore(move.next.score);
      setTimeout(() => {
        playSound(isNewRecord ? 'highscore' : 'gameover');
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

  const handleRestart = () => {
    setResult(null);
    restart();
  };

  const handlePickUp = () => {
    playSound('pick');
    playHaptic('pick');
  };
  const handleReturn = () => {
    playSound('invalid');
    playHaptic('invalid');
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

  const targetPiece = target ? game.tray[target.index] : null;
  const preview: GridPreview | null =
    target && targetPiece && canPlace(game.grid, targetPiece, target.col, target.row)
      ? { piece: targetPiece, col: target.col, row: target.row }
      : null;


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
            cellSize={trayCellSize}
            width={width - 2 * TRAY_MARGIN}
            gridCellSize={cellSize}
            gridRef={gridRef}
            onTargetChange={handleTargetChange}
            onDrop={playAt}
            onPickUp={handlePickUp}
            onReturn={handleReturn}
          />
        </View>
      </View>
      {result ? (
        <ResultScreen game={game} isNewRecord={result.isNewRecord} onRestart={handleRestart} />
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
