import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { LaunchScreen, NEXT_SCREEN_FADE_IN_MS } from './src/screens/LaunchScreen';
import { MainScreens } from './src/screens/MainScreens';
import type { TutorialEntry } from './src/screens/TutorialScreen';
import { hasSeenTutorial, markTutorialSeen } from './src/storage/tutorial';
import { UI } from './src/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Development only: EXPO_PUBLIC_TUTORIAL=1 replays the tutorial from its start even if it was
 * already seen; `1a`, `1b`, `2a`, `2b` or `3` opens it directly in that state; `0` skips it
 * even if it was never seen.
 */
const TUTORIAL_ENTRIES: readonly string[] = ['1a', '1b', '2a', '2b', '3'] satisfies TutorialEntry[];
const DEV_TUTORIAL = __DEV__ ? process.env.EXPO_PUBLIC_TUTORIAL : undefined;
const IS_TUTORIAL_FORCED = DEV_TUTORIAL === '1' || TUTORIAL_ENTRIES.includes(DEV_TUTORIAL ?? '');
const IS_TUTORIAL_SKIPPED = DEV_TUTORIAL === '0';
const DEV_TUTORIAL_ENTRY = TUTORIAL_ENTRIES.includes(DEV_TUTORIAL ?? '')
  ? (DEV_TUTORIAL as TutorialEntry)
  : undefined;

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Fredoka_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [launchDone, setLaunchDone] = useState(false);
  const [launchRemoved, setLaunchRemoved] = useState(false);
  /** Null until the storage has been read, which happens during the launch animation. */
  const [tutorialSeen, setTutorialSeen] = useState<boolean | null>(() => {
    if (IS_TUTORIAL_SKIPPED) {
      return true;
    }
    return IS_TUTORIAL_FORCED ? false : null;
  });
  const nextScreenOpacity = useSharedValue(0);
  const fontsReady = fontsLoaded || fontsError !== null;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  const handleLaunchDone = useCallback(() => setLaunchDone(true), []);

  useEffect(() => {
    if (IS_TUTORIAL_FORCED || IS_TUTORIAL_SKIPPED) {
      return;
    }
    let cancelled = false;
    hasSeenTutorial().then((seen) => {
      if (!cancelled) {
        setTutorialSeen(seen);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** The screen after the launch screen is known once the launch is over and the storage read. */
  const isNextScreenReady = launchDone && tutorialSeen !== null;

  useEffect(() => {
    if (!isNextScreenReady) {
      return;
    }
    nextScreenOpacity.value = withTiming(
      1,
      { duration: NEXT_SCREEN_FADE_IN_MS, reduceMotion: ReduceMotion.Never },
      (finished) => {
        if (finished) {
          scheduleOnRN(setLaunchRemoved, true);
        }
      },
    );
  }, [isNextScreenReady, nextScreenOpacity]);

  const nextScreenStyle = useAnimatedStyle(() => ({ opacity: nextScreenOpacity.value }));

  if (!fontsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root}>
          {launchRemoved ? null : <LaunchScreen onDone={handleLaunchDone} />}
          {isNextScreenReady ? (
            <Animated.View style={[StyleSheet.absoluteFill, nextScreenStyle]}>
              <MainScreens
                startsWithTutorial={!tutorialSeen}
                tutorialEntry={DEV_TUTORIAL_ENTRY}
                onTutorialDone={markTutorialSeen}
              />
            </Animated.View>
          ) : null}
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UI.background,
  },
});
