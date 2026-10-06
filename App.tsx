import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { LaunchScreen, TITLE_SCREEN_FADE_IN_MS } from './src/screens/LaunchScreen';
import { TitleScreen } from './src/screens/TitleScreen';
import { UI } from './src/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({ Fredoka_700Bold, DMSans_400Regular });
  const [launchDone, setLaunchDone] = useState(false);
  const [launchRemoved, setLaunchRemoved] = useState(false);
  const titleOpacity = useSharedValue(0);
  const fontsReady = fontsLoaded || fontsError !== null;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  const handleLaunchDone = useCallback(() => setLaunchDone(true), []);

  useEffect(() => {
    if (!launchDone) {
      return;
    }
    titleOpacity.value = withTiming(
      1,
      { duration: TITLE_SCREEN_FADE_IN_MS, reduceMotion: ReduceMotion.Never },
      (finished) => {
        if (finished) {
          scheduleOnRN(setLaunchRemoved, true);
        }
      },
    );
  }, [launchDone, titleOpacity]);

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {launchRemoved ? null : <LaunchScreen onDone={handleLaunchDone} />}
        {launchDone ? (
          <Animated.View style={[StyleSheet.absoluteFill, titleStyle]}>
            <TitleScreen />
          </Animated.View>
        ) : null}
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UI.background,
  },
});
