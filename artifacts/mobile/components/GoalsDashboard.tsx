import React, { ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
import Svg, { Circle, Path } from 'react-native-svg';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { Goal, GOAL_TYPE_LABELS } from '@/constants/types';
import { AppBar } from '@/components/AppBar';

function ProgressRing({ percentage, status, size = 72 }: { percentage: number; status: string; size?: number }) {
  const strokeWidth = 4;
  const r = (size - strokeWidth) / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - Math.min(percentage / 100, 1));

  let strokeColor = Colors.contentPrimary;
  if (status === 'AT_RISK') strokeColor = Colors.dangerLight;
  else if (status === 'COMPLETED') strokeColor = Colors.success;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={cx} cy={cy} r={r} stroke={Colors.progressTrack} strokeWidth={strokeWidth} fill="none" />
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

function GoalCard({ goal }: { goal: Goal }) {
  const { setActivePanel } = useCoach();
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.status === 'COMPLETED';

  const statusIcon: FeatherIconName = isCompleted ? 'check-circle' : goal.status === 'AT_RISK' ? 'alert-triangle' : 'trending-up';
  const statusColor = isCompleted ? Colors.successDark : goal.status === 'AT_RISK' ? Colors.dangerLight : Colors.contentPrimary;
  const statusText = isCompleted ? 'Goal reached!' : goal.status === 'AT_RISK' ? 'At risk' : goal.status === 'ON_TRACK' ? 'On track' : 'Active';

  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));

  return (
    <View style={[styles.goalCard, isCompleted && styles.goalCardCompleted]}>
      <View style={styles.goalTop}>
        <ProgressRing percentage={percentage} status={goal.status} />
        <View style={styles.goalInfo}>
          <View style={styles.goalTitleRow}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <View style={[styles.typeBadge, isCompleted && styles.typeBadgeCompleted]}>
              <Text style={[styles.typeBadgeText, isCompleted && { color: Colors.successDark }]}>
                {isCompleted ? 'Done' : GOAL_TYPE_LABELS[goal.type]}
              </Text>
            </View>
          </View>
          <Text style={styles.goalAmount}>
            ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
          </Text>
          <View style={styles.statusRow}>
            <Feather name={statusIcon} size={12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            {!isCompleted && (
              <Text style={styles.confidenceText}> · {Math.round(goal.confidenceScore * 100)}% confidence</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.detailRows}>
        {isCompleted ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Final amount</Text>
            <Text style={[styles.detailValue, { color: Colors.successDark }]}>${goal.currentAmount.toLocaleString()}</Text>
          </View>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Monthly target</Text>
              <Text style={styles.detailValue}>${goal.monthlyContributionTarget}/mo</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Est. completion</Text>
              <Text style={styles.detailValue}>{monthsRemaining <= 1 ? 'This month' : `~${monthsRemaining} months`}</Text>
            </View>
          </>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Linked account</Text>
          <Text style={styles.detailValue}>{goal.linkedAccount}</Text>
        </View>
      </View>

      <View style={styles.milestones}>
        {goal.milestones.map(m => (
          <View key={m.id} style={[
            styles.milestone,
            m.reached && !isCompleted && styles.milestoneReached,
            m.reached && isCompleted && styles.milestoneCompleted,
          ]}>
            {m.reached && <Feather name="check-circle" size={10} color={isCompleted ? Colors.successDark : '#fff'} />}
            <Text style={[
              styles.milestoneText,
              m.reached && !isCompleted && { color: '#fff' },
              m.reached && isCompleted && { color: Colors.successDark },
            ]}>{m.label}</Text>
          </View>
        ))}
      </View>

      {!isCompleted && (
        <Pressable style={styles.askBtn} onPress={() => setActivePanel('none')}>
          <Feather name="message-square" size={13} color={Colors.contentPrimary} />
          <Text style={styles.askBtnText}>Ask about this goal</Text>
        </Pressable>
      )}
    </View>
  );
}

export function GoalsDashboard() {
  const { goals, setActivePanel } = useCoach();

  const activeGoals = goals.filter(g => !['COMPLETED', 'PAUSED'].includes(g.status));
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');

  return (
    <View style={styles.panel}>
      <AppBar variant="back" title="My goals" onBack={() => setActivePanel('none')} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="target" size={32} color={Colors.contentMuted} />
            <Text style={styles.emptyText}>
              No goals yet. Tell the coach what you're working toward and it will help you set one up.
            </Text>
          </View>
        ) : (
          <>
            {activeGoals.map(g => <GoalCard key={g.id} goal={g} />)}
            {activeGoals.length > 0 && completedGoals.length > 0 && (
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>COMPLETED</Text>
                <View style={styles.dividerLine} />
              </View>
            )}
            {completedGoals.map(g => <GoalCard key={g.id} goal={g} />)}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {activeGoals.length} active{completedGoals.length > 0 ? ` · ${completedGoals.length} completed` : ''} · Auto-updated from your accounts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surfaceBase,
    zIndex: 100,
  },
  content: { flex: 1 },
  contentInner: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: 'rgba(10,10,10,0.16)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalCardCompleted: {
    backgroundColor: Colors.successBgLight,
  },
  goalTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ringText: {
    position: 'absolute', fontSize: 13, fontFamily: Fonts.medium,
  },
  goalInfo: { flex: 1, minWidth: 0 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  goalTitle: { fontSize: 15, fontFamily: Fonts.medium, color: Colors.contentPrimary, lineHeight: 20 },
  typeBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
    backgroundColor: Colors.surfaceTint,
  },
  typeBadgeCompleted: { backgroundColor: Colors.successBg },
  typeBadgeText: {
    fontSize: 10, fontFamily: Fonts.medium, color: Colors.contentSecondary,
    textTransform: 'uppercase',
  },
  goalAmount: { fontSize: 13, color: Colors.contentSecondary, fontFamily: Fonts.regular, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  statusText: { fontSize: 12, fontFamily: Fonts.medium },
  confidenceText: { fontSize: 12, color: Colors.contentSecondary, fontFamily: Fonts.regular, marginLeft: 4 },
  detailRows: { gap: 6 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 12, color: Colors.contentSecondary, fontFamily: Fonts.regular },
  detailValue: { fontSize: 12, fontFamily: Fonts.medium, color: Colors.contentPrimary },
  milestones: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  milestone: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999,
    backgroundColor: Colors.surfaceTint,
  },
  milestoneReached: { backgroundColor: Colors.contentPrimary },
  milestoneCompleted: { backgroundColor: Colors.successBg },
  milestoneText: { fontSize: 11, fontFamily: Fonts.medium, color: Colors.contentSecondary },
  askBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8, borderRadius: 9999,
    borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)',
  },
  askBtnText: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentPrimary },
  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.progressTrack },
  dividerText: {
    fontSize: 11, fontFamily: Fonts.medium, color: Colors.contentSecondary,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  empty: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12,
  },
  emptyText: { fontSize: 14, color: Colors.contentSecondary, fontFamily: Fonts.regular, textAlign: 'center', maxWidth: 260 },
  footer: {
    paddingHorizontal: 16, paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: { fontSize: 12, color: Colors.contentSecondary, fontFamily: Fonts.regular },
});
