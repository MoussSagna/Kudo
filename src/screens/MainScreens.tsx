import { useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { now } from '../clock';
import type { DailyStatus } from '../game/daily';
import type { GameMode } from '../game/state';
import { useBestScore } from '../hooks/useBestScore';
import type { DailyChallenge } from '../hooks/useDailyChallenge';
import { useScreenFade } from '../hooks/useScreenFade';
import { shareGame } from '../share';
import { GameScreen, OPENS_ON_SAMPLE_GAME } from './GameScreen';
import { HomeScreen } from './HomeScreen';
import { ResultScreen } from './ResultScreen';
import { TutorialScreen, type TutorialEntry } from './TutorialScreen';

/** `gameId` changes with every new game, so that its screen starts from scratch. */
type Route =
  | { name: 'home' }
  | { name: 'game'; mode: GameMode; gameId: number }
  | { name: 'dailyResult' }
  | { name: 'tutorial' };

interface HomeProps {
  daily: DailyStatus;
  onOpenDaily: () => void;
  onPlayFree: () => void;
  onShowTutorial: () => void;
}

/** The home screen with what it reads when it opens: today's date and the best score. */
function Home({ daily, onOpenDaily, onPlayFree, onShowTutorial }: HomeProps) {
  const [today] = useState(now);
  const { best } = useBestScore('free');

  return (
    <HomeScreen
      today={today}
      daily={daily}
      freeBestScore={best}
      onOpenDaily={onOpenDaily}
      onPlayFree={onPlayFree}
      onShowTutorial={onShowTutorial}
    />
  );
}

interface MainScreensProps {
  /** True when the tutorial has never been seen: it is shown before the home screen. */
  startsWithTutorial: boolean;
  daily: DailyChallenge;
  /** Development only: the tutorial state to open. */
  tutorialEntry?: TutorialEntry;
  /** Called every time the tutorial is skipped or finished. */
  onTutorialDone: () => void;
}

/**
 * Everything after the launch screen, without a navigation library: one route at a time, kept in
 * a state, with a short fade from one screen to the next.
 */
export function MainScreens({
  startsWithTutorial,
  daily,
  tutorialEntry,
  onTutorialDone,
}: MainScreensProps) {
  const { route, navigate, fadeStyle } = useScreenFade<Route>(
    OPENS_ON_SAMPLE_GAME
      ? { name: 'game', mode: 'free', gameId: 0 }
      : { name: startsWithTutorial ? 'tutorial' : 'home' },
  );

  const goHome = () => navigate({ name: 'home' });
  const startGame = (mode: GameMode) =>
    navigate({ name: 'game', mode, gameId: route.name === 'game' ? route.gameId + 1 : 0 });

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      {renderRoute(route, {
        daily,
        tutorialEntry,
        onTutorialDone: () => {
          onTutorialDone();
          goHome();
        },
        onShowTutorial: () => navigate({ name: 'tutorial' }),
        // Once today's challenge is finished, it can be looked at again, not replayed.
        onOpenDaily: () =>
          daily.status.kind === 'done' ? navigate({ name: 'dailyResult' }) : startGame('daily'),
        goHome,
        startGame,
      })}
    </Animated.View>
  );
}

interface RouteActions {
  daily: DailyChallenge;
  tutorialEntry?: TutorialEntry;
  onTutorialDone: () => void;
  onShowTutorial: () => void;
  onOpenDaily: () => void;
  goHome: () => void;
  startGame: (mode: GameMode) => void;
}

function renderRoute(route: Route, actions: RouteActions): ReactNode {
  switch (route.name) {
    case 'tutorial':
      return (
        <TutorialScreen entry={actions.tutorialEntry} onDone={actions.onTutorialDone} />
      );
    case 'game':
      return (
        <GameScreen
          key={route.gameId}
          mode={route.mode}
          initialGame={
            route.mode === 'daily' && actions.daily.status.kind === 'inProgress'
              ? actions.daily.status.game
              : undefined
          }
          onDailyMove={actions.daily.recordMove}
          onExit={actions.goHome}
          onStartFreeGame={() => actions.startGame('free')}
        />
      );
    case 'dailyResult': {
      const { status } = actions.daily;
      if (status.kind !== 'done') {
        return null;
      }
      return (
        <ResultScreen
          game={status.game}
          isNewRecord={false}
          onShare={() => shareGame(status.game)}
          onStartFreeGame={() => actions.startGame('free')}
          onHome={actions.goHome}
        />
      );
    }
    case 'home':
      return (
        <Home
          daily={actions.daily.status}
          onOpenDaily={actions.onOpenDaily}
          onPlayFree={() => actions.startGame('free')}
          onShowTutorial={actions.onShowTutorial}
        />
      );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
