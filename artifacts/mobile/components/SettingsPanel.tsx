import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { MemoryMode } from '@/constants/types';
import { AppBar } from '@/components/AppBar';

function RadioSelected({ size = 24 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={colors.contentPrimary} strokeWidth={1} />
      <Circle cx={12} cy={12} r={6} fill={colors.contentPrimary} />
    </Svg>
  );
}

function RadioUnselected({ size = 24 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={colors.contentSecondary} strokeWidth={1} />
    </Svg>
  );
}

const MODES: { value: MemoryMode; label: string; description: string }[] = [
  { value: 'full', label: 'Full memory', description: 'Coach automatically remembers details from your conversations.' },
  { value: 'ask-first', label: 'Always ask me first', description: 'Coach will ask before saving any memory from your conversations.' },
  { value: 'off', label: 'Memory off', description: 'Coach won\u2019t save or use any memories. Goals are still tracked.' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DURATION = 300;
const SLIDE_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const { memoryMode, setMemoryMode } = useCoach();
  const [localMode, setLocalMode] = useState<MemoryMode>(memoryMode);

  const slideX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    slideX.value = withTiming(0, { duration: SLIDE_DURATION, easing: SLIDE_EASING });
  }, []);

  const handleClose = () => {
    slideX.value = withTiming(SCREEN_WIDTH, { duration: SLIDE_DURATION, easing: SLIDE_EASING }, () => {
      runOnJS(onClose)();
    });
  };

  const handleSelect = (mode: MemoryMode) => {
    setLocalMode(mode);
    setMemoryMode(mode);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  return (
    <Animated.View style={[styles.panel, { backgroundColor: colors.surfaceBase }, animStyle]}>
      <AppBar variant="back" title="Settings" onBack={handleClose} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Memory</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.contentStatusbar }]}>
            {MODES.map((mode, idx) => (
              <Pressable
                key={mode.value}
                style={[styles.modeRow, idx < MODES.length - 1 && [styles.modeRowBorder, { borderBottomColor: colors.surfaceEdge }]]}
                onPress={() => handleSelect(mode.value)}
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
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
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
    minHeight: 64,
    paddingVertical: 8,
    gap: 8,
  },
  modeRowBorder: {
    borderBottomWidth: 1,
  },
  modeTextArea: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  modeLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  modeDesc: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  radioWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
