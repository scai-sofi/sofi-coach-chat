import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, ImageSourcePropType, AccessibilityInfo, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  Easing,
  runOnJS,
  FadeInDown,
  ReduceMotion,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { Goal, GoalType, GoalTabCategory, GOAL_TAB_MAP, GOAL_TAB_LABELS, GOAL_TAB_ORDER, GOAL_TAB_SUBTITLE } from '../constants/types';
import { AppBar } from './AppBar';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const goalHouseImg = require('../../assets/images/goal-house.png');
const goalPagodaImg = require('../../assets/images/goal-pagoda.png');

const GOAL_ILLUSTRATIONS: Partial<Record<GoalType, ImageSourcePropType>> = {
  EMERGENCY_FUND: goalHouseImg,
  SAVINGS_TARGET: goalHouseImg,
  DEBT_PAYOFF: goalPagodaImg,
  INVESTMENT: goalPagodaImg,
  CUSTOM: goalHouseImg,
};

const PROGRESS_SPRING = { damping: 28, stiffness: 60, mass: 1.2, reduceMotion: ReduceMotion.System };
const ILLUSTRATION_SPRING = { damping: 14, stiffness: 100, mass: 0.8, reduceMotion: ReduceMotion.System };
const TAB_SPRING = { damping: 22, stiffness: 200, mass: 0.8, reduceMotion: ReduceMotion.System };
const BUTTON_SPRING_IN = { damping: 15, stiffness: 400, reduceMotion: ReduceMotion.System };
const BUTTON_SPRING_OUT = { damping: 12, stiffness: 300, reduceMotion: ReduceMotion.System };

function AnimatedProgressBar({ percentage, delay = 0 }: { percentage: number; delay?: number }) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    const clampedPct = Math.min(Math.max(percentage, 0), 100);
    progress.value = withDelay(delay, withSpring(clampedPct, PROGRESS_SPRING));
  }, [percentage, delay]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    backgroundColor: colors.contentPrimary,
    height: '100%',
    borderRadius: 20,
  }));

  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
      <Animated.View style={fillStyle} />
    </View>
  );
}

function AnimatedPercentage({ value, delay = 0 }: { value: number; delay?: number }) {
  const { colors } = useTheme();
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  const updateDisplay = (v: number) => {
    setDisplayValue(Math.round(v));
  };

  useEffect(() => {
    animatedValue.value = withDelay(
      delay,
      withTiming(value, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );
  }, [value, delay]);

  useAnimatedReaction(
    () => animatedValue.value,
    (current) => {
      runOnJS(updateDisplay)(current);
    }
  );

  return (
    <View style={styles.percentageRow}>
      <Text style={[styles.percentageNumber, { color: colors.contentPrimary }]}>{displayValue}</Text>
      <Text style={[styles.percentageSign, { color: colors.contentPrimary }]}>%</Text>
    </View>
  );
}

function AnimatedTabIndicator({
  tabIndex,
  tabCount,
  containerWidth,
}: {
  tabIndex: number;
  tabCount: number;
  containerWidth: number;
}) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const tabWidth = containerWidth > 0 ? (containerWidth - 4) / tabCount : 0;

  useEffect(() => {
    translateX.value = withSpring(tabIndex * tabWidth, TAB_SPRING);
  }, [tabIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
    height: '100%',
    position: 'absolute' as const,
    left: 2,
    top: 0,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  }));

  if (containerWidth === 0) return null;

  return <Animated.View style={indicatorStyle} />;
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
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = tabs.findIndex(t => t.key === activeTab);

  return (
    <View
      style={[styles.segmentedContainer, { backgroundColor: colors.progressTrack }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <AnimatedTabIndicator
        tabIndex={activeIndex}
        tabCount={tabs.length}
        containerWidth={containerWidth}
      />
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={styles.segmentedTab}
            onPress={() => onTabChange(tab.key)}
          >
            <Animated.Text
              style={[
                styles.segmentedTabText,
                { color: isActive ? colors.contentPrimary : colors.contentSecondary },
              ]}
              numberOfLines={1}
            >
              {tab.label} {'\u2022'} {tab.count}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AnimatedButton({ onPress, style, children }: { onPress?: () => void; style: any; children: React.ReactNode }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, BUTTON_SPRING_IN);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, BUTTON_SPRING_OUT);
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ flex: 1 }}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function GoalCard({ goal, onAskPress, onEditPress, index = 0 }: { goal: Goal; onAskPress?: () => void; onEditPress?: () => void; index?: number }) {
  const { colors } = useTheme();
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.status === 'COMPLETED';
  const tabCategory = GOAL_TAB_MAP[goal.type];
  const subtitle = `${GOAL_TAB_SUBTITLE[tabCategory]} ${goal.title}`;
  const illustration = GOAL_ILLUSTRATIONS[goal.type];

  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));
  const estDate = goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const staggerDelay = index * 120;
  const illustrationScale = useSharedValue(0);

  useEffect(() => {
    illustrationScale.value = withDelay(
      staggerDelay + 300,
      withSpring(1, ILLUSTRATION_SPRING)
    );
  }, []);

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: illustrationScale.value }],
    opacity: interpolate(illustrationScale.value, [0, 0.5, 1], [0, 0.8, 1]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(staggerDelay).duration(500).springify().damping(18).stiffness(100).reduceMotion(ReduceMotion.System)}
      style={[styles.goalCard, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}
    >
      {illustration && (
        <Animated.View style={[styles.goalIllustration, illustrationStyle]}>
          <Image source={illustration} style={styles.goalIllustrationImage} />
        </Animated.View>
      )}
      <View style={styles.goalHeader}>
        <View style={styles.goalHeaderText}>
          <AnimatedPercentage value={percentage} delay={staggerDelay + 200} />
          <Text style={[styles.goalSubtitle, { color: colors.contentSecondary }]}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.meterSection}>
        <AnimatedProgressBar percentage={percentage} delay={staggerDelay + 400} />
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
            <AnimatedButton
              onPress={onEditPress}
              style={[styles.editButton, { borderColor: colors.borderMedium }]}
            >
              <Text style={[styles.editButtonText, { color: colors.contentPrimary }]}>Edit</Text>
            </AnimatedButton>
            <AnimatedButton
              onPress={onAskPress}
              style={styles.askCoachButton}
            >
              <Text style={styles.askCoachButtonText}>Ask Coach</Text>
            </AnimatedButton>
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
    </Animated.View>
  );
}

