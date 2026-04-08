import React, { useState, useEffect, useMemo } from 'react';
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

function fmtPayoffTime(months: number): string {
  if (months >= 600) return '50+ yrs';
  if (months >= 24) return `${Math.round(months / 12)} yrs`;
  return `${months} mo`;
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
  'use no memo';
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

  useEffect(() => {
    if (page === 2 && monthlyContribution === '') {
      if (isPayDown && debtEstimate) {
        setMonthlyContribution(fmt(debtEstimate.suggestedPayment));
      } else if (!isPayDown && target > 0 && months > 0) {
        const sug = Math.ceil(target / months);
        if (sug > 0) setMonthlyContribution(fmt(sug));
      }
    }
  }, [page]);

  const goNext = () => {
    goToPage(Math.min(page + 1, TOTAL_PAGES - 1));
  };

  const goBack = () => {
    if (page === 0) { dismiss(); return; }
    if (page === 2 && (category === 'investment' || category === 'pay-down')) { goToPage(0); return; }
    if (page === 4 && category === 'pay-down') { goToPage(2); return; }
    goToPage(page - 1);
  };

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
    if (cat === 'save-up') {
      goToPage(1);
    } else if (cat === 'pay-down') {
      setGoalType('DEBT_PAYOFF');
      if (!selectedDebt) {
        const first = DEBT_ACCOUNTS[0];
        setSelectedDebt(first);
        setTitle(`Pay off ${first.name}`);
        setTargetAmount(fmt(first.balance));
        setLinkedAccount(first.name);
        setMonthlyContribution('');
      }
      goToPage(2);
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

  const pickDebt = (debt: DebtAccount) => {
    setSelectedDebt(debt);
    setTitle(`Pay off ${debt.name}`);
    setTargetAmount(fmt(debt.balance));
    setLinkedAccount(debt.name);
    setMonthlyContribution('');
  };

  const adjustMonth = (delta: number) => {
    setTargetDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      if (d <= new Date()) return prev;
      return d;
    });
  };

  const isPayDown = category === 'pay-down';
  const target = parse(targetAmount);
  const monthly = parse(monthlyContribution);
  const months = monthsBetween(new Date(), targetDate);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: panelX.value }],
  }));
  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: stripX.value }],
  }));

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

  if (!visible) return null;

  const planPageValid = isPayDown
    ? target > 0 && monthly > 0 && !!selectedDebt
    : target > 0 && title.trim().length > 0 && monthly > 0;

  const accountPageValid = linkedAccount.length > 0;
  const reviewValid = isPayDown
    ? planPageValid
    : planPageValid && accountPageValid;

  const stepCount = isPayDown ? 3 : 4;
  const displayStep = isPayDown
    ? (page <= 0 ? 1 : page === 2 ? 2 : page >= 4 ? 3 : 2)
    : (page <= 1 ? 1 : page === 2 ? 2 : page === 3 ? 3 : 4);

  const suggested = target > 0 ? Math.ceil(target / months) : 0;
  const projected = monthly * months;
  const onTrack = monthly > 0 && projected >= target;
  const shortfall = target - projected;

  return (
    <Animated.View style={[st.fullScreen, panelStyle, { backgroundColor: colors.surfaceBase }]}>
      <View style={[st.header, { paddingTop: insets.top }]}>
        <Pressable style={st.backBtn} onPress={goBack} hitSlop={12}>
          <Feather name="chevron-left" size={24} color={colors.contentPrimary} />
        </Pressable>
        <View style={st.headerCenter}>
          <StepIndicator current={displayStep} total={stepCount} />
        </View>
        <Pressable style={st.closeBtn} onPress={dismiss} hitSlop={12}>
          <Feather name="x" size={22} color={colors.contentPrimary} />
        </Pressable>
      </View>

      <View style={st.body}>
        <Animated.View style={[st.strip, { width: screenWidth * TOTAL_PAGES }, stripStyle]}>

          {/* ─── Page 0: Category ─── */}
          <View style={[st.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
              <Text style={[st.title, { color: colors.contentPrimary }]}>Create a goal</Text>
              <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                What type of goal do you want to set up?
              </Text>
              <View style={st.categoryList}>
                {CATEGORIES.map(({ key, label, subtitle, icon }) => (
                  <Pressable key={key} style={[st.categoryCard, { backgroundColor: colors.surfaceElevated }]} onPress={() => selectCategory(key)}>
                    <View style={[st.categoryIconWrap, { backgroundColor: colors.surfaceTint }]}>
                      <Feather name={icon} size={22} color={colors.contentPrimary} />
                    </View>
                    <View style={st.categoryText}>
                      <Text style={[st.categoryLabel, { color: colors.contentPrimary }]}>{label}</Text>
                      <Text style={[st.categorySub, { color: colors.contentSecondary }]}>{subtitle}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.contentMuted} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* ─── Page 1: Save-up vault list (pay-down skips this) ─── */}
          <View style={[st.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
              <Text style={[st.title, { color: colors.contentPrimary }]}>What are you saving for?</Text>
              <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                Pick a category or choose "Other" to create your own.
              </Text>
              <View style={st.vaultList}>
                {SAVE_UP_ITEMS.map((item) => (
                  <Pressable key={item.label} style={[st.vaultRow, { backgroundColor: colors.surfaceElevated }]} onPress={() => selectSaveUpItem(item)}>
                    <View style={st.vaultIconWrap}>
                      <Feather name={item.icon} size={20} color={colors.contentPrimary} />
                    </View>
                    <Text style={[st.vaultLabel, { color: colors.contentPrimary }]}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* ─── Page 2: Plan (save-up planner / pay-down unified / investment) ─── */}
          <View style={[st.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {isPayDown ? (
                <>
                  <Text style={[st.title, { color: colors.contentPrimary }]}>Pay down a debt</Text>
                  <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                    Pick the account, then set your plan.
                  </Text>

                  {/* ── Compact debt selector tabs ── */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled style={st.debtTabScroll} contentContainerStyle={st.debtTabRow}>
                    {DEBT_ACCOUNTS.map((debt) => {
                      const sel = selectedDebt?.id === debt.id;
                      return (
                        <Pressable
                          key={debt.id}
                          style={[
                            st.debtTab,
                            { backgroundColor: sel ? colors.contentPrimary : colors.surfaceElevated, borderColor: sel ? colors.contentPrimary : colors.surfaceEdge },
                          ]}
                          onPress={() => pickDebt(debt)}
                        >
                          <Feather name={debt.icon} size={14} color={sel ? '#fff' : colors.contentPrimary} />
                          <Text style={[st.debtTabLabel, { color: sel ? '#fff' : colors.contentPrimary }]}>{debt.name.replace('SoFi ', '')}</Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  {/* ── Selected debt detail strip ── */}
                  {selectedDebt && (
                    <View style={[st.debtDetail, { backgroundColor: colors.surfaceElevated }]}>
                      <View style={st.debtDetailItem}>
                        <Text style={[st.debtDetailLabel, { color: colors.contentSecondary }]}>Balance</Text>
                        <Text style={[st.debtDetailValue, { color: colors.contentPrimary }]}>${fmt(selectedDebt.balance)}</Text>
                      </View>
                      <View style={[st.debtDetailDiv, { backgroundColor: colors.surfaceEdge }]} />
                      <View style={st.debtDetailItem}>
                        <Text style={[st.debtDetailLabel, { color: colors.contentSecondary }]}>APR</Text>
                        <Text style={[st.debtDetailValue, { color: colors.contentPrimary }]}>{selectedDebt.apr}%</Text>
                      </View>
                      <View style={[st.debtDetailDiv, { backgroundColor: colors.surfaceEdge }]} />
                      <View style={st.debtDetailItem}>
                        <Text style={[st.debtDetailLabel, { color: colors.contentSecondary }]}>Minimum</Text>
                        <Text style={[st.debtDetailValue, { color: colors.contentPrimary }]}>${selectedDebt.minPayment}/mo</Text>
                      </View>
                    </View>
                  )}


                  {/* ── Payment + date inputs ── */}
                  <View style={st.fieldGroup}>
                    <Text style={[st.fieldLabel, { color: colors.contentSecondary }]}>Monthly payment</Text>
                    <View style={[st.currencyRow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                      <Text style={[st.currencySign, { color: colors.contentSecondary }]}>$</Text>
                      <TextInput
                        style={[st.currencyField, { color: colors.contentPrimary }]}
                        value={monthlyContribution} onChangeText={setMonthlyContribution}
                        keyboardType="numeric" placeholder={selectedDebt ? String(selectedDebt.minPayment) : '500'}
                        placeholderTextColor={colors.contentDimmed}
                      />
                      <Text style={[st.perMo, { color: colors.contentSecondary }]}>/mo</Text>
                    </View>
                  </View>
                  <View style={st.fieldGroup}>
                    <Text style={[st.fieldLabel, { color: colors.contentSecondary }]}>Target payoff date</Text>
                    <View style={st.dateSelector}>
                      <Pressable onPress={() => adjustMonth(-1)} style={[st.dateArrow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]} hitSlop={8}>
                        <Feather name="chevron-left" size={18} color={colors.contentPrimary} />
                      </Pressable>
                      <View style={[st.dateDisplay, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                        <Text style={[st.dateText, { color: colors.contentPrimary }]}>{fmtDate(targetDate)}</Text>
                      </View>
                      <Pressable onPress={() => adjustMonth(1)} style={[st.dateArrow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]} hitSlop={8}>
                        <Feather name="chevron-right" size={18} color={colors.contentPrimary} />
                      </Pressable>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[st.title, { color: colors.contentPrimary }]}>Plan your goal</Text>
                  <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                    Set your target, timeline, and contribution — they work together.
                  </Text>

                  <View style={st.fieldGroup}>
                    <Text style={[st.fieldLabel, { color: colors.contentSecondary }]}>Name</Text>
                    <TextInput
                      style={[st.fieldInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
                      value={title} onChangeText={setTitle}
                      placeholder="e.g. Emergency Fund"
                      placeholderTextColor={colors.contentDimmed}
                    />
                  </View>

                  <View style={[st.plannerCard, { backgroundColor: colors.surfaceElevated }]}>
                    <View style={st.plannerRow}>
                      <Text style={[st.plannerLabel, { color: colors.contentSecondary }]}>I want to save</Text>
                      <View style={[st.plannerInput, { borderColor: colors.surfaceEdge }]}>
                        <Text style={[st.currencySign, { color: colors.contentSecondary }]}>$</Text>
                        <TextInput
                          style={[st.plannerField, { color: colors.contentPrimary }]}
                          value={targetAmount} onChangeText={setTargetAmount}
                          keyboardType="numeric" placeholder="10,000"
                          placeholderTextColor={colors.contentDimmed}
                        />
                      </View>
                    </View>
                    <View style={[st.plannerDivider, { backgroundColor: colors.surfaceEdge }]} />
                    <View style={st.plannerRow}>
                      <Text style={[st.plannerLabel, { color: colors.contentSecondary }]}>By</Text>
                      <View style={st.plannerDateRow}>
                        <Pressable onPress={() => adjustMonth(-1)} style={[st.plannerDateArrow, { borderColor: colors.surfaceEdge }]} hitSlop={8}>
                          <Feather name="chevron-left" size={16} color={colors.contentPrimary} />
                        </Pressable>
                        <Text style={[st.plannerDateText, { color: colors.contentPrimary }]}>{fmtDate(targetDate)}</Text>
                        <Pressable onPress={() => adjustMonth(1)} style={[st.plannerDateArrow, { borderColor: colors.surfaceEdge }]} hitSlop={8}>
                          <Feather name="chevron-right" size={16} color={colors.contentPrimary} />
                        </Pressable>
                      </View>
                    </View>
                    <View style={[st.plannerDivider, { backgroundColor: colors.surfaceEdge }]} />
                    <View style={st.plannerRow}>
                      <Text style={[st.plannerLabel, { color: colors.contentSecondary }]}>Saving</Text>
                      <View style={[st.plannerInput, { borderColor: colors.surfaceEdge }]}>
                        <Text style={[st.currencySign, { color: colors.contentSecondary }]}>$</Text>
                        <TextInput
                          style={[st.plannerField, { color: colors.contentPrimary }]}
                          value={monthlyContribution} onChangeText={setMonthlyContribution}
                          keyboardType="numeric" placeholder={suggested > 0 ? fmt(suggested) : '500'}
                          placeholderTextColor={colors.contentDimmed}
                        />
                        <Text style={[st.plannerUnit, { color: colors.contentSecondary }]}>/mo</Text>
                      </View>
                    </View>
                  </View>

                </>
              )}
            </ScrollView>
            <View style={[st.footer, { paddingBottom: insets.bottom || 16 }]}>
              {isPayDown ? (
                <Pressable
                  style={[st.nextBtn, { backgroundColor: planPageValid ? colors.contentBrand : colors.contentDisabled }]}
                  onPress={() => goToPage(4)}
                  disabled={!planPageValid}
                >
                  <Text style={[st.nextBtnText, { color: '#fff' }]}>Next</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[st.nextBtn, { backgroundColor: planPageValid ? colors.contentBrand : colors.contentDisabled }]}
                  onPress={goNext} disabled={!planPageValid}
                >
                  <Text style={[st.nextBtnText, { color: '#fff' }]}>Next</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* ─── Page 3: Account picker (save-up only, pay-down skips) ─── */}
          <View style={[st.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={[st.title, { color: colors.contentPrimary }]}>Where should we save?</Text>
              <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                Pick the account to pull your monthly contribution from.
              </Text>
              <View style={st.accountOptions}>
                {LINKED_ACCOUNTS.map(acct => {
                  const sel = acct === linkedAccount;
                  return (
                    <Pressable key={acct} style={[st.accountRow, { backgroundColor: colors.surfaceElevated, borderColor: sel ? colors.contentPrimary : colors.surfaceEdge }, sel && { borderWidth: 2 }]} onPress={() => setLinkedAccount(acct)}>
                      <View style={[st.radio, { borderColor: sel ? colors.contentPrimary : colors.contentMuted }]}>
                        {sel && <View style={[st.radioFill, { backgroundColor: colors.contentPrimary }]} />}
                      </View>
                      <Text style={[st.accountLabel, { color: colors.contentPrimary }]}>{acct}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <View style={[st.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[st.nextBtn, { backgroundColor: accountPageValid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={goNext} disabled={!accountPageValid}
              >
                <Text style={[st.nextBtnText, { color: '#fff' }]}>Next</Text>
              </Pressable>
            </View>
          </View>

          {/* ─── Page 4: Review ─── */}
          <View style={[st.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
              <Text style={[st.title, { color: colors.contentPrimary }]}>Review your goal</Text>
              <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                Everything look right? You can edit anytime.
              </Text>
              <View style={[st.reviewCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                <View style={st.reviewHeader}>
                  <View style={[st.reviewIconWrap, { backgroundColor: colors.surfaceTint }]}>
                    <Feather name={isPayDown ? 'trending-down' : 'target'} size={20} color={colors.contentPrimary} />
                  </View>
                  <View style={st.reviewHeaderText}>
                    <Text style={[st.reviewName, { color: colors.contentPrimary }]}>{title || 'Untitled Goal'}</Text>
                    <Text style={[st.reviewType, { color: colors.contentSecondary }]}>{GOAL_TYPE_DISPLAY[goalType]}</Text>
                  </View>
                </View>
                <View style={[st.reviewDivider, { backgroundColor: colors.surfaceEdge }]} />
                <View style={st.reviewRows}>
                  <View style={st.reviewRow}>
                    <Text style={[st.reviewLabel, { color: colors.contentSecondary }]}>{isPayDown ? 'Balance' : 'Target'}</Text>
                    <Text style={[st.reviewValue, { color: colors.contentPrimary }]}>${fmt(target)}</Text>
                  </View>
                  <View style={st.reviewRow}>
                    <Text style={[st.reviewLabel, { color: colors.contentSecondary }]}>{isPayDown ? 'Payment' : 'Monthly'}</Text>
                    <Text style={[st.reviewValue, { color: colors.contentPrimary }]}>${fmt(monthly)}/mo</Text>
                  </View>
                  <View style={st.reviewRow}>
                    <Text style={[st.reviewLabel, { color: colors.contentSecondary }]}>{isPayDown ? 'Debt-free by' : 'Timeline'}</Text>
                    <Text style={[st.reviewValue, { color: colors.contentPrimary }]}>{fmtDate(targetDate)}</Text>
                  </View>
                  <View style={st.reviewRow}>
                    <Text style={[st.reviewLabel, { color: colors.contentSecondary }]}>Account</Text>
                    <Text style={[st.reviewValue, { color: colors.contentPrimary }]}>{linkedAccount || '—'}</Text>
                  </View>
                  {isPayDown && selectedDebt && debtEstimate?.withExtra && monthly > selectedDebt.minPayment && (
                    <View style={[st.reviewSavings, { backgroundColor: '#e8f5e9' }]}>
                      <Feather name="award" size={14} color="#2e7d32" />
                      <Text style={[st.reviewSavingsText, { color: '#2e7d32' }]}>
                        Saving ${fmt(debtEstimate.minOnly.totalInterest - debtEstimate.withExtra.totalInterest)} in interest vs. minimum payments
                      </Text>
                    </View>
                  )}
                  {!isPayDown && onTrack && projected > target && (
                    <View style={[st.reviewSavings, { backgroundColor: '#e8f5e9' }]}>
                      <Feather name="check-circle" size={14} color="#2e7d32" />
                      <Text style={[st.reviewSavingsText, { color: '#2e7d32' }]}>
                        On track with ~${fmt(projected - target)} extra by {fmtDate(targetDate)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
            <View style={[st.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[st.nextBtn, { backgroundColor: reviewValid ? colors.contentBrand : colors.contentDisabled }]}
                onPress={handleCreate} disabled={!reviewValid}
              >
                <Text style={[st.nextBtnText, { color: '#fff' }]}>Create goal</Text>
              </Pressable>
            </View>
          </View>

        </Animated.View>
      </View>
    </Animated.View>
  );
}

const st = StyleSheet.create({
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

  debtTabScroll: { marginBottom: 16 },
  debtTabRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  debtTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5 },
  debtTabLabel: { fontSize: 13, fontFamily: Fonts.medium },

  debtDetail: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 20 },
  debtDetailItem: { flex: 1, alignItems: 'center', gap: 2 },
  debtDetailLabel: { fontSize: 11, fontFamily: Fonts.regular, textTransform: 'uppercase', letterSpacing: 0.5 },
  debtDetailValue: { fontSize: 15, fontFamily: Fonts.bold },
  debtDetailDiv: { width: 1, height: 28 },

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
