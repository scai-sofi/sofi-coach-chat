import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, ImageSourcePropType, AccessibilityInfo, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  interpolateColor,
  Easing,
  runOnJS,
  FadeInDown,
  FadeOut,
  ReduceMotion,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { shadowDownTwo } from '@/constants/shadows';
import { useCoach } from '@/context/CoachContext';
import { Goal, GoalType, GoalTabCategory, GOAL_TAB_MAP, GOAL_TAB_LABELS, GOAL_TAB_ORDER, GOAL_TAB_SUBTITLE } from '@/constants/types';
import { AppBar } from '@/components/AppBar';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const goalKidsImg = require('../../assets/images/goal-kids.png');
const goalInvestmentImg = require('../../assets/images/goal-investment.png');
const goalRetirementImg = require('../../assets/images/goal-retirement.png');
const goalTravelImg = require('../../assets/images/goal-travel.png');
const goalHouseImg = require('../../assets/images/goal-house.png');
const goalDebtPayoffImg = require('../../assets/images/goal-debt-payoff.png');
const goalSavingsImg = require('../../assets/images/goal-savings.png');

const GOAL_ILLUSTRATIONS: Partial<Record<GoalType, ImageSourcePropType>> = {
  EMERGENCY_FUND: goalSavingsImg,
  SAVINGS_TARGET: goalSavingsImg,
  CUSTOM: goalSavingsImg,
  DEBT_PAYOFF: goalDebtPayoffImg,
  INVESTMENT: goalInvestmentImg,
};
// Title-specific overrides take precedence over type-based illustrations.
const GOAL_TITLE_ILLUSTRATIONS: Record<string, ImageSourcePropType> = {
  Kids: goalKidsImg,
  Retirement: goalRetirementImg,
  Travel: goalTravelImg,
  House: goalHouseImg,
};

const PROGRESS_SPRING = { damping: 28, stiffness: 60, mass: 1.2, reduceMotion: ReduceMotion.System };
const ILLUSTRATION_SPRING = { damping: 26, stiffness: 80, mass: 0.8, reduceMotion: ReduceMotion.System };
const TAB_SPRING = { damping: 28, stiffness: 200, mass: 0.8, reduceMotion: ReduceMotion.System };
const BUTTON_SPRING_IN = { damping: 22, stiffness: 400, reduceMotion: ReduceMotion.System };
const BUTTON_SPRING_OUT = { damping: 20, stiffness: 300, reduceMotion: ReduceMotion.System };

function AnimatedProgressBar({ percentage, delay = 0, color }: { percentage: number; delay?: number; color?: string }) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    const clampedPct = Math.min(Math.max(percentage, 0), 100);
    progress.value = withDelay(delay, withSpring(clampedPct, PROGRESS_SPRING));
  }, [percentage, delay]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    backgroundColor: color ?? colors.contentPrimary,
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
    left: 0,
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

