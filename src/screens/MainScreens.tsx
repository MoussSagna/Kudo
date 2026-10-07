import { useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import type { GameMode } from '../game/state';
import { useBestScore } from '../hooks/useBestScore';
import { useScreenFade } from '../hooks/useScreenFade';
import { GameScreen, OPENS_ON_SAMPLE_GAME } from './GameScreen';
import { HomeScreen } from './HomeScreen';
import { TutorialScreen, type TutorialEntry } from './TutorialScreen';

/** `gameId` changes with every new game, so that its screen starts from scratch. */
type Route =
  | { name: 'home' }
  | { name: 'game'; mode: GameMode; gameId: number }
  | { name: 'tutorial' };

interface HomeProps {
  onPlay: (mode: GameMode) => void;
  onShowTutorial: () => void;
}

/** The home screen with what it reads when it opens: today's date and the best score. */
function Home({ onPlay, onShowTutorial }: HomeProps) {
  const [today] = useState(() => new Date());
  const { best } = useBestScore('free');

  return (
    <HomeScreen
      today={today}
      freeBestScore={best}
      onPlayDaily={() => onPlay('daily')}
      onPlayFree={() => onPlay('free')}
      onShowTutorial={onShowTutorial}
    />
  );
}

interface MainScreensProps {
  /** True when the tutorial has never been seen: it is shown before the home screen. */
  startsWithTutorial: boolean;
  /** Development only: the tutorial state to open. */
  tutorialEntry?: TutorialEntry;
  /** Called every time the tutorial is skipped or finished. */
  onTutorialDone: () => void;
}

/**
 * Everything after the launch screen, without a navigation library: one route at a time, kept in
 * a state, with a short fade from one screen to the next.
 */
export function MainScreens({ startsWithTutorial, tutorialEntry, onTutorialDone }: MainScreensProps) {
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
        tutorialEntry,
        onTutorialDone: () => {
          onTutorialDone();
          goHome();
        },
        onShowTutorial: () => navigate({ name: 'tutorial' }),
        goHome,
        startGame,
      })}
    </Animated.View>
  );
}

interface RouteActions {
  tutorialEntry?: TutorialEntry;
  onTutorialDone: () => void;
  onShowTutorial: () => void;
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
          onExit={actions.goHome}
          onStartFreeGame={() => actions.startGame('free')}
        />
      );
    case 'home':
      return (
        <Home onPlay={actions.startGame} onShowTutorial={actions.onShowTutorial} />
      );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
