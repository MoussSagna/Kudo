import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LaunchScreen } from './src/screens/LaunchScreen';
import { TitleScreen } from './src/screens/TitleScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({ Fredoka_700Bold, DMSans_400Regular });
  const [launchDone, setLaunchDone] = useState(false);
  const fontsReady = fontsLoaded || fontsError !== null;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  const handleLaunchDone = useCallback(() => setLaunchDone(true), []);

  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {launchDone ? <TitleScreen /> : <LaunchScreen onDone={handleLaunchDone} />}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
