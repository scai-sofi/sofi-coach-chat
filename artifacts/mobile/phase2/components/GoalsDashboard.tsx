import React, { ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { Goal, GOAL_TYPE_LABELS } from '../constants/types';
import { AppBar } from './AppBar';

export function ProgressRing({ percentage, status, size = 72 }: { percentage: number; status: string; size?: number }) {
  const { colors } = useTheme();
  const strokeWidth = 4;
  const r = (size - strokeWidth) / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - Math.min(percentage / 100, 1));

  let strokeColor = colors.contentPrimary;
  if (status === 'AT_RISK') strokeColor = colors.dangerLight;
  else if (status === 'COMPLETED') strokeColor = colors.success;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={cx} cy={cy} r={r} stroke={colors.progressTrack} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={cx} cy={cy} r={r}
          stroke={strokeColor} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      <Text style={[styles.ringText, { color: strokeColor }]}>{Math.round(percentage)}%</Text>
    </View>
  );
}

export function GoalCard({ goal, onAskPress }: { goal: Goal; onAskPress?: () => void }) {
  const { colors } = useTheme();
  const { setActivePanel } = useCoach();
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.status === 'COMPLETED';

  const statusIcon: FeatherIconName = isCompleted ? 'check-circle' : goal.status === 'AT_RISK' ? 'alert-triangle' : 'trending-up';
  const statusColor = isCompleted ? colors.successDark : goal.status === 'AT_RISK' ? colors.dangerLight : colors.contentPrimary;
  const statusText = isCompleted ? 'Goal reached!' : goal.status === 'AT_RISK' ? 'At risk' : goal.status === 'ON_TRACK' ? 'On track' : 'Active';

  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));

  return (
    <View style={[styles.goalCard, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }, isCompleted && { backgroundColor: colors.successBgLight }]}>
      <View style={styles.goalTop}>
        <ProgressRing percentage={percentage} status={goal.status} />
        <View style={styles.goalInfo}>
          <View style={styles.goalTitleRow}>
            <Text style={[styles.goalTitle, { color: colors.contentPrimary }]}>{goal.title}</Text>
            <View style={[styles.typeBadge, { backgroundColor: colors.surfaceTint }, isCompleted && { backgroundColor: colors.successBg }]}>
              <Text style={[styles.typeBadgeText, { color: colors.contentSecondary }, isCompleted && { color: colors.successDark }]}>
                {isCompleted ? 'Done' : GOAL_TYPE_LABELS[goal.type]}
              </Text>
            </View>
          </View>
          <Text style={[styles.goalAmount, { color: colors.contentSecondary }]}>
            ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
          </Text>
          <View style={styles.statusRow}>
            <Feather name={statusIcon} size={12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            {!isCompleted && (
              <Text style={[styles.confidenceText, { color: colors.contentSecondary }]}> · {Math.round(goal.confidenceScore * 100)}% confidence</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.detailRows}>
        {isCompleted ? (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Final amount</Text>
            <Text style={[styles.detailValue, { color: colors.successDark }]}>${goal.currentAmount.toLocaleString()}</Text>
          </View>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Monthly target</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>${goal.monthlyContributionTarget}/mo</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Est. completion</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>{monthsRemaining <= 1 ? 'This month' : `~${monthsRemaining} months`}</Text>
            </View>
          </>
        )}
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Linked account</Text>
          <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>{goal.linkedAccount}</Text>
        </View>
      </View>

      <View style={styles.milestones}>
        {goal.milestones.map(m => (
          <View key={m.id} style={[
            styles.milestone,
            { backgroundColor: colors.surfaceTint },
            m.reached && !isCompleted && { backgroundColor: colors.contentPrimary },
            m.reached && isCompleted && { backgroundColor: colors.successBg },
          ]}>
            {m.reached && <Feather name="check-circle" size={10} color={isCompleted ? colors.successDark : colors.contentPrimaryInverse} />}
            <Text style={[
              styles.milestoneText,
              { color: colors.contentSecondary },
              m.reached && !isCompleted && { color: colors.contentPrimaryInverse },
              m.reached && isCompleted && { color: colors.successDark },
            ]}>{m.label}</Text>
          </View>
        ))}
      </View>

      {!isCompleted && (
        <Pressable style={[styles.askBtn, { borderColor: colors.surfaceEdge }]} onPress={onAskPress ?? (() => setActivePanel('none'))}>
          <Feather name="message-square" size={13} color={colors.contentPrimary} />
          <Text style={[styles.askBtnText, { color: colors.contentPrimary }]}>Ask about this goal</Text>
        </Pressable>
      )}
    </View>
  );
}

