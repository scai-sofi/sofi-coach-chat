import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { MemoryMode } from '../constants/types';
import { AppBar } from '../components/AppBar';

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
  { value: 'full', label: 'Full chat memory', description: 'Coach automatically remembers details from your conversations to use in chat.' },
  { value: 'ask-first', label: 'Always ask me first', description: 'Coach will ask before saving any chat memory from your conversations.' },
  { value: 'off', label: 'Chat memory off', description: 'Coach won\u2019t save or use any chat memories. Goals are still tracked.' },
];

const APP_SETTINGS = [
  { icon: 'bell', label: 'Notifications' },
  { icon: 'lock', label: 'Privacy' },
  { icon: 'sun', label: 'App appearance' },
];

function sourceLabel(source: string): string {
  if (source === 'EXPLICIT') return 'You told Coach';
  if (source === 'IMPLICIT_CONFIRMED') return 'Coach learned';
  if (source === 'MEMBER_360') return 'From your profile';
  return 'You added';
}

export default function PreferencesScreen() {
  const { colors } = useTheme();
  const { navigate } = usePhase2Nav();
  const { memoryMode, setMemoryMode, memories } = useCoach();
  const [localMode, setLocalMode] = useState<MemoryMode>(memoryMode);

  useEffect(() => {
    setLocalMode(memoryMode);
  }, [memoryMode]);

  const handleSelect = (mode: MemoryMode) => {
    setLocalMode(mode);
    setMemoryMode(mode);
  };

  const prefMemories = memories.filter(
    m => m.category === 'PREFERENCES' && m.status === 'ACTIVE'
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="Preferences" onBack={() => navigate('home')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Chat memory</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
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

        {prefMemories.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>Your preferences</Text>
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
              {prefMemories.map((mem, i) => (
                <React.Fragment key={mem.id}>
                  {i > 0 && <View style={[styles.prefDivider, { backgroundColor: colors.surfaceEdge }]} />}
                  <View style={styles.prefRow}>
                    <Text style={[styles.prefContent, { color: colors.contentPrimary }]}>{mem.content}</Text>
                    <Text style={[styles.prefSource, { color: colors.contentSecondary }]}>{sourceLabel(mem.source)}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.contentSecondary }]}>App settings</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
            {APP_SETTINGS.map((item, idx) => (
              <Pressable
                key={item.label}
                style={[
                  styles.settingRow,
                  idx < APP_SETTINGS.length - 1 && [styles.modeRowBorder, { borderBottomColor: colors.surfaceEdge }],
                ]}
              >
                <View style={styles.settingLeft}>
                  <Feather name={item.icon as any} size={20} color={colors.contentSecondary} />
                  <Text style={[styles.settingLabel, { color: colors.contentPrimary }]}>{item.label}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.contentSecondary} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
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
  prefDivider: {
    height: StyleSheet.hairlineWidth,
  },
  prefRow: {
    paddingVertical: 14,
    gap: 4,
  },
  prefContent: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  prefSource: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
});
