import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { AppBar } from '../components/AppBar';
import { GoalCard, SuggestedGoalCard } from '../components/GoalsDashboard';
import { GoalTabCategory, GOAL_TAB_MAP, GOAL_TAB_LABELS, GOAL_TAB_ORDER } from '../constants/types';

export default function GoalsProfileScreen() {
  const { colors } = useTheme();
  const { navigate, goBack } = usePhase2Nav();
  const { goals } = useCoach();
  const [activeTab, setActiveTab] = useState<GoalTabCategory>('save-up');

  const allGoals = goals.filter(g => g.status !== 'DRAFT');
  const draftGoals = goals.filter(g => g.status === 'DRAFT');

  const tabCounts: Record<GoalTabCategory, number> = { 'save-up': 0, 'pay-down': 0, 'investment': 0 };
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
            <View style={[styles.segmentedContainer, { backgroundColor: colors.progressTrack, borderColor: colors.progressTrack }]}>
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <Pressable
                    key={tab.key}
                    style={[
                      styles.segmentedTab,
                      isActive && [styles.segmentedTabActive, { backgroundColor: colors.surfaceElevated }],
                    ]}
                    onPress={() => setActiveTab(tab.key)}
                  >
                    <Text
                      style={[
                        styles.segmentedTabText,
                        { color: colors.contentSecondary },
                        isActive && { color: colors.contentPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {tab.label} {'\u2022'} {tab.count}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {draftGoals.length > 0 && draftGoals.some(g => GOAL_TAB_MAP[g.type] === activeTab) && (
              <>
                <View style={styles.sectionHeader}>
                  <Feather name="star" size={13} color={colors.contentBrand} />
                  <Text style={[styles.sectionHeaderText, { color: colors.contentBrand }]}>Suggested</Text>
                </View>
                {draftGoals
                  .filter(g => GOAL_TAB_MAP[g.type] === activeTab)
                  .map((g, i) => <SuggestedGoalCard key={g.id} goal={g} index={i} />)}
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
    gap: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 2,
    height: 40,
    alignItems: 'center',
    padding: 0,
  },
  segmentedTab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  segmentedTabActive: {
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentedTabText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
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
