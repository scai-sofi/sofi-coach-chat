import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { MemoryMode, MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER } from '../constants/types';
import { AppBar } from './AppBar';

export function RadioSelected({ size = 24 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={colors.contentPrimary} strokeWidth={1} />
      <Circle cx={12} cy={12} r={6} fill={colors.contentPrimary} />
    </Svg>
  );
}

export function RadioUnselected({ size = 24 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={colors.contentSecondary} strokeWidth={1} />
    </Svg>
  );
}

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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DURATION = 300;
const SLIDE_EASING = Easing.bezier(0.4, 0, 0.2, 1);

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

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const { memoryMode, setMemoryMode } = useCoach();
  const [localMode, setLocalMode] = useState<MemoryMode>(memoryMode);
  const [trustLevel, setTrustLevel] = useState<TrustLevel>('balanced');
  const [categoryToggles, setCategoryToggles] = useState<Record<MemoryCategory, boolean>>({
    ABOUT_ME: true,
    PREFERENCES: true,
    PRIORITIES: true,
  });
  const [suppressions, setSuppressions] = useState<Record<string, boolean>>({});

  const slideX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    slideX.value = withTiming(0, { duration: SLIDE_DURATION, easing: SLIDE_EASING });
  }, []);

  const handleClose = () => {
    slideX.value = withTiming(SCREEN_WIDTH, { duration: SLIDE_DURATION, easing: SLIDE_EASING }, () => {
      runOnJS(onClose)();
    });
  };

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

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  return (
    <Animated.View style={[styles.panel, { backgroundColor: colors.surfaceBase }, animStyle]}>
      <AppBar variant="back" title="Settings" onBack={handleClose} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Memory mode</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.contentStatusbar }]}>
            {MODES.map((mode, idx) => (
              <Pressable
                key={mode.value}
                style={[styles.modeRow, idx < MODES.length - 1 && [styles.modeRowBorder, { borderBottomColor: colors.surfaceEdge }]]}
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
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Trust spectrum</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.contentStatusbar }]}>
            <View style={styles.trustContent}>
              <Text style={[styles.trustHint, { color: colors.contentMuted }]}>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Category controls</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.contentStatusbar }]}>
            <View style={styles.toggleContent}>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Suppression signals</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.contentStatusbar }]}>
            <View style={styles.toggleContent}>
              <Text style={[styles.suppressionHint, { color: colors.contentMuted }]}>
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
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  content: { flex: 1 },
  contentInner: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: 8,
    gap: 8,
  },
  modeRowBorder: { borderBottomWidth: 1 },
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
  trustContent: {
    paddingVertical: 16,
    gap: 10,
  },
  trustHint: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
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
  toggleContent: {
    paddingVertical: 12,
    gap: 4,
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
    marginRight: 12,
  },
  suppressionHint: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginBottom: 4,
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