export function SuggestedGoalCard({ goal, index = 0 }: { goal: Goal; index?: number }) {
  const { colors } = useTheme();
  const { acceptDraftGoal, dismissDraftGoal } = useCoach();
  const tabCategory = GOAL_TAB_MAP[goal.type];
  const subtitle = `${GOAL_TAB_SUBTITLE[tabCategory]} ${goal.title}`;
  const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)));

  const staggerDelay = index * 120;

  return (
    <Animated.View
      entering={FadeInDown.delay(staggerDelay).duration(500).springify().damping(18).stiffness(100).reduceMotion(ReduceMotion.System)}
      style={[styles.suggestedCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.contentBrand, shadowColor: colors.shadowColor }]}
    >
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
        <AnimatedButton style={[styles.editButton, { borderColor: colors.surfaceEdge }]} onPress={() => dismissDraftGoal(goal.id)}>
          <Text style={[styles.editButtonText, { color: colors.contentSecondary }]}>Dismiss</Text>
        </AnimatedButton>
        <AnimatedButton style={[styles.setupButton, { backgroundColor: colors.contentPrimary }]} onPress={() => acceptDraftGoal(goal.id)}>
          <Text style={[styles.setupButtonText, { color: colors.contentPrimaryInverse }]}>Set up goal</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
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
                  .map((g, i) => <SuggestedGoalCard key={g.id} goal={g} index={i} />)}
              </>
            )}

            {activeGoals.map((g, i) => (
              <GoalCard key={g.id} goal={g} index={i} onAskPress={() => setActivePanel('none')} />
            ))}

            {activeGoals.length > 0 && completedGoals.length > 0 && (
              <View style={styles.sectionDivider}>
                <View style={[styles.sectionDividerLine, { backgroundColor: colors.progressTrack }]} />
                <Text style={[styles.sectionDividerText, { color: colors.contentSecondary }]}>COMPLETED</Text>
                <View style={[styles.sectionDividerLine, { backgroundColor: colors.progressTrack }]} />
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
    height: 40,
    alignItems: 'center',
  },
  segmentedTab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    zIndex: 1,
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
    overflow: 'hidden',
  },
  goalIllustration: {
    position: 'absolute',
    top: -4,
    right: 0,
    width: 94,
    height: 94,
    zIndex: 1,
  },
  goalIllustrationImage: {
    width: 94,
    height: 94,
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
