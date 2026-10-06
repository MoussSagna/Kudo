import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UI } from '../theme';

export function TitleScreen() {
  return (
    <LinearGradient colors={[UI.backgroundTop, UI.background]} style={styles.background}>
      <SafeAreaView style={styles.content}>
        <Text style={styles.title}>Kubo</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: UI.text,
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
