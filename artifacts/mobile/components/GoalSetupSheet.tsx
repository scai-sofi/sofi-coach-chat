import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS, SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useCoach, PendingGoalSetup } from '@/context/CoachContext';
import { Fonts } from '@/constants/fonts';
import { GoalType } from '@/constants/types';

const SLIDE_DISTANCE = 800;

const GOAL_TYPES: { type: GoalType; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { type: 'EMERGENCY_FUND', label: 'Emergency Fund', icon: 'shield' },
  { type: 'DEBT_PAYOFF', label: 'Debt Payoff', icon: 'trending-down' },
  { type: 'SAVINGS_TARGET', label: 'Savings Target', icon: 'target' },
  { type: 'INVESTMENT', label: 'Investment', icon: 'bar-chart-2' },
  { type: 'CUSTOM', label: 'Custom Goal', icon: 'star' },
];

const LINKED_ACCOUNTS = [
  'SoFi Checking',
  'SoFi Savings',
  'SoFi Credit Card',
  'SoFi Invest',
  'SoFi Money',
];

function formatCurrency(val: number): string {
  return val.toLocaleString('en-US');
}

function parseCurrency(str: string): number {
  const cleaned = str.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

type Step = 1 | 2 | 3 | 4;

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { colors } = useTheme();
  return (
    <View style={stepStyles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            {
              backgroundColor: i < current ? colors.contentPrimary : colors.progressTrack,
              width: i + 1 === current ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 12 },
  dot: { height: 6, borderRadius: 3 },
});

export function GoalSetupSheet() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { pendingGoalSetup, createGoalFromSetup, cancelGoalSetup } = useCoach();
  const [visible, setVisible] = useState(false);
  const [setup, setSetup] = useState<PendingGoalSetup | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [linkedAccount, setLinkedAccount] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('SAVINGS_TARGET');

  const slideX = useSharedValue(SLIDE_DISTANCE);

  useEffect(() => {
    if (pendingGoalSetup) {
      const p = pendingGoalSetup.proposal;
      setSetup(pendingGoalSetup);
      if (p) {
        setTitle(p.title);
        setTargetAmount(formatCurrency(p.targetAmount));
        setMonthlyContribution(formatCurrency(p.monthlyContribution));
        setTargetDate(p.targetDate);
        setLinkedAccount(p.linkedAccount);
        setGoalType(p.type);
        setStep(4);
      } else {
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 6);
        setTitle('');
        setTargetAmount('');
        setMonthlyContribution('');
        setTargetDate(defaultDate);
        setLinkedAccount('');
        setGoalType('SAVINGS_TARGET');
        setStep(1);
      }
      setDirection('forward');
      setVisible(true);
      slideX.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
    } else if (visible) {
      dismiss();
    }
  }, [pendingGoalSetup]);

  const onDismissComplete = () => {
    setVisible(false);
    cancelGoalSetup();
  };

  const dismiss = () => {
    slideX.value = withTiming(SLIDE_DISTANCE, { duration: 260, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onDismissComplete)();
    });
  };

  const goNext = useCallback(() => {
    setDirection('forward');
    setStep(s => Math.min(s + 1, 4) as Step);
  }, []);

  const goBack = useCallback(() => {
    if (step === 1) {
      dismiss();
      return;
    }
    setDirection('back');
    setStep(s => Math.max(s - 1, 1) as Step);
  }, [step]);

  const handleCreate = () => {
    if (!setup) return;
    createGoalFromSetup({
      type: goalType,
      title: title.trim(),
      targetAmount: parseCurrency(targetAmount),
      targetDate,
      monthlyContribution: parseCurrency(monthlyContribution),
      linkedAccount,
    }, setup.messageId ?? undefined);
  };

  const selectType = (type: GoalType) => {
    setGoalType(type);
    const label = GOAL_TYPES.find(g => g.type === type)?.label || '';
    if (!title) setTitle(label);
    setDirection('forward');
    setStep(2);
  };

  const adjustMonth = (delta: number) => {
    setTargetDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      if (d <= new Date()) return prev;
      return d;
    });
  };

  const animatedPanel = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  if (!visible) return null;

  const isNewGoal = !setup?.proposal;
  const step2Valid = title.trim().length > 0 && parseCurrency(targetAmount) > 0;
  const step3Valid = parseCurrency(monthlyContribution) > 0 && linkedAccount.length > 0;
  const reviewValid = step2Valid && step3Valid;

  return (
    <Animated.View style={[styles.fullScreen, animatedPanel, { backgroundColor: colors.surfaceBase }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={goBack} hitSlop={12}>
          <Feather name="chevron-left" size={24} color={colors.contentPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <StepIndicator current={step} total={4} />
        </View>
        <Pressable style={styles.closeBtn} onPress={dismiss} hitSlop={12}>
          <Feather name="x" size={22} color={colors.contentPrimary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        {step === 1 && (
          <Animated.View
            key="step1"
            entering={direction === 'forward' ? SlideInRight.duration(280) : SlideInLeft.duration(280)}
            exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
            style={styles.stepContainer}
          >
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>What are you saving for?</Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                Choose a goal type to get started.
              </Text>

              <View style={styles.typeList}>
                {GOAL_TYPES.map(({ type, label, icon }) => {
                  const selected = type === goalType;
                  return (
                    <Pressable
                      key={type}
                      style={[
                        styles.typeRow,
                        { backgroundColor: colors.surfaceElevated, borderColor: selected ? colors.contentPrimary : colors.surfaceEdge },
                        selected && { borderWidth: 2 },
                      ]}
                      onPress={() => selectType(type)}
                    >
                      <View style={[styles.typeIconWrap, { backgroundColor: colors.surfaceTint }]}>
                        <Feather name={icon} size={18} color={colors.contentPrimary} />
                      </View>
                      <Text style={[styles.typeLabel, { color: colors.contentPrimary }]}>{label}</Text>
                      <Feather name="chevron-right" size={18} color={colors.contentMuted} />
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View
            key="step2"
            entering={direction === 'forward' ? SlideInRight.duration(280) : SlideInLeft.duration(280)}
            exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
            style={styles.stepContainer}
          >
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>Customize your goal</Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                Give it a name and set your target.
              </Text>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>Name</Text>
                <TextInput
                  style={[styles.fieldInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Credit Card Payoff"
                  placeholderTextColor={colors.contentDimmed}
                  autoFocus
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>Goal</Text>
                <View style={[styles.currencyInput, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.currencySign, { color: colors.contentSecondary }]}>$</Text>
                  <TextInput
                    style={[styles.currencyField, { color: colors.contentPrimary }]}
                    value={targetAmount}
                    onChangeText={setTargetAmount}
                    keyboardType="numeric"
                    placeholder="10,000"
                    placeholderTextColor={colors.contentDimmed}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[styles.nextBtn, { backgroundColor: step2Valid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={goNext}
                disabled={!step2Valid}
              >
                <Text style={[styles.nextBtnText, { color: '#ffffff' }]}>Next</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View
            key="step3"
            entering={direction === 'forward' ? SlideInRight.duration(280) : SlideInLeft.duration(280)}
            exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
            style={styles.stepContainer}
          >
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>How do you want to save?</Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                Set up your contribution and timeline.
              </Text>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>Monthly contribution</Text>
                <View style={[styles.currencyInput, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.currencySign, { color: colors.contentSecondary }]}>$</Text>
                  <TextInput
                    style={[styles.currencyField, { color: colors.contentPrimary }]}
                    value={monthlyContribution}
                    onChangeText={setMonthlyContribution}
                    keyboardType="numeric"
                    placeholder="500"
                    placeholderTextColor={colors.contentDimmed}
                    autoFocus
                  />
                  <Text style={[styles.perMonthLabel, { color: colors.contentSecondary }]}>/mo</Text>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>Target date</Text>
                <View style={styles.dateSelector}>
                  <Pressable onPress={() => adjustMonth(-1)} style={[styles.dateArrow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]} hitSlop={8}>
                    <Feather name="chevron-left" size={18} color={colors.contentPrimary} />
                  </Pressable>
                  <View style={[styles.dateDisplay, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                    <Text style={[styles.dateText, { color: colors.contentPrimary }]}>{formatMonthYear(targetDate)}</Text>
                  </View>
                  <Pressable onPress={() => adjustMonth(1)} style={[styles.dateArrow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]} hitSlop={8}>
                    <Feather name="chevron-right" size={18} color={colors.contentPrimary} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>Linked account</Text>
                <View style={styles.accountOptions}>
                  {LINKED_ACCOUNTS.map(acct => {
                    const selected = acct === linkedAccount;
                    return (
                      <Pressable
                        key={acct}
                        style={[
                          styles.accountRow,
                          { backgroundColor: colors.surfaceElevated, borderColor: selected ? colors.contentPrimary : colors.surfaceEdge },
                          selected && { borderWidth: 2 },
                        ]}
                        onPress={() => setLinkedAccount(acct)}
                      >
                        <View style={[styles.radio, { borderColor: selected ? colors.contentPrimary : colors.contentMuted }]}>
                          {selected && <View style={[styles.radioFill, { backgroundColor: colors.contentPrimary }]} />}
                        </View>
                        <Text style={[styles.accountLabel, { color: colors.contentPrimary }]}>{acct}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[styles.nextBtn, { backgroundColor: step3Valid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={goNext}
                disabled={!step3Valid}
              >
                <Text style={[styles.nextBtnText, { color: '#ffffff' }]}>Next</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {step === 4 && (
          <Animated.View
            key="step4"
            entering={direction === 'forward' ? SlideInRight.duration(280) : SlideInLeft.duration(280)}
            exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
            style={styles.stepContainer}
          >
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>Review your goal</Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                Everything look right? You can edit anytime.
              </Text>

              <View style={[styles.reviewCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.reviewIconWrap, { backgroundColor: colors.surfaceTint }]}>
                    <Feather name="target" size={20} color={colors.contentPrimary} />
                  </View>
                  <View style={styles.reviewHeaderText}>
                    <Text style={[styles.reviewName, { color: colors.contentPrimary }]}>{title || 'Untitled Goal'}</Text>
                    <Text style={[styles.reviewType, { color: colors.contentSecondary }]}>
                      {GOAL_TYPES.find(g => g.type === goalType)?.label || 'Custom'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.reviewDivider, { backgroundColor: colors.surfaceEdge }]} />

                <View style={styles.reviewRows}>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>Target</Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>
                      ${formatCurrency(parseCurrency(targetAmount))}
                    </Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>Monthly</Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>
                      ${formatCurrency(parseCurrency(monthlyContribution))}/mo
                    </Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>Timeline</Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>{formatMonthYear(targetDate)}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>Account</Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>{linkedAccount || '—'}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[styles.nextBtn, { backgroundColor: reviewValid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={handleCreate}
                disabled={!reviewValid}
              >
                <Text style={[styles.nextBtnText, { color: '#ffffff' }]}>Create goal</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    lineHeight: 30,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 21,
    marginBottom: 28,
  },
  typeList: {
    gap: 10,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  typeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontFamily: Fonts.regular,
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  currencySign: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    marginRight: 4,
  },
  currencyField: {
    flex: 1,
    fontSize: 17,
    fontFamily: Fonts.regular,
    padding: 0,
  },
  perMonthLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginLeft: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateArrow: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDisplay: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  accountOptions: {
    gap: 8,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  accountLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  reviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 14,
  },
  reviewIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewHeaderText: {
    flex: 1,
    gap: 2,
  },
  reviewName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    lineHeight: 22,
  },
  reviewType: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  reviewDivider: {
    height: 1,
    marginHorizontal: 20,
  },
  reviewRows: {
    padding: 20,
    gap: 14,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  reviewValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  nextBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
