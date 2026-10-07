import { useState } from 'react';

import type { GameMode } from '../game/state';
import { useBestScore } from '../hooks/useBestScore';
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
 * a state.
 */
export function MainScreens({ startsWithTutorial, tutorialEntry, onTutorialDone }: MainScreensProps) {
  const [route, setRoute] = useState<Route>(() => {
    if (OPENS_ON_SAMPLE_GAME) {
      return { name: 'game', mode: 'free', gameId: 0 };
    }
    return startsWithTutorial ? { name: 'tutorial' } : { name: 'home' };
  });

  const goHome = () => setRoute({ name: 'home' });
  const startGame = (mode: GameMode) =>
    setRoute((current) => ({
      name: 'game',
      mode,
      gameId: current.name === 'game' ? current.gameId + 1 : 0,
    }));

  switch (route.name) {
    case 'tutorial':
      return (
        <TutorialScreen
          entry={tutorialEntry}
          onDone={() => {
            onTutorialDone();
            goHome();
          }}
        />
      );
    case 'game':
      return (
        <GameScreen
          key={route.gameId}
          mode={route.mode}
          onExit={goHome}
          onStartFreeGame={() => startGame('free')}
        />
      );
    case 'home':
      return (
        <Home
          onPlay={startGame}
          onShowTutorial={() => setRoute({ name: 'tutorial' })}
        />
      );
  }
}