export function SuggestedGoalCard({ goal }: { goal: Goal }) {
  const { colors } = useTheme();
  const { acceptDraftGoal, dismissDraftGoal } = useCoach();
  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));

  return (
    <View style={[styles.suggestedCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.contentBrand, shadowColor: colors.shadowColor }]}>
      <View style={styles.suggestedLabelRow}>
        <View style={[styles.suggestedBadge, { backgroundColor: colors.surfaceTint }]}>
          <Text style={[styles.suggestedBadgeText, { color: colors.contentBrand }]}>Suggested</Text>
        </View>
      </View>
      <View style={styles.goalTop}>
        <View style={styles.goalInfo}>
          <View style={styles.goalTitleRow}>
            <Text style={[styles.goalTitle, { color: colors.contentPrimary }]}>{goal.title}</Text>
            <View style={[styles.typeBadge, { backgroundColor: colors.surfaceTint }]}>
              <Text style={[styles.typeBadgeText, { color: colors.contentSecondary }]}>{GOAL_TYPE_LABELS[goal.type]}</Text>
            </View>
          </View>
          <Text style={[styles.goalAmount, { color: colors.contentSecondary }]}>
            ${goal.targetAmount.toLocaleString()} · ${goal.monthlyContributionTarget}/mo · ~{monthsRemaining} months
          </Text>
          <Text style={[styles.goalAmount, { color: colors.contentSecondary, marginTop: 2 }]}>
            Linked: {goal.linkedAccount}
          </Text>
        </View>
      </View>

      <View style={styles.suggestedButtons}>
        <Pressable style={[styles.suggestedConfirmBtn, { backgroundColor: colors.contentPrimary }]} onPress={() => acceptDraftGoal(goal.id)}>
          <Text style={[styles.suggestedConfirmText, { color: colors.contentPrimaryInverse }]}>Set up goal</Text>
        </Pressable>
        <Pressable style={[styles.suggestedDismissBtn, { borderColor: colors.surfaceEdge }]} onPress={() => dismissDraftGoal(goal.id)}>
          <Text style={[styles.suggestedDismissText, { color: colors.contentSecondary }]}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function GoalsDashboard() {
  const { colors } = useTheme();
  const { goals, setActivePanel } = useCoach();

  const draftGoals = goals.filter(g => g.status === 'DRAFT');
  const activeGoals = goals.filter(g => !['COMPLETED', 'PAUSED', 'DRAFT'].includes(g.status));
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');

  const hasAny = draftGoals.length > 0 || activeGoals.length > 0 || completedGoals.length > 0;

  return (
    <View style={[styles.panel, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="My goals" onBack={() => setActivePanel('none')} />

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
            {draftGoals.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Feather name="star" size={13} color={colors.contentBrand} />
                  <Text style={[styles.sectionHeaderText, { color: colors.contentBrand }]}>Suggested</Text>
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
            {activeGoals.map(g => <GoalCard key={g.id} goal={g} />)}
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
  panel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  content: { flex: 1 },
  contentInner: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  goalCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ringText: {
    position: 'absolute', fontSize: 14, fontFamily: Fonts.medium,
  },
  goalInfo: { flex: 1, minWidth: 0 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  goalTitle: { fontSize: 15, fontFamily: Fonts.medium, lineHeight: 20 },
  typeBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10, fontFamily: Fonts.medium,
    textTransform: 'uppercase',
  },
  goalAmount: { fontSize: 14, fontFamily: Fonts.regular, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  statusText: { fontSize: 12, fontFamily: Fonts.medium },
  confidenceText: { fontSize: 12, fontFamily: Fonts.regular, marginLeft: 4 },
  detailRows: { gap: 6 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 12, fontFamily: Fonts.regular },
  detailValue: { fontSize: 12, fontFamily: Fonts.medium },
  milestones: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  milestone: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999,
  },
  milestoneText: { fontSize: 11, fontFamily: Fonts.medium },
  askBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8, borderRadius: 9999,
    borderWidth: 0.75,
  },
  askBtnText: { fontSize: 14, fontFamily: Fonts.medium },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 14, fontFamily: Fonts.medium, lineHeight: 20,
  },
  suggestedCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 0.75,
    borderStyle: 'dashed',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestedLabelRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  suggestedBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
  },
  suggestedBadgeText: {
    fontSize: 10, fontFamily: Fonts.medium,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  suggestedButtons: {
    flexDirection: 'row', gap: 8,
  },
  suggestedConfirmBtn: {
    borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  suggestedConfirmText: {
    fontSize: 12, fontFamily: Fonts.medium,
  },
  suggestedDismissBtn: {
    borderWidth: 0.75, borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  suggestedDismissText: {
    fontSize: 12, fontFamily: Fonts.medium,
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
