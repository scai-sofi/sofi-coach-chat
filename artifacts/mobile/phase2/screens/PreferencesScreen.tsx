import React, { ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { AppBar } from '../components/AppBar';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

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
  const { goBack, navigate } = usePhase2Nav();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="Preferences" onBack={() => goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
          <SectionNavRow icon="bell" label="Notifications" />
          <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />
          <SectionNavRow icon="cpu" label="AI usage" onPress={() => navigate('ai-usage')} />
          <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />
          <SectionNavRow icon="lock" label="Privacy" />
          <View style={[styles.rowDivider, { backgroundColor: colors.surfaceEdge }]} />
          <SectionNavRow icon="sun" label="app appearances" />
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
});
