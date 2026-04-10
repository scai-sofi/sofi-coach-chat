import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { AppBar } from '../components/AppBar';
import { GoalCard, SuggestedGoalCard, SegmentedTabs } from '../components/GoalsDashboard';
import { GoalTabCategory, GOAL_TAB_MAP, GOAL_TAB_LABELS, GOAL_TAB_ORDER } from '../constants/types';

export default function GoalsProfileScreen() {
  const { colors } = useTheme();
  const { navigate, goBack } = usePhase2Nav();
  const { goals, dismissDraftGoal, acceptDraftGoal } = useCoach();
  const [activeTab, setActiveTab] = useState<GoalTabCategory>('save-up');

  const allGoals = goals.filter(g => g.status !== 'DRAFT');
  const draftGoals = goals.filter(g => g.status === 'DRAFT');

  const tabCounts: Record<GoalTabCategory, number> = { 'save-up': 0, 'pay-off': 0, 'investment': 0 };
  goals.forEach(g => { tabCounts[GOAL_TAB_MAP[g.type]]++; });

  const tabs = GOAL_TAB_ORDER.map(key => ({
    key,
    label: GOAL_TAB_LABELS[key],
    count: tabCounts[key],
  }));

  const filteredGoals = allGoals.filter(g => GOAL_TAB_MAP[g.type] === activeTab);
  const activeGoals = filteredGoals.filter(g => g.status !== 'COMPLETED');
  const completedGoals = filteredGoals.filter(g => g.status === 'COMPLETED');

  const hasAny = allGoals.length > 0 || draftGoals.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar
        variant="back"
        title="Goals"
        onBack={() => goBack()}
        rightActions={[{
          icon: <Feather name="plus" size={22} color={colors.contentPrimary} />,
          onPress: () => navigate('chat'),
        }]}
      />

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
            <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {draftGoals.length > 0 && draftGoals.some(g => GOAL_TAB_MAP[g.type] === activeTab) && (
              <>
                {draftGoals
                  .filter(g => GOAL_TAB_MAP[g.type] === activeTab)
                  .map((g, i) => (
                    <SuggestedGoalCard
                      key={g.id}
                      goal={g}
                      index={i}
                      onDismiss={() => dismissDraftGoal(g.id)}
                      onAccepted={() => acceptDraftGoal(g.id)}
                    />
                  ))}
              </>
            )}

            {activeGoals.map((g, i) => (
              <GoalCard key={g.id} goal={g} index={i} onAskPress={() => navigate('chat')} />
            ))}

            {activeGoals.length > 0 && completedGoals.length > 0 && (
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
                <Text style={[styles.dividerText, { color: colors.contentSecondary }]}>COMPLETED</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
              </View>
            )}
            {completedGoals.map((g, i) => <GoalCard key={g.id} goal={g} index={activeGoals.length + i} />)}

            {filteredGoals.length === 0 && draftGoals.filter(g => GOAL_TAB_MAP[g.type] === activeTab).length === 0 && (
              <View style={styles.emptyTab}>
                <Text style={[styles.emptyTabText, { color: colors.contentSecondary }]}>
                  No {GOAL_TAB_LABELS[activeTab].toLowerCase()} goals yet
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    maxWidth: 260,
  },
  emptyTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyTabText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});
