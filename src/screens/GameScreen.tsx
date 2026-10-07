import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameOverBanner } from '../components/GameOverBanner';
import { Grid, GRID_PADDING, type GridPreview } from '../components/Grid';
import { ScoreHeader } from '../components/ScoreHeader';
import { Tray } from '../components/Tray';
import { canPlace } from '../game/placement';
import {
  DEMO_GAME,
  DEMO_MOVES,
  FINISHED_GAME,
  NEAR_END_GAME,
  SAMPLE_GAME,
  type DemoMove,
} from '../game/sampleGame';
import { createGame, type GameState } from '../game/state';
import { useDemoMoves } from '../hooks/useDemoMoves';
import { useGame } from '../hooks/useGame';
import { GRID_SIZE, UI } from '../theme';

/**
 * Development only: start the app with EXPO_PUBLIC_SAMPLE_GAME set to `1` (the mockup's game),
 * `end` (one move away from the end), `over` (a finished game) or `demo` (a short scripted game
 * that plays by itself, to watch the animations).
 */
const SAMPLE_GAME_NAME = __DEV__ ? process.env.EXPO_PUBLIC_SAMPLE_GAME : undefined;
const SAMPLE_GAMES: Readonly<Record<string, GameState>> = {
  '1': SAMPLE_GAME,
  end: NEAR_END_GAME,
  over: FINISHED_GAME,
  demo: DEMO_GAME,
};
const DEMO_SCRIPT = SAMPLE_GAME_NAME === 'demo' ? DEMO_MOVES : null;
/** In the demo, a piece is released this fraction of a cell away from its target. */
const DEMO_RELEASE_OFFSET = 0.45;

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

  const handleDrop = (index: number, col: number, row: number, left: number, top: number) =>
    place(index, col, row, { left, top }) !== null;

  useDemoMoves(DEMO_SCRIPT, ({ trayIndex, col, row }: DemoMove) => {
    place(trayIndex, col, row, {
      left: (col + DEMO_RELEASE_OFFSET) * cellSize,
      top: (row + DEMO_RELEASE_OFFSET) * cellSize,
    });
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
          <ScoreHeader score={game.score} />
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
            gridCellSize={cellSize}
            gridRef={gridRef}
            onTargetChange={handleTargetChange}
            onDrop={handleDrop}
          />
        </View>
        {game.isOver ? (
          <View style={styles.gameOver}>
            <GameOverBanner score={game.score} onRestart={restart} />
          </View>
        ) : null}
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
  score: {
    paddingHorizontal: SCORE_MARGIN,
  },
  grid: {
    marginTop: 14,
    alignItems: 'center',
  },
  gameOver: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tray: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: TRAY_MARGIN,
  },
});
