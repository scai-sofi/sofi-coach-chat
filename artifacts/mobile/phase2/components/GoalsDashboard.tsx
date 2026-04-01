import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { Goal, GoalTabCategory, GOAL_TAB_MAP, GOAL_TAB_LABELS, GOAL_TAB_ORDER, GOAL_TAB_SUBTITLE } from '../constants/types';
import { AppBar } from './AppBar';

function GoalProgressBar({ percentage }: { percentage: number }) {
  const { colors } = useTheme();
  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
      <View
        style={[
          styles.progressFill,
          { backgroundColor: colors.contentPrimary, width: `${clampedPct}%` },
        ]}
      />
    </View>
  );
}

function SegmentedTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { key: GoalTabCategory; label: string; count: number }[];
  activeTab: GoalTabCategory;
  onTabChange: (tab: GoalTabCategory) => void;
}) {
  const { colors } = useTheme();

  return (
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
            onPress={() => onTabChange(tab.key)}
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
  );
}

export function GoalCard({ goal, onAskPress, onEditPress }: { goal: Goal; onAskPress?: () => void; onEditPress?: () => void }) {
  const { colors } = useTheme();
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.status === 'COMPLETED';
  const tabCategory = GOAL_TAB_MAP[goal.type];
  const subtitle = `${GOAL_TAB_SUBTITLE[tabCategory]} ${goal.title}`;

  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));
  const estDate = goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <View style={[styles.goalCard, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
      <View style={styles.goalHeader}>
        <View style={styles.goalHeaderText}>
          <View style={styles.percentageRow}>
            <Text style={[styles.percentageNumber, { color: colors.contentPrimary }]}>{percentage}</Text>
            <Text style={[styles.percentageSign, { color: colors.contentPrimary }]}>%</Text>
          </View>
          <Text style={[styles.goalSubtitle, { color: colors.contentSecondary }]}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.meterSection}>
        <GoalProgressBar percentage={percentage} />
        <View style={styles.meterLabels}>
          <Text style={[styles.meterLabel, { color: colors.contentPrimary }]}>
            ${goal.currentAmount.toLocaleString()} saved
          </Text>
          <Text style={[styles.meterLabel, styles.meterLabelRight, { color: colors.contentPrimary }]}>
            ${goal.targetAmount.toLocaleString()} target
          </Text>
        </View>
      </View>

      {!isCompleted && (
        <>
          <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />

          <View style={styles.detailRows}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Est. completion</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>
                ~ {monthsRemaining} months {'\u2022'} {estDate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Recurring contribution</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>
                ${goal.monthlyContributionTarget}/mo
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Linked account</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>{goal.linkedAccount}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.editButton, { borderColor: colors.borderMedium }]}
              onPress={onEditPress}
            >
              <Text style={[styles.editButtonText, { color: colors.contentPrimary }]}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.askCoachButton}
              onPress={onAskPress}
            >
              <Text style={styles.askCoachButtonText}>Ask Coach</Text>
            </Pressable>
          </View>
        </>
      )}

      {isCompleted && (
        <>
          <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />
          <View style={styles.detailRows}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Final amount</Text>
              <Text style={[styles.detailValue, { color: colors.successDark }]}>
                ${goal.currentAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Linked account</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>{goal.linkedAccount}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export function SuggestedGoalCard({ goal }: { goal: Goal }) {
  const { colors } = useTheme();
  const { acceptDraftGoal, dismissDraftGoal } = useCoach();
  const tabCategory = GOAL_TAB_MAP[goal.type];
  const subtitle = `${GOAL_TAB_SUBTITLE[tabCategory]} ${goal.title}`;
  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));

  return (
    <View style={[styles.suggestedCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.contentBrand, shadowColor: colors.shadowColor }]}>
      <View style={styles.suggestedLabelRow}>
        <View style={[styles.suggestedBadge, { backgroundColor: colors.surfaceTint }]}>
          <Text style={[styles.suggestedBadgeText, { color: colors.contentBrand }]}>Suggested</Text>
        </View>
      </View>

      <View style={styles.goalHeaderText}>
        <Text style={[styles.goalSubtitle, { color: colors.contentPrimary }]}>{subtitle}</Text>
        <Text style={[styles.suggestedMeta, { color: colors.contentSecondary }]}>
          ${goal.targetAmount.toLocaleString()} {'\u2022'} ${goal.monthlyContributionTarget}/mo {'\u2022'} ~{monthsRemaining} months
        </Text>
        <Text style={[styles.suggestedMeta, { color: colors.contentSecondary }]}>
          Linked: {goal.linkedAccount}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <Pressable style={[styles.editButton, { borderColor: colors.surfaceEdge }]} onPress={() => dismissDraftGoal(goal.id)}>
          <Text style={[styles.editButtonText, { color: colors.contentSecondary }]}>Dismiss</Text>
        </Pressable>
        <Pressable style={[styles.setupButton, { backgroundColor: colors.contentPrimary }]} onPress={() => acceptDraftGoal(goal.id)}>
          <Text style={[styles.setupButtonText, { color: colors.contentPrimaryInverse }]}>Set up goal</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function GoalsDashboard() {
  const { colors } = useTheme();
  const { goals, setActivePanel } = useCoach();
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
    <View style={[styles.panel, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="Goals" onBack={() => setActivePanel('none')} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {!hasAny ? (
          <View style={styles.empty}>
            <Feather name="target" size={32} color={colors.contentMuted} />
            <Text style={[styles.emptyText, { color: colors.contentSecondary }]}>
              No goals yet. Tell the coach what you're working toward and it will help you set one up.
            </Text>
          </View>
        ) : (
          <>
            <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {draftGoals.length > 0 && draftGoals.some(g => GOAL_TAB_MAP[g.type] === activeTab) && (
              <>
                <View style={styles.sectionHeader}>
                  <Feather name="star" size={13} color={colors.contentBrand} />
                  <Text style={[styles.sectionHeaderText, { color: colors.contentBrand }]}>Suggested</Text>
                </View>
                {draftGoals
                  .filter(g => GOAL_TAB_MAP[g.type] === activeTab)
                  .map(g => <SuggestedGoalCard key={g.id} goal={g} />)}
              </>
            )}

            {activeGoals.map(g => (
              <GoalCard key={g.id} goal={g} onAskPress={() => setActivePanel('none')} />
            ))}

            {activeGoals.length > 0 && completedGoals.length > 0 && (
              <View style={styles.sectionDivider}>
                <View style={[styles.sectionDividerLine, { backgroundColor: colors.progressTrack }]} />
                <Text style={[styles.sectionDividerText, { color: colors.contentSecondary }]}>COMPLETED</Text>
                <View style={[styles.sectionDividerLine, { backgroundColor: colors.progressTrack }]} />
              </View>
            )}
            {completedGoals.map(g => <GoalCard key={g.id} goal={g} />)}

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
  panel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  content: { flex: 1 },
  contentInner: {
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
  goalCard: {
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalHeaderText: {
    flex: 1,
    gap: 0,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  percentageNumber: {
    fontSize: 28,
    fontFamily: Fonts.medium,
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  percentageSign: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    lineHeight: 26,
    letterSpacing: -0.2,
    marginBottom: 0,
  },
  goalSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  meterSection: {
    gap: 8,
    paddingBottom: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 32,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  meterLabelRight: {
    textAlign: 'right',
  },
  dividerLine: {
    height: 1,
    width: '100%',
  },
  detailRows: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  askCoachButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#edf8fc',
    borderWidth: 1.5,
    borderColor: '#5aeaff',
  },
  askCoachButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
    color: '#00a2c7',
  },
  setupButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  setupButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  suggestedCard: {
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestedLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  suggestedBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  suggestedMeta: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginTop: 2,
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
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDividerLine: { flex: 1, height: 1 },
  sectionDividerText: {
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
