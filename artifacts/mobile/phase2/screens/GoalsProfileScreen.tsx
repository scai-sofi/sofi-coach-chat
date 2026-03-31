import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { AppBar } from '../components/AppBar';
import { ProgressRing, GoalCard, SuggestedGoalCard } from '../components/GoalsDashboard';

export default function GoalsProfileScreen() {
  const { colors } = useTheme();
  const { navigate, goBack } = usePhase2Nav();
  const { goals } = useCoach();

  const draftGoals = goals.filter(g => g.status === 'DRAFT');
  const activeGoals = goals.filter(g => !['COMPLETED', 'PAUSED', 'DRAFT'].includes(g.status));
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  const hasAny = draftGoals.length > 0 || activeGoals.length > 0 || completedGoals.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="Goals" onBack={() => goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {!hasAny ? (
          <View style={styles.empty}>
            <Feather name="target" size={32} color={colors.contentMuted} />
            <Text style={[styles.emptyText, { color: colors.contentSecondary }]}>
              No goals yet. Tell Coach what you're working toward and it will help you set one up.
            </Text>
          </View>
        ) : (
          <>
            {draftGoals.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Feather name="star" size={13} color={colors.contentSecondary} />
                  <Text style={[styles.sectionHeaderText, { color: colors.contentSecondary }]}>Suggested</Text>
                </View>
                {draftGoals.map(g => <SuggestedGoalCard key={g.id} goal={g} />)}
                {activeGoals.length > 0 && (
                  <View style={styles.divider}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
                    <Text style={[styles.dividerText, { color: colors.contentSecondary }]}>ACTIVE</Text>
                    <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
                  </View>
                )}
              </>
            )}
            {activeGoals.map(g => (
              <GoalCard key={g.id} goal={g} onAskPress={() => navigate('chat')} />
            ))}
            {(activeGoals.length > 0 || draftGoals.length > 0) && completedGoals.length > 0 && (
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
                <Text style={[styles.dividerText, { color: colors.contentSecondary }]}>COMPLETED</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
              </View>
            )}
            {completedGoals.map(g => <GoalCard key={g.id} goal={g} />)}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.contentSecondary }]}>
          {activeGoals.length} active{draftGoals.length > 0 ? ` · ${draftGoals.length} suggested` : ''}{completedGoals.length > 0 ? ` · ${completedGoals.length} completed` : ''} · Auto-updated from your accounts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 14, fontFamily: Fonts.medium, lineHeight: 20,
  },
  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    fontSize: 11, fontFamily: Fonts.medium,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  empty: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12,
  },
  emptyText: { fontSize: 14, fontFamily: Fonts.regular, textAlign: 'center', maxWidth: 260 },
  footer: {
    paddingHorizontal: 16, paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: { fontSize: 12, fontFamily: Fonts.regular },
});
