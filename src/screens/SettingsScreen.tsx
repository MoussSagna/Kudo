import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import appConfig from '../../app.json';
import { Chevron } from '../components/Chevron';
import { SwitchRow } from '../components/SwitchRow';
import { usePreferences } from '../hooks/usePreferences';
import { setPreference } from '../storage/preferences';
import { BLOCK_IMAGES, FONTS, UI, type BlockColor } from '../theme';

const BUTTON_SIZE = 44;
const MIN_TOUCH_SIZE = 44;
const MIN_BOTTOM_PADDING = 24;
/** The block images have a transparent margin: the block itself looks 31 points wide. */
const RULE_BLOCK_SIZE = 34;
const RULE_BLOCK_GAP = 14;

const RULES: readonly { color: BlockColor; title: string; text: string }[] = [
  {
    color: 'blue',
    title: 'Glisse une pièce sur la grille',
    text: 'Elle se pose si toutes ses cases sont libres. Pas de rotation.',
  },
  {
    color: 'green',
    title: 'Complète des lignes',
    text: "Une ligne ou une colonne pleine disparaît. Plusieurs d'un coup rapportent bien plus.",
  },
  {
    color: 'yellow',
    title: 'Un défi par jour',
    text: "Une seule tentative, les mêmes pièces pour tous. La partie s'arrête quand plus rien ne rentre.",
  },
];

interface SettingsScreenProps {
  /** Back to the screen the settings were opened from. */
  onBack: () => void;
  /** Replays the tutorial, which then comes back to the settings. */
  onShowTutorial: () => void;
}

/** Where the player turns sounds and vibrations on or off, and finds the rules again. */
export function SettingsScreen({ onBack, onShowTutorial }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const preferences = usePreferences();

  return (
    <LinearGradient colors={[UI.backgroundTop, UI.background]} style={styles.screen}>
      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 13,
            paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={onBack}
            style={styles.back}
          >
            <Chevron direction="left" color={UI.text} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.title}>
            Réglages
          </Text>
        </View>

        <View style={styles.switches}>
          <SwitchRow
            label="Sons"
            description="Pose, effacement, combo"
            value={preferences.sounds}
            onChange={(enabled) => setPreference('sounds', enabled)}
          />
          <View style={styles.divider} />
          <SwitchRow
            label="Vibrations"
            description="Retour tactile à la pose"
            value={preferences.haptics}
            onChange={(enabled) => setPreference('haptics', enabled)}
          />
        </View>

        <View style={styles.rules}>
          <Text accessibilityRole="header" style={styles.rulesTitle}>
            Comment jouer
          </Text>
          {RULES.map(({ color, title, text }) => (
            <View key={title} style={styles.rule}>
              <Image source={BLOCK_IMAGES[color]} style={styles.ruleBlock} />
              <View style={styles.ruleTexts}>
                <Text style={styles.ruleTitle}>{title}</Text>
                <Text style={styles.ruleText}>{text}</Text>
              </View>
            </View>
          ))}
          <Pressable accessibilityRole="button" onPress={onShowTutorial} style={styles.tutorial}>
            <Text style={styles.tutorialLabel}>Revoir le tutoriel</Text>
            <Chevron direction="right" color={UI.accent} size={8} />
          </Pressable>
        </View>

        <Text style={styles.version}>Kubo · version {appConfig.expo.version}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  back: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.cell,
  },
  title: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 28,
    lineHeight: 34,
  },
  switches: {
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.cell,
  },
  divider: {
    height: 1,
    backgroundColor: UI.cellEdge,
  },
  rules: {
    marginTop: 25,
    paddingHorizontal: 20,
    paddingTop: 23,
    paddingBottom: 8,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: UI.cellEdge,
    backgroundColor: UI.tray,
  },
  rulesTitle: {
    color: UI.text,
    fontFamily: FONTS.title,
    fontSize: 20,
    lineHeight: 24,
    marginBottom: -2,
  },
  rule: {
    marginTop: 16,
    flexDirection: 'row',
    gap: RULE_BLOCK_GAP,
  },
  ruleBlock: {
    width: RULE_BLOCK_SIZE,
    height: RULE_BLOCK_SIZE,
  },
  ruleTexts: {
    flex: 1,
  },
  ruleTitle: {
    color: UI.text,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  ruleText: {
    marginTop: 1,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 20.5,
  },
  tutorial: {
    alignSelf: 'flex-start',
    height: MIN_TOUCH_SIZE,
    marginTop: 6,
    marginLeft: RULE_BLOCK_SIZE + RULE_BLOCK_GAP,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tutorialLabel: {
    color: UI.accent,
    fontFamily: FONTS.bodyBold,
    fontSize: 15.5,
  },
  version: {
    marginTop: 'auto',
    paddingTop: 24,
    color: UI.textSoft,
    fontFamily: FONTS.body,
    fontSize: 14.5,
    lineHeight: 20,
    textAlign: 'center',
  },
});
