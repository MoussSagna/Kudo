import { useState } from 'react';

import { useBestScore } from '../hooks/useBestScore';
import { GameScreen, OPENS_ON_SAMPLE_GAME } from './GameScreen';
import { HomeScreen } from './HomeScreen';
import { TutorialScreen, type TutorialEntry } from './TutorialScreen';

type Route = { name: 'home' } | { name: 'game' } | { name: 'tutorial' };

interface HomeProps {
  onPlay: () => void;
  onShowTutorial: () => void;
}

/** The home screen with what it reads when it opens: today's date and the best score. */
function Home({ onPlay, onShowTutorial }: HomeProps) {
  const [today] = useState(() => new Date());
  const { best } = useBestScore();

  return (
    <HomeScreen
      today={today}
      freeBestScore={best}
      onPlayDaily={onPlay}
      onPlayFree={onPlay}
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
    if (startsWithTutorial) {
      return { name: 'tutorial' };
    }
    return OPENS_ON_SAMPLE_GAME ? { name: 'game' } : { name: 'home' };
  });

  const goHome = () => setRoute({ name: 'home' });

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
      return <GameScreen />;
    case 'home':
      return (
        <Home
          onPlay={() => setRoute({ name: 'game' })}
          onShowTutorial={() => setRoute({ name: 'tutorial' })}
        />
      );
  }
}
