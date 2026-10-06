import { StyleSheet, Text } from 'react-native';

import { FONTS, UI } from '../theme';

export function LaunchTitle() {
  return <Text style={styles.title}>Kubo</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 84,
    marginTop: 18,
  },
});
