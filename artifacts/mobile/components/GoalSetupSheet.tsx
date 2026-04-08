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

function fmt(val: number): string {
  return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function parse(str: string): number {
  return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
}

function fmtDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function monthsBetween(from: Date, to: Date): number {
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
}

function pageToStep(page: number, isPayDown: boolean): number {
  if (page <= 1) return 1;
  if (page === 2) return 2;
  if (page === 3) return isPayDown ? 3 : 3;
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
    <View style={siStyles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            siStyles.dot,
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
const siStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 12 },
  dot: { height: 6, borderRadius: 3 },
});

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
        setTargetAmount(fmt(p.targetAmount));
        setMonthlyContribution(fmt(p.monthlyContribution));
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
    goToPage(Math.min(page + 1, TOTAL_PAGES - 1));
  }, [page, screenWidth]);

  const goBack = useCallback(() => {
    if (page === 0) { dismiss(); return; }
    if (page === 2 && category === 'investment') { goToPage(0); return; }
    goToPage(page - 1);
  }, [page, category, screenWidth]);

  const handleCreate = () => {
    if (!setup) return;
    if (parse(monthlyContribution) <= 0) return;
    createGoalFromSetup({
      type: goalType,
      title: title.trim(),
      targetAmount: parse(targetAmount),
      targetDate,
      monthlyContribution: parse(monthlyContribution),
      linkedAccount,
    }, setup.messageId ?? undefined);
  };

  const selectCategory = (cat: GoalCategory) => {
    setCategory(cat);
    if (cat === 'save-up' || cat === 'pay-down') {
      goToPage(1);
    } else {
      setGoalType('INVESTMENT');
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
    setTargetAmount(fmt(debt.balance));
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
  const target = parse(targetAmount);
  const monthly = parse(monthlyContribution);
  const months = monthsBetween(new Date(), targetDate);

  const planPageValid = isPayDown
    ? target > 0 && title.trim().length > 0
    : target > 0 && title.trim().length > 0 && monthly > 0;

  const payDownPlanValid = isPayDown && monthly > 0;
  const accountPageValid = linkedAccount.length > 0;
  const reviewValid = isPayDown
    ? planPageValid && payDownPlanValid
    : planPageValid && accountPageValid;

  const displayStep = pageToStep(page, isPayDown);

  const suggested = target > 0 ? Math.ceil(target / months) : 0;
  const projected = monthly * months;
  const onTrack = monthly > 0 && projected >= target;
  const shortfall = target - projected;

  const debtEstimate = useMemo(() => {
    if (!isPayDown || !selectedDebt || target <= 0) return null;
    const minOnly = calcDebtPayoff(target, selectedDebt.apr, selectedDebt.minPayment);
    const withExtra = monthly > selectedDebt.minPayment
      ? calcDebtPayoff(target, selectedDebt.apr, monthly)
      : null;
    const sugPay = Math.ceil(target / months + (target * selectedDebt.apr / 100 / 12));
    const withSuggested = calcDebtPayoff(target, selectedDebt.apr, sugPay);
    return { minOnly, withExtra, suggestedPayment: sugPay, withSuggested };
  }, [isPayDown, selectedDebt, target, monthly, months]);

  return (
    <Animated.View style={[s.fullScreen, panelStyle, { backgroundColor: colors.surfaceBase }]}>
      <View style={[s.header, { paddingTop: insets.top }]}>
        <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
          <Feather name="chevron-left" size={24} color={colors.contentPrimary} />
        </Pressable>
        <View style={s.headerCenter}>
          <StepIndicator current={displayStep} total={4} />
        </View>
        <Pressable style={s.closeBtn} onPress={dismiss} hitSlop={12}>
          <Feather name="x" size={22} color={colors.contentPrimary} />
        </Pressable>
      </View>

      <View style={s.body}>
        <Animated.View style={[s.strip, { width: screenWidth * TOTAL_PAGES }, stripStyle]}>

          {/* ─── Page 0: Category ─── */}
          <View style={[s.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
              <Text style={[s.title, { color: colors.contentPrimary }]}>Create a goal</Text>
              <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                What type of goal do you want to set up?
              </Text>
              <View style={s.categoryList}>
                {CATEGORIES.map(({ key, label, subtitle, icon }) => (
                  <Pressable key={key} style={[s.categoryCard, { backgroundColor: colors.surfaceElevated }]} onPress={() => selectCategory(key)}>
                    <View style={[s.categoryIconWrap, { backgroundColor: colors.surfaceTint }]}>
                      <Feather name={icon} size={22} color={colors.contentPrimary} />
                    </View>
                    <View style={s.categoryText}>
                      <Text style={[s.categoryLabel, { color: colors.contentPrimary }]}>{label}</Text>
                      <Text style={[s.categorySub, { color: colors.contentSecondary }]}>{subtitle}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.contentMuted} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* ─── Page 1: Sub-selection ─── */}
          <View style={[s.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
              {category === 'pay-down' ? (
                <>
                  <Text style={[s.title, { color: colors.contentPrimary }]}>Which account?</Text>
                  <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                    Select the debt you want to pay down. We'll pull in your current balance.
                  </Text>
                  <View style={s.debtList}>
                    {DEBT_ACCOUNTS.map((debt) => (
                      <Pressable key={debt.id} style={[s.debtCard, { backgroundColor: colors.surfaceElevated }]} onPress={() => selectDebtAccount(debt)}>
                        <View style={s.debtCardTop}>
                          <View style={[s.debtIconWrap, { backgroundColor: colors.surfaceTint }]}>
                            <Feather name={debt.icon} size={18} color={colors.contentPrimary} />
                          </View>
                          <View style={s.debtCardInfo}>
                            <Text style={[s.debtName, { color: colors.contentPrimary }]}>{debt.name}</Text>
                            <Text style={[s.debtBalance, { color: colors.contentPrimary }]}>${fmt(debt.balance)}</Text>
                          </View>
                        </View>
                        <View style={[s.debtCardDivider, { backgroundColor: colors.surfaceEdge }]} />
                        <View style={s.debtCardBottom}>
                          <View style={s.debtStat}>
                            <Text style={[s.debtStatLabel, { color: colors.contentSecondary }]}>APR</Text>
                            <Text style={[s.debtStatValue, { color: colors.contentPrimary }]}>{debt.apr}%</Text>
                          </View>
                          <View style={[s.debtStatDivider, { backgroundColor: colors.surfaceEdge }]} />
                          <View style={s.debtStat}>
                            <Text style={[s.debtStatLabel, { color: colors.contentSecondary }]}>Min payment</Text>
                            <Text style={[s.debtStatValue, { color: colors.contentPrimary }]}>${debt.minPayment}/mo</Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <Text style={[s.title, { color: colors.contentPrimary }]}>What are you saving for?</Text>
                  <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                    Pick a category or choose "Other" to create your own.
                  </Text>
                  <View style={s.vaultList}>
                    {SAVE_UP_ITEMS.map((item) => (
                      <Pressable key={item.label} style={[s.vaultRow, { backgroundColor: colors.surfaceElevated }]} onPress={() => selectSaveUpItem(item)}>
                        <View style={s.vaultIconWrap}>
                          <Feather name={item.icon} size={20} color={colors.contentPrimary} />
                        </View>
                        <Text style={[s.vaultLabel, { color: colors.contentPrimary }]}>{item.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>

          {/* ─── Page 2: Plan your goal (save-up) / Payoff goal (pay-down) ─── */}
          <View style={[s.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {isPayDown ? (
                <>
                  <Text style={[s.title, { color: colors.contentPrimary }]}>Your payoff goal</Text>
                  <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                    We pulled in your current balance. Adjust if needed.
                  </Text>
                  {selectedDebt && (
                    <View style={[s.linkedBadge, { backgroundColor: colors.surfaceTint }]}>
                      <Feather name="link" size={14} color={colors.contentBrand} />
                      <Text style={[s.linkedBadgeText, { color: colors.contentSecondary }]}>
                        Linked to <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>{selectedDebt.name}</Text> · {selectedDebt.apr}% APR
                      </Text>
                    </View>
                  )}
                  <View style={s.fieldGroup}>
                    <Text style={[s.fieldLabel, { color: colors.contentSecondary }]}>Name</Text>
                    <TextInput
                      style={[s.fieldInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
                      value={title} onChangeText={setTitle}
                      placeholder="e.g. Pay off Credit Card"
                      placeholderTextColor={colors.contentDimmed}
                    />
                  </View>
                  <View style={s.fieldGroup}>
                    <Text style={[s.fieldLabel, { color: colors.contentSecondary }]}>Balance to pay off</Text>
                    <View style={[s.currencyRow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                      <Text style={[s.currencySign, { color: colors.contentSecondary }]}>$</Text>
                      <TextInput
                        style={[s.currencyField, { color: colors.contentPrimary }]}
                        value={targetAmount} onChangeText={setTargetAmount}
                        keyboardType="numeric" placeholder="10,000"
                        placeholderTextColor={colors.contentDimmed}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[s.title, { color: colors.contentPrimary }]}>Plan your goal</Text>
                  <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                    Set your target, timeline, and contribution — they work together.
                  </Text>

                  <View style={s.fieldGroup}>
                    <Text style={[s.fieldLabel, { color: colors.contentSecondary }]}>Name</Text>
                    <TextInput
                      style={[s.fieldInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
                      value={title} onChangeText={setTitle}
                      placeholder="e.g. Emergency Fund"
                      placeholderTextColor={colors.contentDimmed}
                    />
                  </View>

                  <View style={[s.plannerCard, { backgroundColor: colors.surfaceElevated }]}>
                    <View style={s.plannerRow}>
                      <Text style={[s.plannerLabel, { color: colors.contentSecondary }]}>I want to save</Text>
                      <View style={[s.plannerInput, { borderColor: colors.surfaceEdge }]}>
                        <Text style={[s.currencySign, { color: colors.contentSecondary }]}>$</Text>
                        <TextInput
                          style={[s.plannerField, { color: colors.contentPrimary }]}
                          value={targetAmount} onChangeText={setTargetAmount}
                          keyboardType="numeric" placeholder="10,000"
                          placeholderTextColor={colors.contentDimmed}
                        />
                      </View>
                    </View>

                    <View style={[s.plannerDivider, { backgroundColor: colors.surfaceEdge }]} />

                    <View style={s.plannerRow}>
                      <Text style={[s.plannerLabel, { color: colors.contentSecondary }]}>By</Text>
                      <View style={s.plannerDateRow}>
                        <Pressable onPress={() => adjustMonth(-1)} style={[s.plannerDateArrow, { borderColor: colors.surfaceEdge }]} hitSlop={8}>
                          <Feather name="chevron-left" size={16} color={colors.contentPrimary} />
                        </Pressable>
                        <Text style={[s.plannerDateText, { color: colors.contentPrimary }]}>{fmtDate(targetDate)}</Text>
                        <Pressable onPress={() => adjustMonth(1)} style={[s.plannerDateArrow, { borderColor: colors.surfaceEdge }]} hitSlop={8}>
                          <Feather name="chevron-right" size={16} color={colors.contentPrimary} />
                        </Pressable>
                      </View>
                    </View>

                    <View style={[s.plannerDivider, { backgroundColor: colors.surfaceEdge }]} />

                    <View style={s.plannerRow}>
                      <Text style={[s.plannerLabel, { color: colors.contentSecondary }]}>Saving</Text>
                      <View style={[s.plannerInput, { borderColor: colors.surfaceEdge }]}>
                        <Text style={[s.currencySign, { color: colors.contentSecondary }]}>$</Text>
                        <TextInput
                          style={[s.plannerField, { color: colors.contentPrimary }]}
                          value={monthlyContribution} onChangeText={setMonthlyContribution}
                          keyboardType="numeric" placeholder={suggested > 0 ? fmt(suggested) : '500'}
                          placeholderTextColor={colors.contentDimmed}
                        />
                        <Text style={[s.plannerUnit, { color: colors.contentSecondary }]}>/mo</Text>
                      </View>
                    </View>
                  </View>

                  {target > 0 && (
                    <View style={[s.coachTip, { backgroundColor: colors.surfaceTint }]}>
                      <View style={s.coachTipHeader}>
                        <Feather name="zap" size={14} color={colors.contentBrand} />
                        <Text style={[s.coachTipTitle, { color: colors.contentPrimary }]}>Coach suggests</Text>
                      </View>

                      {monthly === 0 ? (
                        <Text style={[s.coachTipBody, { color: colors.contentSecondary }]}>
                          To reach <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>${fmt(target)}</Text> by {fmtDate(targetDate)}, save about{' '}
                          <Text style={{ fontFamily: Fonts.bold, color: colors.contentBrand }}>${fmt(suggested)}/mo</Text>.
                        </Text>
                      ) : onTrack ? (
                        <Text style={[s.coachTipBody, { color: colors.contentSecondary }]}>
                          At <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>${fmt(monthly)}/mo</Text>, you'll hit your goal
                          {projected > target
                            ? <> with <Text style={{ fontFamily: Fonts.bold, color: '#2e7d32' }}>~${fmt(projected - target)} extra</Text></>
                            : <> right on time</>
                          }. Nice.
                        </Text>
                      ) : (
                        <Text style={[s.coachTipBody, { color: colors.contentSecondary }]}>
                          At <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>${fmt(monthly)}/mo</Text>, you'd be about{' '}
                          <Text style={{ fontFamily: Fonts.bold, color: '#c62828' }}>${fmt(shortfall)} short</Text>.{' '}
                          Try <Text style={{ fontFamily: Fonts.bold, color: colors.contentBrand }}>${fmt(suggested)}/mo</Text> or push the date out.
                        </Text>
                      )}

                      {monthly === 0 && suggested > 0 && (
                        <Pressable
                          style={[s.coachTipBtn, { borderColor: colors.contentBrand }]}
                          onPress={() => setMonthlyContribution(fmt(suggested))}
                        >
                          <Text style={[s.coachTipBtnText, { color: colors.contentBrand }]}>Use ${fmt(suggested)}/mo</Text>
                        </Pressable>
                      )}

                      {!onTrack && monthly > 0 && suggested > 0 && (
                        <Pressable
                          style={[s.coachTipBtn, { borderColor: colors.contentBrand }]}
                          onPress={() => setMonthlyContribution(fmt(suggested))}
                        >
                          <Text style={[s.coachTipBtnText, { color: colors.contentBrand }]}>Adjust to ${fmt(suggested)}/mo</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
            <View style={[s.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[s.nextBtn, { backgroundColor: planPageValid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={goNext} disabled={!planPageValid}
              >
                <Text style={[s.nextBtnText, { color: '#fff' }]}>Next</Text>
              </Pressable>
            </View>
          </View>

          {/* ─── Page 3: Account (save-up) / Payoff plan (pay-down) ─── */}
          <View style={[s.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {isPayDown ? (
                <>
                  <Text style={[s.title, { color: colors.contentPrimary }]}>Your payoff plan</Text>
                  <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                    See how paying more can save you money and time.
                  </Text>

                  {debtEstimate && selectedDebt && (
                    <View style={[s.estimateCard, { backgroundColor: colors.surfaceElevated }]}>
                      <View style={s.estimateHeader}>
                        <View style={[s.estimateIconWrap, { backgroundColor: colors.surfaceTint }]}>
                          <Feather name="zap" size={14} color={colors.contentBrand} />
                        </View>
                        <Text style={[s.estimateTitle, { color: colors.contentPrimary }]}>Coach estimate</Text>
                      </View>

                      <View style={[s.debtCompare, { borderColor: colors.surfaceEdge }]}>
                        <View style={s.debtCompareRow}>
                          <Text style={[s.dcLabel, { color: colors.contentSecondary }]}>Minimum only</Text>
                          <View style={s.dcValues}>
                            <Text style={[s.dcTime, { color: colors.contentSecondary }]}>
                              {debtEstimate.minOnly.months >= 600 ? '50+ yrs' : debtEstimate.minOnly.months >= 24 ? `${Math.round(debtEstimate.minOnly.months / 12)} yrs` : `${debtEstimate.minOnly.months} mo`}
                            </Text>
                            <Text style={[s.dcInterest, { color: '#c62828' }]}>${fmt(debtEstimate.minOnly.totalInterest)} interest</Text>
                          </View>
                        </View>
                        <View style={[s.dcDivider, { backgroundColor: colors.surfaceEdge }]} />
                        <View style={s.debtCompareRow}>
                          <Text style={[s.dcLabel, { color: colors.contentPrimary, fontFamily: Fonts.bold }]}>Coach suggests</Text>
                          <View style={s.dcValues}>
                            <Text style={[s.dcTime, { color: colors.contentPrimary, fontFamily: Fonts.bold }]}>
                              {debtEstimate.withSuggested.months >= 24 ? `${Math.round(debtEstimate.withSuggested.months / 12)} yrs` : `${debtEstimate.withSuggested.months} mo`}
                            </Text>
                            <Text style={[s.dcInterest, { color: '#2e7d32' }]}>${fmt(debtEstimate.withSuggested.totalInterest)} interest</Text>
                          </View>
                        </View>
                      </View>

                      <Text style={[s.estimateBody, { color: colors.contentSecondary }]}>
                        Pay <Text style={{ fontFamily: Fonts.bold, color: colors.contentPrimary }}>${fmt(debtEstimate.suggestedPayment)}/mo</Text> to be debt-free by {fmtDate(targetDate)} and save{' '}
                        <Text style={{ fontFamily: Fonts.bold, color: '#2e7d32' }}>${fmt(debtEstimate.minOnly.totalInterest - debtEstimate.withSuggested.totalInterest)}</Text> in interest.
                      </Text>

                      <Pressable style={[s.estimateApply, { borderColor: colors.contentBrand }]} onPress={() => setMonthlyContribution(fmt(debtEstimate.suggestedPayment))}>
                        <Text style={[s.estimateApplyText, { color: colors.contentBrand }]}>Use this amount</Text>
                      </Pressable>

                      {debtEstimate.withExtra && monthly > selectedDebt.minPayment && (
                        <View style={[s.projection, { backgroundColor: '#e8f5e9' }]}>
                          <Feather name="trending-down" size={14} color="#2e7d32" />
                          <Text style={[s.projectionText, { color: '#2e7d32' }]}>
                            At ${fmt(monthly)}/mo you'd be debt-free in {debtEstimate.withExtra.months} months — saving ${fmt(debtEstimate.minOnly.totalInterest - debtEstimate.withExtra.totalInterest)} in interest
                          </Text>
                        </View>
                      )}
                      {monthly > 0 && monthly <= selectedDebt.minPayment && (
                        <View style={[s.projection, { backgroundColor: '#fff8e1' }]}>
                          <Feather name="alert-circle" size={14} color="#f9a825" />
                          <Text style={[s.projectionText, { color: '#795600' }]}>
                            That's at or below your minimum (${selectedDebt.minPayment}/mo). Paying more saves you money.
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={s.fieldGroup}>
                    <Text style={[s.fieldLabel, { color: colors.contentSecondary }]}>Monthly payment</Text>
                    <View style={[s.currencyRow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                      <Text style={[s.currencySign, { color: colors.contentSecondary }]}>$</Text>
                      <TextInput
                        style={[s.currencyField, { color: colors.contentPrimary }]}
                        value={monthlyContribution} onChangeText={setMonthlyContribution}
                        keyboardType="numeric" placeholder={selectedDebt ? String(selectedDebt.minPayment) : '500'}
                        placeholderTextColor={colors.contentDimmed}
                      />
                      <Text style={[s.perMo, { color: colors.contentSecondary }]}>/mo</Text>
                    </View>
                  </View>
                  <View style={s.fieldGroup}>
                    <Text style={[s.fieldLabel, { color: colors.contentSecondary }]}>Target payoff date</Text>
                    <View style={s.dateSelector}>
                      <Pressable onPress={() => adjustMonth(-1)} style={[s.dateArrow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]} hitSlop={8}>
                        <Feather name="chevron-left" size={18} color={colors.contentPrimary} />
                      </Pressable>
                      <View style={[s.dateDisplay, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                        <Text style={[s.dateText, { color: colors.contentPrimary }]}>{fmtDate(targetDate)}</Text>
                      </View>
                      <Pressable onPress={() => adjustMonth(1)} style={[s.dateArrow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]} hitSlop={8}>
                        <Feather name="chevron-right" size={18} color={colors.contentPrimary} />
                      </Pressable>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[s.title, { color: colors.contentPrimary }]}>Where should we save?</Text>
                  <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                    Pick the account to pull your monthly contribution from.
                  </Text>
                  <View style={s.accountOptions}>
                    {LINKED_ACCOUNTS.map(acct => {
                      const sel = acct === linkedAccount;
                      return (
                        <Pressable key={acct} style={[s.accountRow, { backgroundColor: colors.surfaceElevated, borderColor: sel ? colors.contentPrimary : colors.surfaceEdge }, sel && { borderWidth: 2 }]} onPress={() => setLinkedAccount(acct)}>
                          <View style={[s.radio, { borderColor: sel ? colors.contentPrimary : colors.contentMuted }]}>
                            {sel && <View style={[s.radioFill, { backgroundColor: colors.contentPrimary }]} />}
                          </View>
                          <Text style={[s.accountLabel, { color: colors.contentPrimary }]}>{acct}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}
            </ScrollView>
            <View style={[s.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[s.nextBtn, { backgroundColor: (isPayDown ? monthly > 0 : accountPageValid) ? colors.contentBrand : colors.contentDisabled }]}
                onPress={goNext}
                disabled={isPayDown ? monthly <= 0 : !accountPageValid}
              >
                <Text style={[s.nextBtnText, { color: '#fff' }]}>Next</Text>
              </Pressable>
            </View>
          </View>

          {/* ─── Page 4: Review ─── */}
          <View style={[s.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
              <Text style={[s.title, { color: colors.contentPrimary }]}>Review your goal</Text>
              <Text style={[s.subtitle, { color: colors.contentSecondary }]}>
                Everything look right? You can edit anytime.
              </Text>
              <View style={[s.reviewCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                <View style={s.reviewHeader}>
                  <View style={[s.reviewIconWrap, { backgroundColor: colors.surfaceTint }]}>
                    <Feather name={isPayDown ? 'trending-down' : 'target'} size={20} color={colors.contentPrimary} />
                  </View>
                  <View style={s.reviewHeaderText}>
                    <Text style={[s.reviewName, { color: colors.contentPrimary }]}>{title || 'Untitled Goal'}</Text>
                    <Text style={[s.reviewType, { color: colors.contentSecondary }]}>{GOAL_TYPE_DISPLAY[goalType]}</Text>
                  </View>
                </View>
                <View style={[s.reviewDivider, { backgroundColor: colors.surfaceEdge }]} />
                <View style={s.reviewRows}>
                  <View style={s.reviewRow}>
                    <Text style={[s.reviewLabel, { color: colors.contentSecondary }]}>{isPayDown ? 'Balance' : 'Target'}</Text>
                    <Text style={[s.reviewValue, { color: colors.contentPrimary }]}>${fmt(target)}</Text>
                  </View>
                  <View style={s.reviewRow}>
                    <Text style={[s.reviewLabel, { color: colors.contentSecondary }]}>{isPayDown ? 'Payment' : 'Monthly'}</Text>
                    <Text style={[s.reviewValue, { color: colors.contentPrimary }]}>${fmt(monthly)}/mo</Text>
                  </View>
                  <View style={s.reviewRow}>
                    <Text style={[s.reviewLabel, { color: colors.contentSecondary }]}>{isPayDown ? 'Debt-free by' : 'Timeline'}</Text>
                    <Text style={[s.reviewValue, { color: colors.contentPrimary }]}>{fmtDate(targetDate)}</Text>
                  </View>
                  <View style={s.reviewRow}>
                    <Text style={[s.reviewLabel, { color: colors.contentSecondary }]}>Account</Text>
                    <Text style={[s.reviewValue, { color: colors.contentPrimary }]}>{linkedAccount || '—'}</Text>
                  </View>
                  {isPayDown && selectedDebt && debtEstimate?.withExtra && monthly > selectedDebt.minPayment && (
                    <View style={[s.reviewSavings, { backgroundColor: '#e8f5e9' }]}>
                      <Feather name="award" size={14} color="#2e7d32" />
                      <Text style={[s.reviewSavingsText, { color: '#2e7d32' }]}>
                        Saving ${fmt(debtEstimate.minOnly.totalInterest - debtEstimate.withExtra.totalInterest)} in interest vs. minimum payments
                      </Text>
                    </View>
                  )}
                  {!isPayDown && onTrack && projected > target && (
                    <View style={[s.reviewSavings, { backgroundColor: '#e8f5e9' }]}>
                      <Feather name="check-circle" size={14} color="#2e7d32" />
                      <Text style={[s.reviewSavingsText, { color: '#2e7d32' }]}>
                        On track with ~${fmt(projected - target)} extra by {fmtDate(targetDate)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
            <View style={[s.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[s.nextBtn, { backgroundColor: reviewValid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={handleCreate} disabled={!reviewValid}
              >
                <Text style={[s.nextBtnText, { color: '#fff' }]}>Create goal</Text>
              </Pressable>
            </View>
          </View>

        </Animated.View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  fullScreen: { ...StyleSheet.absoluteFillObject, zIndex: 200, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 4 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, overflow: 'hidden' },
  strip: { flexDirection: 'row', flex: 1 },
  stepPage: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  title: { fontSize: 20, fontFamily: Fonts.medium, lineHeight: 28, marginBottom: 8, letterSpacing: -0.48 },
  subtitle: { fontSize: 14, fontFamily: Fonts.regular, lineHeight: 20, marginBottom: 24, letterSpacing: -0.16 },

  categoryList: { gap: 12 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, gap: 14, shadowColor: '#121211', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  categoryIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryText: { flex: 1, gap: 2 },
  categoryLabel: { fontSize: 16, fontFamily: Fonts.medium, lineHeight: 24, letterSpacing: -0.16 },
  categorySub: { fontSize: 13, fontFamily: Fonts.regular, lineHeight: 18 },

  vaultList: { gap: 16 },
  vaultRow: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 16, borderRadius: 16, gap: 8, shadowColor: '#121211', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  vaultIconWrap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  vaultLabel: { fontSize: 16, fontFamily: Fonts.medium, lineHeight: 24, letterSpacing: -0.16, flex: 1 },

  debtList: { gap: 12 },
  debtCard: { borderRadius: 16, overflow: 'hidden', shadowColor: '#121211', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  debtCardTop: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  debtIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  debtCardInfo: { flex: 1, gap: 2 },
  debtName: { fontSize: 16, fontFamily: Fonts.medium, lineHeight: 22, letterSpacing: -0.16 },
  debtBalance: { fontSize: 20, fontFamily: Fonts.bold, lineHeight: 26, letterSpacing: -0.3 },
  debtCardDivider: { height: 1, marginHorizontal: 16 },
  debtCardBottom: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  debtStat: { flex: 1, gap: 2 },
  debtStatLabel: { fontSize: 11, fontFamily: Fonts.regular, textTransform: 'uppercase', letterSpacing: 0.5 },
  debtStatValue: { fontSize: 14, fontFamily: Fonts.medium },
  debtStatDivider: { width: 1, height: 28, marginHorizontal: 12 },

  linkedBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 20 },
  linkedBadgeText: { fontSize: 13, fontFamily: Fonts.regular, flex: 1 },

  plannerCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: '#121211', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  plannerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  plannerLabel: { fontSize: 15, fontFamily: Fonts.regular },
  plannerInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, minWidth: 140 },
  plannerField: { flex: 1, fontSize: 17, fontFamily: Fonts.medium, padding: 0, textAlign: 'right' },
  plannerUnit: { fontSize: 14, fontFamily: Fonts.regular, marginLeft: 2 },
  plannerDivider: { height: 1, marginHorizontal: 16 },
  plannerDateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plannerDateArrow: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  plannerDateText: { fontSize: 15, fontFamily: Fonts.medium, minWidth: 120, textAlign: 'center' },

  coachTip: { borderRadius: 14, padding: 14, marginBottom: 20 },
  coachTipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  coachTipTitle: { fontSize: 13, fontFamily: Fonts.bold, letterSpacing: -0.1 },
  coachTipBody: { fontSize: 14, fontFamily: Fonts.regular, lineHeight: 20 },
  coachTipBtn: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7, marginTop: 10 },
  coachTipBtnText: { fontSize: 13, fontFamily: Fonts.bold },

  estimateCard: { borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: '#121211', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  estimateHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  estimateIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  estimateTitle: { fontSize: 14, fontFamily: Fonts.bold, letterSpacing: -0.1 },
  estimateBody: { fontSize: 14, fontFamily: Fonts.regular, lineHeight: 20, marginBottom: 12 },
  estimateApply: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 4 },
  estimateApplyText: { fontSize: 13, fontFamily: Fonts.bold },
  projection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  projectionText: { fontSize: 13, fontFamily: Fonts.medium, lineHeight: 18, flex: 1 },

  debtCompare: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 14 },
  debtCompareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  dcLabel: { fontSize: 13, fontFamily: Fonts.medium, flex: 1 },
  dcValues: { alignItems: 'flex-end', gap: 2 },
  dcTime: { fontSize: 13, fontFamily: Fonts.medium },
  dcInterest: { fontSize: 12, fontFamily: Fonts.medium },
  dcDivider: { height: 1 },

  fieldGroup: { marginBottom: 24 },
  fieldLabel: { fontSize: 12, fontFamily: Fonts.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  fieldInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17, fontFamily: Fonts.regular },
  currencyRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  currencySign: { fontSize: 17, fontFamily: Fonts.regular, marginRight: 4 },
  currencyField: { flex: 1, fontSize: 17, fontFamily: Fonts.regular, padding: 0 },
  perMo: { fontSize: 14, fontFamily: Fonts.regular, marginLeft: 4 },

  dateSelector: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateArrow: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dateDisplay: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontSize: 16, fontFamily: Fonts.medium },

  accountOptions: { gap: 8 },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 10, height: 10, borderRadius: 5 },
  accountLabel: { fontSize: 15, fontFamily: Fonts.medium },

  reviewCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14 },
  reviewIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reviewHeaderText: { flex: 1, gap: 2 },
  reviewName: { fontSize: 18, fontFamily: Fonts.bold, lineHeight: 22 },
  reviewType: { fontSize: 14, fontFamily: Fonts.regular },
  reviewDivider: { height: 1, marginHorizontal: 20 },
  reviewRows: { padding: 20, gap: 14 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewLabel: { fontSize: 14, fontFamily: Fonts.regular },
  reviewValue: { fontSize: 14, fontFamily: Fonts.medium },
  reviewSavings: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  reviewSavingsText: { fontSize: 13, fontFamily: Fonts.medium, lineHeight: 18, flex: 1 },

  footer: { paddingHorizontal: 24, paddingTop: 12 },
  nextBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { fontSize: 16, fontFamily: Fonts.bold },
});
