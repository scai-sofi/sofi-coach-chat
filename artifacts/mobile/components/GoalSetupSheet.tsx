import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing, runOnJS } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useCoach, PendingGoalSetup } from '@/context/CoachContext';
import { Fonts } from '@/constants/fonts';
import { GoalType } from '@/constants/types';

type GoalCategory = 'save-up' | 'pay-down' | 'investment';

interface DebtAccount {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  balance: number;
  apr: number;
  minPayment: number;
}

const DEBT_ACCOUNTS: DebtAccount[] = [
  { id: 'cc1', name: 'SoFi Credit Card', icon: 'credit-card', balance: 4820, apr: 15.99, minPayment: 96 },
  { id: 'pl1', name: 'SoFi Personal Loan', icon: 'file-text', balance: 12400, apr: 8.49, minPayment: 248 },
  { id: 'sl1', name: 'Student Loans', icon: 'book-open', balance: 28750, apr: 5.25, minPayment: 320 },
];

const CATEGORIES: { key: GoalCategory; label: string; subtitle: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'save-up', label: 'Save up', subtitle: 'Set aside money for something you want', icon: 'target' },
  { key: 'pay-down', label: 'Pay down', subtitle: 'Track progress paying off debt', icon: 'trending-down' },
  { key: 'investment', label: 'Investment', subtitle: 'Grow your money over time', icon: 'bar-chart-2' },
];

const SAVE_UP_ITEMS: { label: string; icon: keyof typeof Feather.glyphMap; goalType: GoalType }[] = [
  { label: 'Emergency Fund', icon: 'shield', goalType: 'EMERGENCY_FUND' },
  { label: 'Travel', icon: 'map-pin', goalType: 'SAVINGS_TARGET' },
  { label: 'Kids', icon: 'smile', goalType: 'SAVINGS_TARGET' },
  { label: 'House', icon: 'home', goalType: 'SAVINGS_TARGET' },
  { label: 'Car', icon: 'truck', goalType: 'SAVINGS_TARGET' },
  { label: 'Dining Out', icon: 'coffee', goalType: 'SAVINGS_TARGET' },
  { label: 'Splurge', icon: 'gift', goalType: 'SAVINGS_TARGET' },
  { label: 'Taxes', icon: 'file-text', goalType: 'SAVINGS_TARGET' },
  { label: 'Wedding', icon: 'heart', goalType: 'SAVINGS_TARGET' },
  { label: 'Other', icon: 'plus-circle', goalType: 'CUSTOM' },
];

const LINKED_ACCOUNTS = [
  'SoFi Checking',
  'SoFi Savings',
  'SoFi Credit Card',
  'SoFi Invest',
  'SoFi Money',
];

const TOTAL_PAGES = 5;
const STEP_SPRING = { damping: 24, stiffness: 220, mass: 0.8 };

