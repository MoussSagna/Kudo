import { StyleSheet, Text } from 'react-native';

import { FONTS, UI } from '../theme';

export function LaunchTagline() {
  return <Text style={styles.tagline}>Un puzzle par jour.</Text>;
}

const styles = StyleSheet.create({
  tagline: {
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 17,
    marginTop: 2,
  },
});
