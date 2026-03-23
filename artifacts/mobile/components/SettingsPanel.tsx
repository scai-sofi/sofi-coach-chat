import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { MemoryMode } from '@/constants/types';

function ChevronLeftIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z"
        fill={color}
      />
    </Svg>
  );
}

function RadioSelected({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={11} stroke={Colors.contentBrand} strokeWidth={2} />
      <Circle cx={12} cy={12} r={6} fill={Colors.contentBrand} />
    </Svg>
  );
}

function RadioUnselected({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={11} stroke="#C4C3C2" strokeWidth={2} />
    </Svg>
  );
}

const MODES: { value: MemoryMode; label: string; description: string }[] = [
  { value: 'full', label: 'Full memory', description: 'Coach automatically remembers details from your conversations.' },
  { value: 'ask-first', label: 'Ask me first', description: 'Coach will ask before saving any memory from your conversations.' },
  { value: 'off', label: 'Memory off', description: 'Coach won\'t save or use any memories. Goals are still tracked.' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DURATION = 300;
const SLIDE_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
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
    <Animated.View style={[styles.panel, animStyle]}>
      <View style={[styles.appBar, { paddingTop: insets.top }]}>
        <View style={styles.titleBar}>
          <View style={styles.leftControls}>
            <Pressable style={styles.iconBtn} onPress={handleClose} hitSlop={8}>
              <ChevronLeftIcon size={24} color={Colors.contentPrimary} />
            </Pressable>
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.titleText} numberOfLines={1}>Settings</Text>
          </View>
          <View style={styles.rightControls} />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Memory</Text>
          <View style={styles.card}>
            {MODES.map((mode, idx) => (
              <Pressable
                key={mode.value}
                style={[styles.modeRow, idx < MODES.length - 1 && styles.modeRowBorder]}
                onPress={() => handleSelect(mode.value)}
              >
                <View style={styles.radioWrap}>
                  {localMode === mode.value ? <RadioSelected /> : <RadioUnselected />}
                </View>
                <View style={styles.modeTextArea}>
                  <Text style={styles.modeLabel}>{mode.label}</Text>
                  <Text style={styles.modeDesc}>{mode.description}</Text>
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
    backgroundColor: Colors.surfaceBase,
    zIndex: 100,
  },
  appBar: { backgroundColor: Colors.surfaceBase },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  leftControls: {
    width: 100,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 4,
  },
  titleArea: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
    textAlign: 'center',
  },
  rightControls: {
    width: 100,
    height: 44,
  },
  iconBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: Colors.contentSecondary,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.08)',
    shadowColor: 'rgba(10,10,10,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  modeRowBorder: {
    borderBottomWidth: 0.75,
    borderBottomColor: 'rgba(10,10,10,0.08)',
  },
  modeTextArea: {
    flex: 1,
    gap: 2,
  },
  modeLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
  },
  modeDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.contentSecondary,
    lineHeight: 18,
  },
  radioWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
