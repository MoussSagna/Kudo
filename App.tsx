import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TitleScreen } from './src/screens/TitleScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <TitleScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