export function SegmentedTabs({
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
      style={[styles.segmentedContainer, { backgroundColor: colors.progressTrack, borderColor: colors.progressTrack }]}
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

export function GoalCard({ goal, onAskPress, onEditPress, index = 0, skipEnterAnimation = false }: { goal: Goal; onAskPress?: () => void; onEditPress?: () => void; index?: number; skipEnterAnimation?: boolean }) {
  const { colors } = useTheme();
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.status === 'COMPLETED';
  const tabCategory = GOAL_TAB_MAP[goal.type];
  const isPayOff = tabCategory === 'pay-off';
  const illustration = GOAL_TITLE_ILLUSTRATIONS[goal.title] ?? GOAL_ILLUSTRATIONS[goal.type];

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
      entering={skipEnterAnimation ? undefined : FadeInDown.delay(staggerDelay).duration(500).springify().damping(28).stiffness(80).reduceMotion(ReduceMotion.System)}
      style={[styles.goalCardWrapper, isCompleted && { opacity: 0.72 }]}
    >
      <View style={[styles.goalCard, { backgroundColor: colors.surfaceElevated }]}>
      {!isCompleted && illustration && (
        <Animated.View style={[styles.goalIllustration, illustrationStyle]}>
          <Image source={illustration} style={styles.goalIllustrationImage} />
        </Animated.View>
      )}
      <View style={styles.goalHeader}>
        <View style={[styles.goalHeaderText, !isCompleted && illustration && { paddingRight: 112 }]}>
          <Text style={[styles.goalTitle, { color: colors.contentPrimary }]}>{goal.title}</Text>
        </View>
        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: colors.successBg }]}>
            <Feather name="check" size={12} color={colors.successDark} />
            <Text style={[styles.completedBadgeText, { color: colors.successDark }]}>Completed</Text>
          </View>
        )}
      </View>

      <View style={styles.meterSection}>
        <AnimatedProgressBar percentage={percentage} delay={staggerDelay + 400} color={isCompleted ? colors.successDark : undefined} />
        <View style={styles.meterLabels}>
          <Text style={[styles.meterLabel, { color: colors.contentPrimary }]}>
            {isPayOff
              ? `$${goal.currentAmount.toLocaleString()} paid off`
              : `$${goal.currentAmount.toLocaleString()} saved`}
          </Text>
          <Text style={[styles.meterLabel, styles.meterLabelRight, { color: colors.contentPrimary }]}>
            {isPayOff
              ? `$${goal.targetAmount.toLocaleString()} total`
              : `$${goal.targetAmount.toLocaleString()} target`}
          </Text>
        </View>
      </View>

      {!isCompleted && (
        <>
          <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />

          <View style={styles.detailRows}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Est. payoff' : 'Est. completion'}</Text>
              <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>
                ~ {monthsRemaining} months {'\u2022'} {estDate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Payment' : 'Recurring contribution'}</Text>
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
      </View>
    </Animated.View>
  );
}

export function SuggestedGoalCard({
  goal,
  index = 0,
  onAccepted,
}: {
  goal: Goal;
  index?: number;
  onAccepted?: () => void;
}) {
  const { colors } = useTheme();
  const { dismissDraftGoal } = useCoach();
  const tabCategory = GOAL_TAB_MAP[goal.type];
  const isPayOff = tabCategory === 'pay-off';
  const illustration = GOAL_TITLE_ILLUSTRATIONS[goal.title] ?? GOAL_ILLUSTRATIONS[goal.type];

  const hasTarget = goal.targetAmount > 0;
  const hasMonthly = goal.monthlyContributionTarget > 0;
  const hasDate = goal.targetDate && goal.targetDate.getFullYear() > 2000;
  const isPartial = !hasTarget || !hasMonthly || !hasDate;
  const targetDateStr = hasDate
    ? goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;
  const monthsRemaining = hasDate
    ? Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (30 * 86400000)))
    : null;

  const staggerDelay = index * 120;
  const morphProgress = useSharedValue(0);

  const handleAccept = () => {
    morphProgress.value = withTiming(1, {
      duration: 480,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      reduceMotion: ReduceMotion.System,
    }, (finished) => {
      if (finished && onAccepted) {
        runOnJS(onAccepted)();
      }
    });
  };

  const cardAnimStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(morphProgress.value, [0, 1], [colors.surfaceTint, colors.surfaceElevated]);
    const borderW = interpolate(morphProgress.value, [0, 0.5], [1, 0], 'clamp');
    return {
      backgroundColor: bg,
      borderColor: colors.progressTrack,
      borderWidth: borderW,
    };
  });

  // Draft fades out in the first half
  const draftOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(morphProgress.value, [0, 0.5], [1, 0], 'clamp'),
  }));

  // Active fades in over the second half, with slight overlap for a smooth blend
  const activeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(morphProgress.value, [0.4, 1], [0, 1], 'clamp'),
  }));

  // Illustration appears mid-morph
  const illustrationAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(morphProgress.value, [0.35, 0.75], [0, 1], 'clamp'),
    transform: [{ scale: interpolate(morphProgress.value, [0.35, 0.75], [0.88, 1], 'clamp') }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(staggerDelay).duration(500).springify().damping(28).stiffness(80).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(50)}
      style={styles.goalCardWrapper}
    >
      <Animated.View style={[styles.suggestedCard, cardAnimStyle]}>
        {/* Illustration — always in tree, animates in mid-morph */}
        {illustration && (
          <Animated.View style={[styles.goalIllustration, illustrationAnimStyle]}>
            <Image source={illustration} style={styles.goalIllustrationImage} />
          </Animated.View>
        )}

        {/* Draft content — normal flow, drives card height, buttons remain interactive */}
        <Animated.View style={[{ gap: 16 }, draftOpacity]}>
          <View style={styles.goalHeader}>
            <View style={styles.goalHeaderText}>
              <Text style={[styles.goalTitle, { color: colors.contentPrimary }]}>{goal.title}</Text>
            </View>
            <View style={[styles.pendingPill, { backgroundColor: colors.progressTrack }]}>
              <Text style={[styles.pendingPillText, { color: colors.contentSecondary }]}>Proposed by Coach</Text>
            </View>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />

          <View style={styles.detailRows}>
            {hasTarget && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Balance' : 'Target'}</Text>
                <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>${goal.targetAmount.toLocaleString()}</Text>
              </View>
            )}
            {hasMonthly && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Payment' : 'Monthly'}</Text>
                <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>${goal.monthlyContributionTarget}/mo</Text>
              </View>
            )}
            {targetDateStr && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Debt-free by' : 'Target date'}</Text>
                <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>{targetDateStr}</Text>
              </View>
            )}
            {isPartial && (
              <Text style={[styles.partialHint, { color: colors.contentSecondary }]}>
                {'\u2139\uFE0F'} Some details will be set during setup
              </Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <AnimatedButton
              style={[styles.dismissButton, { borderColor: colors.progressTrack }]}
              onPress={() => dismissDraftGoal(goal.id)}
            >
              <Text style={[styles.editButtonText, { color: colors.contentSecondary }]}>Dismiss</Text>
            </AnimatedButton>
            <AnimatedButton
              style={[styles.setupButton, { backgroundColor: colors.contentPrimary }]}
              onPress={handleAccept}
            >
              <Text style={[styles.setupButtonText, { color: colors.contentPrimaryInverse }]}>
                {isPartial ? 'Complete setup' : 'Set up'}
              </Text>
            </AnimatedButton>
          </View>
        </Animated.View>

        {/* Active goal-card content — absolute overlay, fades in over draft, non-interactive */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16, gap: 16 }, activeOpacity]}
          pointerEvents="none"
        >
          <View style={styles.goalHeader}>
            <View style={styles.goalHeaderText}>
              <Text style={[styles.goalTitle, { color: colors.contentPrimary }]}>{goal.title}</Text>
            </View>
          </View>

          <View style={styles.meterSection}>
            <AnimatedProgressBar percentage={0} delay={0} />
            <View style={styles.meterLabels}>
              <Text style={[styles.meterLabel, { color: colors.contentPrimary }]}>$0 saved</Text>
              {hasTarget && (
                <Text style={[styles.meterLabel, styles.meterLabelRight, { color: colors.contentPrimary }]}>
                  ${goal.targetAmount.toLocaleString()} target
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: colors.progressTrack }]} />

          <View style={styles.detailRows}>
            {monthsRemaining && targetDateStr && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Est. payoff' : 'Est. completion'}</Text>
                <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>~ {monthsRemaining} months {'\u2022'} {targetDateStr}</Text>
              </View>
            )}
            {hasMonthly && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>{isPayOff ? 'Payment' : 'Recurring contribution'}</Text>
                <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>${goal.monthlyContributionTarget}/mo</Text>
              </View>
            )}
            {goal.linkedAccount && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.contentSecondary }]}>Linked account</Text>
                <Text style={[styles.detailValue, { color: colors.contentPrimary }]}>{goal.linkedAccount}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export function GoalsDashboard() {
  const { colors } = useTheme();
  const { goals, setActivePanel, acceptDraftGoal } = useCoach();
  const [activeTab, setActiveTab] = useState<GoalTabCategory>('save-up');
  const [recentlyAccepted, setRecentlyAccepted] = useState<string | null>(null);

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
                  <Text style={[styles.sectionHeaderText, { color: colors.contentSecondary }]}>Suggested</Text>
                </View>
                {draftGoals
                  .filter(g => GOAL_TAB_MAP[g.type] === activeTab)
                  .map((g, i) => (
                    <SuggestedGoalCard
                      key={g.id}
                      goal={g}
                      index={i}
                      onAccepted={() => {
                        setRecentlyAccepted(g.id);
                        acceptDraftGoal(g.id);
                      }}
                    />
                  ))}
              </>
            )}

            {activeGoals.map((g, i) => (
              <GoalCard
                key={g.id}
                goal={g}
                index={i}
                skipEnterAnimation={g.id === recentlyAccepted}
                onAskPress={() => setActivePanel('none')}
              />
            ))}

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
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    height: 40,
    alignItems: 'center',
    borderWidth: 2,
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
    lineHeight: 16,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  goalCardWrapper: {
    paddingTop: 48,
  },
  goalCard: {
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 16,
    ...shadowDownTwo,
    overflow: 'visible',
  },
  suggestedCard: {
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 16,
    overflow: 'visible',
  },
  goalIllustration: {
    position: 'absolute',
    top: -64,
    right: -4,
    width: 144,
    height: 144,
    zIndex: 1,
  },
  goalIllustrationImage: {
    width: 144,
    height: 144,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    borderWidth: 1.5,
    borderColor: '#65cae5',      // blue450 / contentBrand border
  },
  askCoachButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
    color: '#00a2c7',            // contentBrand
  },
  dismissButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
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
  suggestedBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  pendingPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pendingPillText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
  },
  partialHint: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 16,
    marginTop: 2,
  },
  goalTitle: {
    fontSize: 20,
    fontFamily: Fonts.medium,
    lineHeight: 24,
    letterSpacing: -0.2,
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
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  completedBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
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
