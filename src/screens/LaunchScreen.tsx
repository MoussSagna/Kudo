import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LaunchTagline } from '../components/LaunchTagline';
import { LaunchTitle } from '../components/LaunchTitle';
import { Logo } from '../components/Logo';
import { UI } from '../theme';

const LAUNCH_DURATION_MS = 1000;

interface LaunchScreenProps {
  onDone: () => void;
}

export function LaunchScreen({ onDone }: LaunchScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, LAUNCH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <SafeAreaView style={styles.screen}>
      <Logo />
      <LaunchTitle />
      <LaunchTagline />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
    backgroundColor: UI.background,
  },
});
