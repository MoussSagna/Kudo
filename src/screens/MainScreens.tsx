import { useEffect, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import type { DailyStatus } from '../game/daily';
import { dateFromDayKey, type DayKey } from '../game/days';
import type { GameMode } from '../game/state';
import { useBestScore } from '../hooks/useBestScore';
import { OPENS_ON_TOMORROW_SCREEN, type DailyChallenge } from '../hooks/useDailyChallenge';
import { useScreenFade } from '../hooks/useScreenFade';
import { shareGame } from '../share';
import { GameScreen, OPENS_ON_SAMPLE_GAME } from './GameScreen';
import { HomeScreen } from './HomeScreen';
import { ResultScreen } from './ResultScreen';
import { SettingsScreen } from './SettingsScreen';
import { TomorrowScreen } from './TomorrowScreen';
import { TutorialScreen, type TutorialEntry } from './TutorialScreen';

/** Development only: EXPO_PUBLIC_SETTINGS=1 opens the app on the settings screen. */
const OPENS_ON_SETTINGS = __DEV__ && process.env.EXPO_PUBLIC_SETTINGS === '1';

/** The screens the settings can be opened from, and go back to. */
type SettingsOrigin = 'home' | 'tomorrow';

/**
 * `gameId` changes with every new game, so that its screen starts from scratch. The tutorial
 * replayed from the settings remembers where the settings were opened from, to go back to them.
 */
type Route =
  | { name: 'home' }
  | { name: 'game'; mode: GameMode; gameId: number }
  | { name: 'tomorrow' }
  | { name: 'dailyResult' }
  | { name: 'settings'; from: SettingsOrigin }
  | { name: 'tutorial'; settingsFrom?: SettingsOrigin };

interface HomeProps {
  today: DayKey;
  daily: DailyStatus;
  streak: number;
  onOpenDaily: () => void;
  onPlayFree: () => void;
  onShowTutorial: () => void;
}

/** The home screen with the best score it reads when it opens. */
function Home({ today, daily, streak, onOpenDaily, onPlayFree, onShowTutorial }: HomeProps) {
  const { best } = useBestScore('free');

  return (
    <HomeScreen
      today={dateFromDayKey(today) ?? new Date()}
      daily={daily}
      streak={streak}
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

function initialRoute(startsWithTutorial: boolean): Route {
  if (OPENS_ON_SAMPLE_GAME) {
    return { name: 'game', mode: 'free', gameId: 0 };
  }
  if (OPENS_ON_TOMORROW_SCREEN) {
    return { name: 'tomorrow' };
  }
  if (OPENS_ON_SETTINGS) {
    return { name: 'settings', from: 'home' };
  }
  return { name: startsWithTutorial ? 'tutorial' : 'home' };
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
    initialRoute(startsWithTutorial),
  );

  const goHome = () => navigate({ name: 'home' });

  // When the day changes, the finished challenge is no longer today's: its screens give way to
  // the home screen, where the new challenge is.
  const showsFinishedDaily = route.name === 'tomorrow' || route.name === 'dailyResult';
  const isDailyDone = daily.status.kind === 'done';
  useEffect(() => {
    if (showsFinishedDaily && !isDailyDone) {
      navigate({ name: 'home' });
    }
  }, [isDailyDone, navigate, showsFinishedDaily]);
  const startGame = (mode: GameMode) =>
    navigate({ name: 'game', mode, gameId: route.name === 'game' ? route.gameId + 1 : 0 });

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      {renderRoute(route, {
        daily,
        tutorialEntry,
        onTutorialDone: (settingsFrom) => {
          onTutorialDone();
          navigate(settingsFrom ? { name: 'settings', from: settingsFrom } : { name: 'home' });
        },
        onShowTutorial: (settingsFrom) => navigate({ name: 'tutorial', settingsFrom }),
        // The finished challenge may no longer be today's: its screen is then gone.
        onLeaveSettings: (from) =>
          navigate({ name: from === 'tomorrow' && isDailyDone ? 'tomorrow' : 'home' }),
        // Once today's challenge is finished, it cannot be replayed: the player waits for tomorrow.
        onOpenDaily: () =>
          daily.status.kind === 'done' ? navigate({ name: 'tomorrow' }) : startGame('daily'),
        onShowDailyResult: () => navigate({ name: 'dailyResult' }),
        onDayOver: () => {
          daily.refreshToday();
          goHome();
        },
        goHome,
        startGame,
      })}
    </Animated.View>
  );
}

interface RouteActions {
  daily: DailyChallenge;
  tutorialEntry?: TutorialEntry;
  /** `settingsFrom` is set when the tutorial was replayed from the settings. */
  onTutorialDone: (settingsFrom?: SettingsOrigin) => void;
  onShowTutorial: (settingsFrom?: SettingsOrigin) => void;
  onLeaveSettings: (from: SettingsOrigin) => void;
  onOpenDaily: () => void;
  onShowDailyResult: () => void;
  onDayOver: () => void;
  goHome: () => void;
  startGame: (mode: GameMode) => void;
}

function renderRoute(route: Route, actions: RouteActions): ReactNode {
  switch (route.name) {
    case 'tutorial':
      return (
        <TutorialScreen
          entry={actions.tutorialEntry}
          onDone={() => actions.onTutorialDone(route.settingsFrom)}
        />
      );
    case 'settings':
      return (
        <SettingsScreen
          onBack={() => actions.onLeaveSettings(route.from)}
          onShowTutorial={() => actions.onShowTutorial(route.from)}
        />
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
    case 'tomorrow': {
      const { status, today, streak, streakToday } = actions.daily;
      if (status.kind !== 'done') {
        return null;
      }
      return (
        <TomorrowScreen
          today={today}
          score={status.game.score}
          streak={streak}
          streakToday={streakToday}
          onBack={actions.goHome}
          onPlayFree={() => actions.startGame('free')}
          onShowResult={actions.onShowDailyResult}
          onDayOver={actions.onDayOver}
        />
      );
    }
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
          today={actions.daily.today}
          daily={actions.daily.status}
          streak={actions.daily.streakToday}
          onOpenDaily={actions.onOpenDaily}
          onPlayFree={() => actions.startGame('free')}
          onShowTutorial={() => actions.onShowTutorial()}
        />
      );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
