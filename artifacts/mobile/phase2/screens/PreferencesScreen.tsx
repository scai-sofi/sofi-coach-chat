import React, { useState, useEffect, ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { MemoryMode, MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER } from '../constants/types';
import { AppBar } from '../components/AppBar';
import { RadioSelected, RadioUnselected } from '../components/SettingsPanel';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

const MODES: { value: MemoryMode; label: string; description: string }[] = [
  { value: 'full', label: 'Full memory', description: 'Coach automatically remembers details from your conversations.' },
  { value: 'ask-first', label: 'Always ask first', description: 'Coach will ask before saving anything from conversations.' },
  { value: 'off', label: 'Memory off', description: 'Coach won\u2019t save or use any memories. Goals are still tracked.' },
];

type TrustLevel = 'conservative' | 'balanced' | 'proactive';

const TRUST_LEVELS: { value: TrustLevel; label: string; description: string }[] = [
  { value: 'conservative', label: 'Conservative', description: 'Only act on what I\u2019ve explicitly confirmed' },
  { value: 'balanced', label: 'Balanced', description: 'Infer from patterns, but check on big moves' },
  { value: 'proactive', label: 'Proactive', description: 'Anticipate my needs and act when confident' },
];

const SUPPRESSION_PRESETS: string[] = [
  'Credit score discussions',
  'Debt payoff reminders',
  'Spending pattern observations',
  'Investment suggestions',
  'Insurance recommendations',
];

function ToggleSwitch({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const { colors } = useTheme();
  const translateX = useSharedValue(value ? 18 : 2);

  useEffect(() => {
    translateX.value = withTiming(value ? 18 : 2, { duration: 200, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.toggleTrack, { backgroundColor: value ? colors.contentPrimary : colors.surfaceEdge }]}
    >
      <Animated.View style={[styles.toggleThumb, thumbStyle]} />
    </Pressable>
  );
}

function SectionNavRow({ icon, label, onPress }: { icon: FeatherIconName; label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={styles.navRow} onPress={onPress}>
      <View style={styles.navRowLeft}>
        <Feather name={icon} size={20} color={colors.contentSecondary} />
        <Text style={[styles.navRowLabel, { color: colors.contentPrimary }]}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.contentSecondary} />
    </Pressable>
  );
}

export default function PreferencesScreen() {
  const { colors } = useTheme();
  const { goBack } = usePhase2Nav();
  const { memoryMode, setMemoryMode } = useCoach();
  const [localMode, setLocalMode] = useState<MemoryMode>(memoryMode);
  const [trustLevel, setTrustLevel] = useState<TrustLevel>('balanced');
  const [categoryToggles, setCategoryToggles] = useState<Record<MemoryCategory, boolean>>({
    ABOUT_ME: true,
    PREFERENCES: true,
    PRIORITIES: true,
  });
  const [suppressions, setSuppressions] = useState<Record<string, boolean>>({});
  const [aiExpanded, setAiExpanded] = useState(false);

  useEffect(() => {
    setLocalMode(memoryMode);
  }, [memoryMode]);

  const handleModeSelect = (mode: MemoryMode) => {
    setLocalMode(mode);
    setMemoryMode(mode);
  };

  const toggleCategory = (cat: MemoryCategory) => {
    setCategoryToggles(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleSuppression = (topic: string) => {
    setSuppressions(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const chevronRotation = useSharedValue(0);
  useEffect(() => {
    chevronRotation.value = withTiming(aiExpanded ? 1 : 0, { duration: 200 });
  }, [aiExpanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 90}deg` }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="Preferences" onBack={() => goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
          <SectionNavRow icon="bell" label="Notifications" />
          <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />

          <Pressable style={styles.navRow} onPress={() => setAiExpanded(e => !e)}>
            <View style={styles.navRowLeft}>
              <Feather name="cpu" size={20} color={colors.contentSecondary} />
              <Text style={[styles.navRowLabel, { color: colors.contentPrimary }]}>AI usage</Text>
            </View>
            <Animated.View style={chevronStyle}>
              <Feather name="chevron-right" size={18} color={colors.contentSecondary} />
            </Animated.View>
          </Pressable>

          {aiExpanded && (
            <>
              <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />
              <View style={styles.aiContent}>

                <View style={styles.aiSection}>
                  <Text style={[styles.aiSectionTitle, { color: colors.contentSecondary }]}>Memory mode</Text>
                  {MODES.map((mode, idx) => (
                    <Pressable
                      key={mode.value}
                      style={styles.modeRow}
                      onPress={() => handleModeSelect(mode.value)}
                    >
                      <View style={styles.modeTextArea}>
                        <Text style={[styles.modeLabel, { color: colors.contentPrimary }]}>{mode.label}</Text>
                        <Text style={[styles.modeDesc, { color: colors.contentSecondary }]}>{mode.description}</Text>
                      </View>
                      <View style={styles.radioWrap}>
                        {localMode === mode.value ? <RadioSelected /> : <RadioUnselected />}
                      </View>
                    </Pressable>
                  ))}
                </View>

                <View style={[styles.aiDivider, { backgroundColor: colors.surfaceEdge }]} />

                <View style={styles.aiSection}>
                  <Text style={[styles.aiSectionTitle, { color: colors.contentSecondary }]}>Trust spectrum</Text>
                  <Text style={[styles.aiSectionDesc, { color: colors.contentMuted }]}>
                    How much should Coach act on your behalf?
                  </Text>
                  <View style={styles.trustRow}>
                    {TRUST_LEVELS.map((level) => {
                      const active = trustLevel === level.value;
                      return (
                        <Pressable
                          key={level.value}
                          style={[
                            styles.trustChip,
                            { borderColor: colors.surfaceEdge },
                            active && { backgroundColor: colors.contentPrimary, borderColor: colors.contentPrimary },
                          ]}
                          onPress={() => setTrustLevel(level.value)}
                        >
                          <Text style={[
                            styles.trustChipLabel,
                            { color: colors.contentPrimary },
                            active && { color: colors.contentPrimaryInverse },
                          ]}>{level.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={[styles.trustDesc, { color: colors.contentSecondary }]}>
                    {TRUST_LEVELS.find(t => t.value === trustLevel)?.description}
                  </Text>
                </View>

                <View style={[styles.aiDivider, { backgroundColor: colors.surfaceEdge }]} />

                <View style={styles.aiSection}>
                  <Text style={[styles.aiSectionTitle, { color: colors.contentSecondary }]}>Category controls</Text>
                  <Text style={[styles.aiSectionDesc, { color: colors.contentMuted }]}>
                    Choose what Coach can learn and reference
                  </Text>
                  {MEMORY_CATEGORY_ORDER.map((cat) => (
                    <View key={cat} style={styles.toggleRow}>
                      <Text style={[styles.toggleLabel, { color: colors.contentPrimary }]}>
                        {MEMORY_CATEGORY_LABELS[cat]}
                      </Text>
                      <ToggleSwitch
                        value={categoryToggles[cat]}
                        onToggle={() => toggleCategory(cat)}
                      />
                    </View>
                  ))}
                </View>

                <View style={[styles.aiDivider, { backgroundColor: colors.surfaceEdge }]} />

                <View style={styles.aiSection}>
                  <Text style={[styles.aiSectionTitle, { color: colors.contentSecondary }]}>Suppression signals</Text>
                  <Text style={[styles.aiSectionDesc, { color: colors.contentMuted }]}>
                    Topics Coach should avoid bringing up
                  </Text>
                  {SUPPRESSION_PRESETS.map((topic) => (
                    <View key={topic} style={styles.toggleRow}>
                      <Text style={[styles.toggleLabel, { color: colors.contentPrimary }]}>{topic}</Text>
                      <ToggleSwitch
                        value={!!suppressions[topic]}
                        onToggle={() => toggleSuppression(topic)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {!aiExpanded && <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />}
          {aiExpanded && <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge, marginTop: 4 }]} />}

          <SectionNavRow icon="lock" label="Privacy" />
          <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />
          <SectionNavRow icon="sun" label="App appearances" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navRowLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
  },
  aiContent: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  aiSection: {
    gap: 8,
    paddingVertical: 8,
  },
  aiSectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiSectionDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginBottom: 4,
  },
  aiDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 6,
    gap: 8,
  },
  modeTextArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  modeLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  modeDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  radioWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  trustRow: {
    flexDirection: 'row',
    gap: 8,
  },
  trustChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  trustChipLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
  },
  trustDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    flex: 1,
  },
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