function formatCurrency(val: number): string {
  return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function parseCurrency(str: string): number {
  const cleaned = str.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function pageToStep(page: number): number {
  if (page <= 1) return 1;
  if (page === 2) return 2;
  if (page === 3) return 3;
  return 4;
}

function calcDebtPayoff(balance: number, apr: number, monthlyPayment: number): { months: number; totalInterest: number } {
  if (monthlyPayment <= 0 || balance <= 0) return { months: 0, totalInterest: 0 };
  const monthlyRate = apr / 100 / 12;
  let remaining = balance;
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 600;
  while (remaining > 0.01 && months < maxMonths) {
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    const principal = monthlyPayment - interest;
    if (principal <= 0) return { months: maxMonths, totalInterest: balance * 10 };
    remaining -= principal;
    months++;
  }
  return { months, totalInterest: Math.round(totalInterest) };
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { colors } = useTheme();
  return (
    <View style={stepStyles.row}>
      {Array.from({ length: total }, (_, i) => {
        const isActive = i + 1 === current;
        const isPast = i < current;
        return (
          <View
            key={i}
            style={[
              stepStyles.dot,
              {
                backgroundColor: isPast ? colors.contentPrimary : colors.progressTrack,
                width: isActive ? 24 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 12 },
  dot: { height: 6, borderRadius: 3 },
});

const CATEGORY_TO_TYPE: Record<GoalCategory, GoalType> = {
  'save-up': 'SAVINGS_TARGET',
  'pay-down': 'DEBT_PAYOFF',
  'investment': 'INVESTMENT',
};

const GOAL_TYPE_DISPLAY: Record<GoalType, string> = {
  EMERGENCY_FUND: 'Save up',
  DEBT_PAYOFF: 'Pay down',
  SAVINGS_TARGET: 'Save up',
  INVESTMENT: 'Investment',
  CUSTOM: 'Save up',
};

export function GoalSetupSheet() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { pendingGoalSetup, createGoalFromSetup, cancelGoalSetup } = useCoach();
  const [visible, setVisible] = useState(false);
  const [setup, setSetup] = useState<PendingGoalSetup | null>(null);

  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<GoalCategory | null>(null);
  const [selectedDebt, setSelectedDebt] = useState<DebtAccount | null>(null);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [linkedAccount, setLinkedAccount] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('SAVINGS_TARGET');

  const panelX = useSharedValue(screenWidth);
  const stripX = useSharedValue(0);

  const goToPage = (p: number) => {
    setPage(p);
    stripX.value = withSpring(-p * screenWidth, STEP_SPRING);
  };

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
        const cat = p.type === 'DEBT_PAYOFF' ? 'pay-down' : p.type === 'INVESTMENT' ? 'investment' : 'save-up';
        setCategory(cat);
        setSelectedDebt(null);
        setPage(4);
        stripX.value = -4 * screenWidth;
      } else {
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 6);
        setTitle('');
        setTargetAmount('');
        setMonthlyContribution('');
        setTargetDate(defaultDate);
        setLinkedAccount('');
        setGoalType('SAVINGS_TARGET');
        setCategory(null);
        setSelectedDebt(null);
        setPage(0);
        stripX.value = 0;
      }
      setVisible(true);
      panelX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else if (visible) {
      dismiss();
    }
  }, [pendingGoalSetup]);

  const onDismissComplete = () => {
    setVisible(false);
    cancelGoalSetup();
  };

  const dismiss = () => {
    panelX.value = withTiming(screenWidth, { duration: 250, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onDismissComplete)();
    });
  };

  const goNext = useCallback(() => {
    const next = Math.min(page + 1, TOTAL_PAGES - 1);
    goToPage(next);
  }, [page, screenWidth]);

  const goBack = useCallback(() => {
    if (page === 0) {
      dismiss();
      return;
    }
    if (page === 2 && category === 'investment') {
      goToPage(0);
      return;
    }
    goToPage(page - 1);
  }, [page, category, screenWidth]);

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

  const selectCategory = (cat: GoalCategory) => {
    setCategory(cat);
    if (cat === 'save-up' || cat === 'pay-down') {
      goToPage(1);
    } else {
      setGoalType(CATEGORY_TO_TYPE[cat]);
      setTitle('Investment');
      goToPage(2);
    }
  };

  const selectSaveUpItem = (item: typeof SAVE_UP_ITEMS[0]) => {
    setGoalType(item.goalType);
    setTitle(item.label);
    goToPage(2);
  };

  const selectDebtAccount = (debt: DebtAccount) => {
    setSelectedDebt(debt);
    setGoalType('DEBT_PAYOFF');
    setTitle(`Pay off ${debt.name}`);
    setTargetAmount(formatCurrency(debt.balance));
    setLinkedAccount(debt.name);
    goToPage(2);
  };

  const adjustMonth = (delta: number) => {
    setTargetDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      if (d <= new Date()) return prev;
      return d;
    });
  };

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: panelX.value }],
  }));

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: stripX.value }],
  }));

  if (!visible) return null;

  const isPayDown = category === 'pay-down';
  const step2Valid = title.trim().length > 0 && parseCurrency(targetAmount) > 0;
  const step3Valid = parseCurrency(monthlyContribution) > 0 && (isPayDown || linkedAccount.length > 0);
  const reviewValid = step2Valid && step3Valid;
  const displayStep = pageToStep(page);

  const target = parseCurrency(targetAmount);
  const monthsUntil = Math.max(1, Math.round((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)));
  const currentMonthly = parseCurrency(monthlyContribution);

  const debtEstimate = useMemo(() => {
    if (!isPayDown || !selectedDebt || target <= 0) return null;
    const minOnly = calcDebtPayoff(target, selectedDebt.apr, selectedDebt.minPayment);
    const withExtra = currentMonthly > selectedDebt.minPayment
      ? calcDebtPayoff(target, selectedDebt.apr, currentMonthly)
      : null;
    const suggestedPayment = Math.ceil(target / monthsUntil + (target * selectedDebt.apr / 100 / 12));
    const withSuggested = calcDebtPayoff(target, selectedDebt.apr, suggestedPayment);
    return { minOnly, withExtra, suggestedPayment, withSuggested };
  }, [isPayDown, selectedDebt, target, currentMonthly, monthsUntil]);

  const saveUpEstimate = useMemo(() => {
    if (isPayDown || target <= 0) return null;
    const suggestedMonthly = Math.ceil(target / monthsUntil);
    const projectedTotal = currentMonthly * monthsUntil;
    const onTrack = currentMonthly > 0 && projectedTotal >= target;
    const shortfall = target - projectedTotal;
    return { suggestedMonthly, projectedTotal, onTrack, shortfall };
  }, [isPayDown, target, monthsUntil, currentMonthly]);

  return (
    <Animated.View style={[styles.fullScreen, panelStyle, { backgroundColor: colors.surfaceBase }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={goBack} hitSlop={12}>
          <Feather name="chevron-left" size={24} color={colors.contentPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <StepIndicator current={displayStep} total={4} />
        </View>
        <Pressable style={styles.closeBtn} onPress={dismiss} hitSlop={12}>
          <Feather name="x" size={22} color={colors.contentPrimary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Animated.View style={[styles.strip, { width: screenWidth * TOTAL_PAGES }, stripStyle]}>

          {/* Page 0: Category selection */}
          <View style={[styles.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>Create a goal</Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                What type of goal do you want to set up?
              </Text>
              <View style={styles.categoryList}>
                {CATEGORIES.map(({ key, label, subtitle, icon }) => (
                  <Pressable
                    key={key}
                    style={[styles.categoryCard, { backgroundColor: colors.surfaceElevated }]}
                    onPress={() => selectCategory(key)}
                  >
                    <View style={[styles.categoryIconWrap, { backgroundColor: colors.surfaceTint }]}>
                      <Feather name={icon} size={22} color={colors.contentPrimary} />
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={[styles.categoryLabel, { color: colors.contentPrimary }]}>{label}</Text>
                      <Text style={[styles.categorySubtitle, { color: colors.contentSecondary }]}>{subtitle}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.contentMuted} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Page 1: Sub-selection — vault list (save-up) or debt accounts (pay-down) */}
          <View style={[styles.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              {category === 'pay-down' ? (
                <>
                  <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>Which account?</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                    Select the debt you want to pay down. We'll pull in your current balance.
                  </Text>
                  <View style={styles.debtList}>
                    {DEBT_ACCOUNTS.map((debt) => (
                      <Pressable
                        key={debt.id}
                        style={[styles.debtCard, { backgroundColor: colors.surfaceElevated }]}
                        onPress={() => selectDebtAccount(debt)}
                      >
                        <View style={styles.debtCardTop}>
                          <View style={[styles.debtIconWrap, { backgroundColor: colors.surfaceTint }]}>
                            <Feather name={debt.icon} size={18} color={colors.contentPrimary} />
                          </View>
                          <View style={styles.debtCardInfo}>
                            <Text style={[styles.debtName, { color: colors.contentPrimary }]}>{debt.name}</Text>
                            <Text style={[styles.debtBalance, { color: colors.contentPrimary }]}>
                              ${formatCurrency(debt.balance)}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.debtCardDivider, { backgroundColor: colors.surfaceEdge }]} />
                        <View style={styles.debtCardBottom}>
                          <View style={styles.debtStat}>
                            <Text style={[styles.debtStatLabel, { color: colors.contentSecondary }]}>APR</Text>
                            <Text style={[styles.debtStatValue, { color: colors.contentPrimary }]}>{debt.apr}%</Text>
                          </View>
                          <View style={[styles.debtStatDivider, { backgroundColor: colors.surfaceEdge }]} />
                          <View style={styles.debtStat}>
                            <Text style={[styles.debtStatLabel, { color: colors.contentSecondary }]}>Min payment</Text>
                            <Text style={[styles.debtStatValue, { color: colors.contentPrimary }]}>${debt.minPayment}/mo</Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>What are you saving for?</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                    Pick a category or choose "Other" to create your own.
                  </Text>
                  <View style={styles.vaultList}>
                    {SAVE_UP_ITEMS.map((item) => (
                      <Pressable
                        key={item.label}
                        style={[styles.vaultRow, { backgroundColor: colors.surfaceElevated }]}
                        onPress={() => selectSaveUpItem(item)}
                      >
                        <View style={styles.vaultIconWrap}>
                          <Feather name={item.icon} size={20} color={colors.contentPrimary} />
                        </View>
                        <Text style={[styles.vaultLabel, { color: colors.contentPrimary }]}>{item.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>

          {/* Page 2: Name & target */}
          <View style={[styles.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>
                {isPayDown ? 'Your payoff goal' : 'Customize your goal'}
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                {isPayDown
                  ? 'We pulled in your current balance. Adjust if needed.'
                  : 'Give it a name and set your target.'}
              </Text>

              {isPayDown && selectedDebt && (
                <View style={[styles.linkedBadge, { backgroundColor: colors.surfaceTint }]}>
                  <Feather name="link" size={14} color={colors.contentBrand} />
                  <Text style={[styles.linkedBadgeText, { color: colors.contentSecondary }]}>
                    Linked to <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>{selectedDebt.name}</Text> · {selectedDebt.apr}% APR
                  </Text>
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>Name</Text>
                <TextInput
                  style={[styles.fieldInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder={isPayDown ? 'e.g. Pay off Credit Card' : 'e.g. Emergency Fund'}
                  placeholderTextColor={colors.contentDimmed}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>
                  {isPayDown ? 'Balance to pay off' : 'Goal'}
                </Text>
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
          </View>

          {/* Page 3: Contribution, date, account */}
          <View style={[styles.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>
                {isPayDown ? 'Your payoff plan' : 'How do you want to save?'}
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                {isPayDown
                  ? 'See how paying more can save you money and time.'
                  : 'Set up your contribution and timeline.'}
              </Text>

              {/* Coach estimate — debt version */}
              {isPayDown && debtEstimate && selectedDebt && (
                <View style={[styles.estimateCard, { backgroundColor: colors.surfaceElevated }]}>
                  <View style={styles.estimateHeader}>
                    <View style={[styles.estimateIconWrap, { backgroundColor: colors.surfaceTint }]}>
                      <Feather name="zap" size={14} color={colors.contentBrand} />
                    </View>
                    <Text style={[styles.estimateTitle, { color: colors.contentPrimary }]}>Coach estimate</Text>
                  </View>

                  <View style={[styles.debtCompare, { borderColor: colors.surfaceEdge }]}>
                    <View style={styles.debtCompareRow}>
                      <Text style={[styles.debtCompareLabel, { color: colors.contentSecondary }]}>Minimum only</Text>
                      <View style={styles.debtCompareValues}>
                        <Text style={[styles.debtCompareTime, { color: colors.contentSecondary }]}>
                          {debtEstimate.minOnly.months >= 600 ? '50+ yrs' : debtEstimate.minOnly.months >= 24
                            ? `${Math.round(debtEstimate.minOnly.months / 12)} yrs`
                            : `${debtEstimate.minOnly.months} mo`}
                        </Text>
                        <Text style={[styles.debtCompareInterest, { color: '#c62828' }]}>
                          ${formatCurrency(debtEstimate.minOnly.totalInterest)} interest
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.debtCompareDivider, { backgroundColor: colors.surfaceEdge }]} />
                    <View style={styles.debtCompareRow}>
                      <Text style={[styles.debtCompareLabel, { color: colors.contentPrimary, fontFamily: Fonts.bold }]}>
                        Coach suggests
                      </Text>
                      <View style={styles.debtCompareValues}>
                        <Text style={[styles.debtCompareTime, { color: colors.contentPrimary, fontFamily: Fonts.bold }]}>
                          {debtEstimate.withSuggested.months >= 24
                            ? `${Math.round(debtEstimate.withSuggested.months / 12)} yrs`
                            : `${debtEstimate.withSuggested.months} mo`}
                        </Text>
                        <Text style={[styles.debtCompareInterest, { color: '#2e7d32' }]}>
                          ${formatCurrency(debtEstimate.withSuggested.totalInterest)} interest
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.estimateBody, { color: colors.contentSecondary }]}>
                    Pay <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>${formatCurrency(debtEstimate.suggestedPayment)}/mo</Text> to be debt-free by {formatMonthYear(targetDate)} and save{' '}
                    <Text style={{ fontFamily: Fonts.bold, color: '#2e7d32' }}>
                      ${formatCurrency(debtEstimate.minOnly.totalInterest - debtEstimate.withSuggested.totalInterest)}
                    </Text>{' '}
                    in interest.
                  </Text>

                  <Pressable
                    style={[styles.estimateApply, { borderColor: colors.contentBrand }]}
                    onPress={() => setMonthlyContribution(formatCurrency(debtEstimate.suggestedPayment))}
                  >
                    <Text style={[styles.estimateApplyText, { color: colors.contentBrand }]}>Use this amount</Text>
                  </Pressable>

                  {debtEstimate.withExtra && currentMonthly > selectedDebt.minPayment && (
                    <View style={[styles.estimateProjection, { backgroundColor: '#e8f5e9' }]}>
                      <Feather name="trending-down" size={14} color="#2e7d32" />
                      <Text style={[styles.estimateProjectionText, { color: '#2e7d32' }]}>
                        At ${formatCurrency(currentMonthly)}/mo you'd be debt-free in {debtEstimate.withExtra.months} months — saving ${formatCurrency(debtEstimate.minOnly.totalInterest - debtEstimate.withExtra.totalInterest)} in interest
                      </Text>
                    </View>
                  )}

                  {currentMonthly > 0 && currentMonthly <= selectedDebt.minPayment && (
                    <View style={[styles.estimateProjection, { backgroundColor: '#fff8e1' }]}>
                      <Feather name="alert-circle" size={14} color="#f9a825" />
                      <Text style={[styles.estimateProjectionText, { color: '#795600' }]}>
                        That's at or below your minimum payment (${selectedDebt.minPayment}/mo). Paying more will save you money.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Coach estimate — save-up version */}
              {!isPayDown && saveUpEstimate && (
                <View style={[styles.estimateCard, { backgroundColor: colors.surfaceElevated }]}>
                  <View style={styles.estimateHeader}>
                    <View style={[styles.estimateIconWrap, { backgroundColor: colors.surfaceTint }]}>
                      <Feather name="zap" size={14} color={colors.contentBrand} />
                    </View>
                    <Text style={[styles.estimateTitle, { color: colors.contentPrimary }]}>Coach estimate</Text>
                  </View>
                  <Text style={[styles.estimateBody, { color: colors.contentSecondary }]}>
                    To reach ${formatCurrency(target)} by {formatMonthYear(targetDate)}, you'd need about <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>${formatCurrency(saveUpEstimate.suggestedMonthly)}/mo</Text>.
                  </Text>
                  {saveUpEstimate.suggestedMonthly > 0 && (
                    <Pressable
                      style={[styles.estimateApply, { borderColor: colors.contentBrand }]}
                      onPress={() => setMonthlyContribution(formatCurrency(saveUpEstimate.suggestedMonthly))}
                    >
                      <Text style={[styles.estimateApplyText, { color: colors.contentBrand }]}>Use this amount</Text>
                    </Pressable>
                  )}
                  {currentMonthly > 0 && (
                    <View style={[styles.estimateProjection, { backgroundColor: saveUpEstimate.onTrack ? '#e8f5e9' : '#fff8e1' }]}>
                      <Feather name={saveUpEstimate.onTrack ? 'check-circle' : 'alert-circle'} size={14} color={saveUpEstimate.onTrack ? '#2e7d32' : '#f9a825'} />
                      <Text style={[styles.estimateProjectionText, { color: saveUpEstimate.onTrack ? '#2e7d32' : '#795600' }]}>
                        {saveUpEstimate.onTrack
                          ? `On track — you'll reach your goal${saveUpEstimate.projectedTotal > target ? ` with ~$${formatCurrency(saveUpEstimate.projectedTotal - target)} extra` : ''}`
                          : `At $${formatCurrency(currentMonthly)}/mo you'd be ~$${formatCurrency(saveUpEstimate.shortfall)} short`
                        }
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>
                  {isPayDown ? 'Monthly payment' : 'Monthly contribution'}
                </Text>
                <View style={[styles.currencyInput, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.currencySign, { color: colors.contentSecondary }]}>$</Text>
                  <TextInput
                    style={[styles.currencyField, { color: colors.contentPrimary }]}
                    value={monthlyContribution}
                    onChangeText={setMonthlyContribution}
                    keyboardType="numeric"
                    placeholder={isPayDown && selectedDebt ? String(selectedDebt.minPayment) : '500'}
                    placeholderTextColor={colors.contentDimmed}
                  />
                  <Text style={[styles.perMonthLabel, { color: colors.contentSecondary }]}>/mo</Text>
                </View>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.contentSecondary }]}>
                  {isPayDown ? 'Target payoff date' : 'Target date'}
                </Text>
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

              {!isPayDown && (
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
              )}
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
          </View>

          {/* Page 4: Review */}
          <View style={[styles.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.stepTitle, { color: colors.contentPrimary }]}>Review your goal</Text>
              <Text style={[styles.stepSubtitle, { color: colors.contentSecondary }]}>
                Everything look right? You can edit anytime.
              </Text>
              <View style={[styles.reviewCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.reviewIconWrap, { backgroundColor: colors.surfaceTint }]}>
                    <Feather name={isPayDown ? 'trending-down' : 'target'} size={20} color={colors.contentPrimary} />
                  </View>
                  <View style={styles.reviewHeaderText}>
                    <Text style={[styles.reviewName, { color: colors.contentPrimary }]}>{title || 'Untitled Goal'}</Text>
                    <Text style={[styles.reviewType, { color: colors.contentSecondary }]}>
                      {GOAL_TYPE_DISPLAY[goalType] || 'Save up'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.reviewDivider, { backgroundColor: colors.surfaceEdge }]} />
                <View style={styles.reviewRows}>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>
                      {isPayDown ? 'Balance' : 'Target'}
                    </Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>
                      ${formatCurrency(parseCurrency(targetAmount))}
                    </Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>
                      {isPayDown ? 'Payment' : 'Monthly'}
                    </Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>
                      ${formatCurrency(parseCurrency(monthlyContribution))}/mo
                    </Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>
                      {isPayDown ? 'Debt-free by' : 'Timeline'}
                    </Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>{formatMonthYear(targetDate)}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: colors.contentSecondary }]}>Account</Text>
                    <Text style={[styles.reviewValue, { color: colors.contentPrimary }]}>{linkedAccount || '—'}</Text>
                  </View>
                  {isPayDown && selectedDebt && debtEstimate?.withExtra && currentMonthly > selectedDebt.minPayment && (
                    <View style={[styles.reviewSavings, { backgroundColor: '#e8f5e9' }]}>
                      <Feather name="award" size={14} color="#2e7d32" />
                      <Text style={[styles.reviewSavingsText, { color: '#2e7d32' }]}>
                        Saving ${formatCurrency(debtEstimate.minOnly.totalInterest - debtEstimate.withExtra.totalInterest)} in interest vs. minimum payments
                      </Text>
                    </View>
                  )}
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
          </View>

        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  strip: {
    flexDirection: 'row',
    flex: 1,
  },
  stepPage: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: Fonts.medium,
    lineHeight: 28,
    marginBottom: 8,
    letterSpacing: -0.48,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    marginBottom: 24,
    letterSpacing: -0.16,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 14,
    shadowColor: '#121211',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  categoryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    flex: 1,
    gap: 2,
  },
  categoryLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  categorySubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  vaultList: {
    gap: 16,
  },
  vaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#121211',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  vaultIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 24,
    letterSpacing: -0.16,
    flex: 1,
  },
  debtList: {
    gap: 12,
  },
  debtCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#121211',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  debtCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  debtIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtCardInfo: {
    flex: 1,
    gap: 2,
  },
  debtName: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    letterSpacing: -0.16,
  },
  debtBalance: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  debtCardDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  debtCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  debtStat: {
    flex: 1,
    gap: 2,
  },
  debtStatLabel: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  debtStatValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  debtStatDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 12,
  },
  linkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  linkedBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  estimateCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#121211',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  estimateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  estimateIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: -0.1,
  },
  estimateBody: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    marginBottom: 12,
  },
  estimateApply: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  estimateApplyText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  estimateProjection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  estimateProjectionText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
    flex: 1,
  },
  debtCompare: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },
  debtCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  debtCompareLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  debtCompareValues: {
    alignItems: 'flex-end',
    gap: 2,
  },
  debtCompareTime: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  debtCompareInterest: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  debtCompareDivider: {
    height: 1,
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
  reviewSavings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reviewSavingsText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
    flex: 1,
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
