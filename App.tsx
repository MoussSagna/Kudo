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

import { GameScreen } from './src/screens/GameScreen';
import { LaunchScreen, NEXT_SCREEN_FADE_IN_MS } from './src/screens/LaunchScreen';
import { TutorialScreen, type TutorialEntry } from './src/screens/TutorialScreen';
import { UI } from './src/theme';

SplashScreen.preventAutoHideAsync();

/** Development only: EXPO_PUBLIC_TUTORIAL opens the tutorial directly in one of its states. */
const TUTORIAL_ENTRIES: readonly string[] = ['1a', '1b', '2a', '2b'] satisfies TutorialEntry[];
const DEV_TUTORIAL = __DEV__ ? process.env.EXPO_PUBLIC_TUTORIAL : undefined;
const DEV_TUTORIAL_ENTRY =
  DEV_TUTORIAL && TUTORIAL_ENTRIES.includes(DEV_TUTORIAL) ? (DEV_TUTORIAL as TutorialEntry) : undefined;

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Fredoka_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [launchDone, setLaunchDone] = useState(false);
  const [launchRemoved, setLaunchRemoved] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(DEV_TUTORIAL_ENTRY !== undefined);
  const gameOpacity = useSharedValue(0);
  const fontsReady = fontsLoaded || fontsError !== null;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  const handleLaunchDone = useCallback(() => setLaunchDone(true), []);
  const handleTutorialDone = useCallback(() => setIsTutorialOpen(false), []);

  useEffect(() => {
    if (!launchDone) {
      return;
    }
    gameOpacity.value = withTiming(
      1,
      { duration: NEXT_SCREEN_FADE_IN_MS, reduceMotion: ReduceMotion.Never },
      (finished) => {
        if (finished) {
          scheduleOnRN(setLaunchRemoved, true);
        }
      },
    );
  }, [launchDone, gameOpacity]);

  const gameStyle = useAnimatedStyle(() => ({ opacity: gameOpacity.value }));

  if (!fontsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root}>
          {launchRemoved ? null : <LaunchScreen onDone={handleLaunchDone} />}
          {launchDone ? (
            <Animated.View style={[StyleSheet.absoluteFill, gameStyle]}>
              {isTutorialOpen ? (
                <TutorialScreen entry={DEV_TUTORIAL_ENTRY} onDone={handleTutorialDone} />
              ) : (
                <GameScreen />
              )}
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
