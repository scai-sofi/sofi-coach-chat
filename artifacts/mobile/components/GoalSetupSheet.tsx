import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing, runOnJS } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useCoach, PendingGoalSetup } from '@/context/CoachContext';
import { Fonts } from '@/constants/fonts';
import { GoalType } from '@/constants/types';
import { PacificDatePicker } from '@/components/PacificDatePicker';

type GoalCategory = 'save-up' | 'pay-down' | 'investment';

interface DebtAccount {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  balance: number;
  apr: number;
  minPayment: number;
  source: 'sofi' | 'external';
}

const SOFI_DEBT_ACCOUNTS: DebtAccount[] = [
  { id: 'cc1', name: 'SoFi Credit Card', icon: 'credit-card', balance: 4820, apr: 15.99, minPayment: 96, source: 'sofi' },
  { id: 'pl1', name: 'SoFi Personal Loan', icon: 'file-text', balance: 12400, apr: 8.49, minPayment: 248, source: 'sofi' },
  { id: 'sl1', name: 'Student Loans', icon: 'book-open', balance: 28750, apr: 5.25, minPayment: 320, source: 'sofi' },
];

const CATEGORIES: { key: GoalCategory; label: string; subtitle: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'save-up', label: 'Save up', subtitle: 'Set aside money for something you want', icon: 'target' },
  { key: 'pay-down', label: 'Pay down', subtitle: 'Track progress paying off debt', icon: 'trending-down' },
  { key: 'investment', label: 'Investment', subtitle: 'Grow your money over time', icon: 'bar-chart-2' },
];

const MOCK_FINANCES = {
  monthlyTakeHome: 7200,
  rent: 2100,
  debtMinimums: 664,
  monthlySpending: 1280,
  bankBalance: 27282,
};
const DISPOSABLE = MOCK_FINANCES.monthlyTakeHome - MOCK_FINANCES.rent - MOCK_FINANCES.debtMinimums - MOCK_FINANCES.monthlySpending;

const SMART_DEFAULTS: Record<string, { target: number; monthly: number }> = {
  'Emergency Fund': { target: 21000, monthly: Math.round(DISPOSABLE * 0.30) },
  'Travel':         { target: 3000,  monthly: Math.round(DISPOSABLE * 0.12) },
  'Kids':           { target: 5000,  monthly: Math.round(DISPOSABLE * 0.10) },
  'House':          { target: 60000, monthly: Math.round(DISPOSABLE * 0.25) },
  'Car':            { target: 8000,  monthly: Math.round(DISPOSABLE * 0.15) },
  'Dining Out':     { target: 1200,  monthly: Math.round(DISPOSABLE * 0.06) },
  'Splurge':        { target: 1500,  monthly: Math.round(DISPOSABLE * 0.05) },
  'Taxes':          { target: 4000,  monthly: Math.round(DISPOSABLE * 0.10) },
  'Wedding':        { target: 25000, monthly: Math.round(DISPOSABLE * 0.20) },
  'Investment':     { target: 10000, monthly: Math.round(DISPOSABLE * 0.15) },
};

function getSmartEstimate(label: string, target: number, months: number): number {
  const defaults = SMART_DEFAULTS[label];
  if (defaults) {
    const timeBasedAmount = target > 0 && months > 0 ? Math.ceil(target / months) : 0;
    const affordable = defaults.monthly;
    if (timeBasedAmount > 0 && timeBasedAmount <= affordable * 1.5) return timeBasedAmount;
    return affordable;
  }
  if (target > 0 && months > 0) return Math.ceil(target / months);
  return Math.round(DISPOSABLE * 0.10);
}

function getSmartTarget(label: string): number {
  return SMART_DEFAULTS[label]?.target ?? 0;
}

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

type ContributionMethod = 'direct-deposit' | 'recurring' | 'one-time';

const CONTRIBUTION_METHODS: { value: ContributionMethod; title: string; subtitle: string }[] = [
  { value: 'direct-deposit', title: 'Save from every direct deposit', subtitle: 'Automatically move part of each direct deposit into your Vault' },
  { value: 'recurring', title: 'Set up recurring transfers', subtitle: 'Schedule money to move from your balance on a regular basis' },
  { value: 'one-time', title: 'Make a one-time transfer', subtitle: 'Add money whenever you choose' },
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
  const [contributionMethod, setContributionMethod] = useState<ContributionMethod>('recurring');
  const [goalType, setGoalType] = useState<GoalType>('SAVINGS_TARGET');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userDebtAccounts, setUserDebtAccounts] = useState<DebtAccount[]>([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkBalance, setLinkBalance] = useState('');
  const [linkApr, setLinkApr] = useState('');
  const [linkMin, setLinkMin] = useState('');

  const allDebtAccounts = useMemo(() => [...SOFI_DEBT_ACCOUNTS, ...userDebtAccounts], [userDebtAccounts]);

  const panelX = useSharedValue(screenWidth);
  const stripX = useSharedValue(0);

  const goToPage = (p: number, instant?: boolean) => {
    const jump = Math.abs(p - page);
    setPage(p);
    if (instant || jump > 1) {
      stripX.value = -p * screenWidth;
    } else {
      stripX.value = withSpring(-p * screenWidth, STEP_SPRING);
    }
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
        setContributionMethod('recurring');
        setShowLinkForm(false);
        setLinkName('');
        setLinkBalance('');
        setLinkApr('');
        setLinkMin('');
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
      } else if (!isPayDown) {
        const smart = getSmartEstimate(title, target, months);
        if (smart > 0) setMonthlyContribution(fmt(smart));
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
      setShowLinkForm(false);
      if (!selectedDebt) {
        const first = allDebtAccounts[0];
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
      const smartTarget = getSmartTarget('Investment');
      if (smartTarget > 0) {
        setTargetAmount(fmt(smartTarget));
      }
      setMonthlyContribution('');
      setLinkedAccount('SoFi Invest');
      goToPage(2);
    }
  };

  const selectSaveUpItem = (item: typeof SAVE_UP_ITEMS[0]) => {
    setGoalType(item.goalType);
    setTitle(item.label);
    const smartTarget = getSmartTarget(item.label);
    if (smartTarget > 0) {
      setTargetAmount(fmt(smartTarget));
    }
    setMonthlyContribution('');
    setLinkedAccount('SoFi Savings');
    goToPage(2);
  };

  const pickDebt = (debt: DebtAccount) => {
    setSelectedDebt(debt);
    setTitle(`Pay off ${debt.name}`);
    setTargetAmount(fmt(debt.balance));
    setLinkedAccount(debt.name);
    setMonthlyContribution('');
  };

  const fmtDateShort = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleLinkAccount = () => {
    const bal = parse(linkBalance);
    const apr = parseFloat(linkApr.replace(/[^0-9.]/g, '')) || 0;
    const min = parse(linkMin);
    if (!linkName.trim() || bal <= 0) return;
    const newAcct: DebtAccount = {
      id: `ext-${Date.now()}`,
      name: linkName.trim(),
      icon: 'external-link',
      balance: bal,
      apr,
      minPayment: min || Math.ceil(bal * 0.02),
      source: 'external',
    };
    setUserDebtAccounts(prev => [...prev, newAcct]);
    pickDebt(newAcct);
    setShowLinkForm(false);
    setLinkName('');
    setLinkBalance('');
    setLinkApr('');
    setLinkMin('');
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

  const reviewValid = planPageValid;

  const stepCount = isPayDown ? 3 : 4;
  const displayStep = isPayDown
    ? (page <= 0 ? 1 : page === 2 ? 2 : page >= 4 ? 3 : 2)
    : (page <= 1 ? 1 : page === 2 ? 2 : page === 3 ? 3 : 4);

  const suggested = getSmartEstimate(title, target, months);
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
                    {allDebtAccounts.map((debt) => {
                      const sel = selectedDebt?.id === debt.id;
                      return (
                        <Pressable
                          key={debt.id}
                          style={[
                            st.debtTab,
                            { backgroundColor: sel ? colors.contentPrimary : colors.surfaceElevated, borderColor: sel ? colors.contentPrimary : colors.surfaceEdge },
                          ]}
                          onPress={() => { setShowLinkForm(false); pickDebt(debt); }}
                        >
                          <Feather name={debt.icon} size={14} color={sel ? '#fff' : colors.contentPrimary} />
                          <Text style={[st.debtTabLabel, { color: sel ? '#fff' : colors.contentPrimary }]}>
                            {debt.source === 'sofi' ? debt.name.replace('SoFi ', '') : debt.name}
                          </Text>
                          {debt.source === 'external' && (
                            <View style={[st.externalBadge, { backgroundColor: colors.surfaceTint }]}>
                              <Text style={[st.externalBadgeText, { color: colors.contentBrand }]}>Linked</Text>
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                    <Pressable
                      style={[st.debtTab, st.linkAccountTab, { borderColor: colors.contentBrand, borderStyle: 'dashed' }]}
                      onPress={() => setShowLinkForm(true)}
                    >
                      <Feather name="plus" size={14} color={colors.contentBrand} />
                      <Text style={[st.debtTabLabel, { color: colors.contentBrand }]}>Link account</Text>
                    </Pressable>
                  </ScrollView>

                  {/* ── Link new account form ── */}
                  {showLinkForm && (
                    <View style={[st.linkForm, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
                      <View style={st.linkFormHeader}>
                        <Feather name="link" size={16} color={colors.contentBrand} />
                        <Text style={[st.linkFormTitle, { color: colors.contentPrimary }]}>Link an external account</Text>
                      </View>
                      <View style={st.linkFormFields}>
                        <TextInput
                          style={[st.linkInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge }]}
                          value={linkName} onChangeText={setLinkName}
                          placeholder="Account name (e.g. Chase Visa)"
                          placeholderTextColor={colors.contentDimmed}
                        />
                        <View style={st.linkFormRow}>
                          <View style={st.linkFormCol}>
                            <Text style={[st.linkInputLabel, { color: colors.contentSecondary }]}>Balance</Text>
                            <View style={[st.linkInputWrap, { borderColor: colors.surfaceEdge }]}>
                              <Text style={[st.currencySign, { color: colors.contentSecondary }]}>$</Text>
                              <TextInput
                                style={[st.linkInputField, { color: colors.contentPrimary }]}
                                value={linkBalance} onChangeText={setLinkBalance}
                                keyboardType="numeric" placeholder="0"
                                placeholderTextColor={colors.contentDimmed}
                              />
                            </View>
                          </View>
                          <View style={st.linkFormCol}>
                            <Text style={[st.linkInputLabel, { color: colors.contentSecondary }]}>APR</Text>
                            <View style={[st.linkInputWrap, { borderColor: colors.surfaceEdge }]}>
                              <TextInput
                                style={[st.linkInputField, { color: colors.contentPrimary }]}
                                value={linkApr} onChangeText={setLinkApr}
                                keyboardType="numeric" placeholder="0"
                                placeholderTextColor={colors.contentDimmed}
                              />
                              <Text style={[st.currencySign, { color: colors.contentSecondary }]}>%</Text>
                            </View>
                          </View>
                          <View style={st.linkFormCol}>
                            <Text style={[st.linkInputLabel, { color: colors.contentSecondary }]}>Min/mo</Text>
                            <View style={[st.linkInputWrap, { borderColor: colors.surfaceEdge }]}>
                              <Text style={[st.currencySign, { color: colors.contentSecondary }]}>$</Text>
                              <TextInput
                                style={[st.linkInputField, { color: colors.contentPrimary }]}
                                value={linkMin} onChangeText={setLinkMin}
                                keyboardType="numeric" placeholder="0"
                                placeholderTextColor={colors.contentDimmed}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={st.linkFormActions}>
                        <Pressable style={[st.linkFormCancel, { borderColor: colors.surfaceEdge }]} onPress={() => setShowLinkForm(false)}>
                          <Text style={[st.linkFormCancelText, { color: colors.contentSecondary }]}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={[st.linkFormAdd, { backgroundColor: linkName.trim() && parse(linkBalance) > 0 ? colors.contentBrand : colors.contentDisabled }]}
                          onPress={handleLinkAccount}
                          disabled={!linkName.trim() || parse(linkBalance) <= 0}
                        >
                          <Text style={[st.linkFormAddText, { color: '#fff' }]}>Link account</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ── Selected debt detail strip ── */}
                  {selectedDebt && !showLinkForm && (
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
                      {selectedDebt.source === 'external' && (
                        <>
                          <View style={[st.debtDetailDiv, { backgroundColor: colors.surfaceEdge }]} />
                          <View style={st.debtDetailItem}>
                            <Feather name="external-link" size={12} color={colors.contentBrand} />
                            <Text style={[st.debtDetailLabel, { color: colors.contentBrand }]}>External</Text>
                          </View>
                        </>
                      )}
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
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      style={[st.datePickerTrigger, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}
                    >
                      <Feather name="calendar" size={18} color={colors.contentSecondary} />
                      <Text style={[st.datePickerTriggerText, { color: colors.contentPrimary }]}>{fmtDateShort(targetDate)}</Text>
                      <Feather name="chevron-down" size={16} color={colors.contentSecondary} />
                    </Pressable>
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
                      <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={[st.plannerDateTrigger, { borderColor: colors.surfaceEdge }]}
                      >
                        <Text style={[st.plannerDateText, { color: colors.contentPrimary }]}>{fmtDateShort(targetDate)}</Text>
                        <Feather name="chevron-down" size={14} color={colors.contentSecondary} />
                      </Pressable>
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

          {/* ─── Page 3: Contribution method (save-up / investment only) ─── */}
          <View style={[st.stepPage, { width: screenWidth }]}>
            <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
              <Text style={[st.title, { color: colors.contentPrimary }]}>How do you want to save?</Text>
              <Text style={[st.subtitle, { color: colors.contentSecondary }]}>
                Pick the option that works best for you
              </Text>
              <View style={st.methodOptions}>
                {CONTRIBUTION_METHODS.map(method => {
                  const sel = method.value === contributionMethod;
                  return (
                    <Pressable
                      key={method.value}
                      onPress={() => setContributionMethod(method.value)}
                      style={[
                        st.methodCard,
                        {
                          backgroundColor: colors.surfaceElevated,
                          borderColor: sel ? colors.contentPrimary : 'transparent',
                          borderWidth: sel ? 2 : 0,
                        },
                      ]}
                    >
                      <View style={st.methodContent}>
                        <View style={st.methodText}>
                          <Text style={[st.methodTitle, { color: colors.contentPrimary }]}>{method.title}</Text>
                          <Text style={[st.methodSubtitle, { color: colors.contentSecondary }]}>{method.subtitle}</Text>
                        </View>
                        <View style={[st.methodRadio, { borderColor: sel ? colors.contentPrimary : colors.contentMuted }]}>
                          {sel && <View style={[st.methodRadioFill, { backgroundColor: colors.contentPrimary }]} />}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <View style={[st.footer, { paddingBottom: insets.bottom || 16 }]}>
              <Pressable
                style={[st.nextBtn, { backgroundColor: colors.contentBrand }]}
                onPress={goNext}
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
                  {!isPayDown && (
                    <View style={st.reviewRow}>
                      <Text style={[st.reviewLabel, { color: colors.contentSecondary }]}>Method</Text>
                      <Text style={[st.reviewValue, { color: colors.contentPrimary }]}>
                        {CONTRIBUTION_METHODS.find(m => m.value === contributionMethod)?.title || '—'}
                      </Text>
                    </View>
                  )}
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

      <PacificDatePicker
        visible={showDatePicker}
        date={targetDate}
        onSelect={setTargetDate}
        onClose={() => setShowDatePicker(false)}
        title={isPayDown ? 'Payoff date' : 'Target date'}
        subtitle={isPayDown ? 'When do you want to be debt-free?' : 'When do you want to reach your goal?'}
      />
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
  linkAccountTab: { backgroundColor: 'transparent' },
  externalBadge: { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  externalBadgeText: { fontSize: 9, fontFamily: Fonts.bold, textTransform: 'uppercase', letterSpacing: 0.4 },

  linkForm: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20, gap: 14 },
  linkFormHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkFormTitle: { fontSize: 15, fontFamily: Fonts.bold },
  linkFormFields: { gap: 10 },
  linkInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: Fonts.regular },
  linkFormRow: { flexDirection: 'row', gap: 8 },
  linkFormCol: { flex: 1, gap: 4 },
  linkInputLabel: { fontSize: 11, fontFamily: Fonts.medium, textTransform: 'uppercase', letterSpacing: 0.4 },
  linkInputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 },
  linkInputField: { flex: 1, fontSize: 15, fontFamily: Fonts.regular, padding: 0 },
  linkFormActions: { flexDirection: 'row', gap: 10 },
  linkFormCancel: { flex: 1, height: 48, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  linkFormCancelText: { fontSize: 14, fontFamily: Fonts.bold, lineHeight: 20 },
  linkFormAdd: { flex: 1, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  linkFormAddText: { fontSize: 14, fontFamily: Fonts.bold, lineHeight: 20 },

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
  plannerDateTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  plannerDateText: { fontSize: 15, fontFamily: Fonts.medium },


  fieldGroup: { marginBottom: 24 },
  fieldLabel: { fontSize: 12, fontFamily: Fonts.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  fieldInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17, fontFamily: Fonts.regular },
  currencyRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  currencySign: { fontSize: 17, fontFamily: Fonts.regular, marginRight: 4 },
  currencyField: { flex: 1, fontSize: 17, fontFamily: Fonts.regular, padding: 0 },
  perMo: { fontSize: 14, fontFamily: Fonts.regular, marginLeft: 4 },

  datePickerTrigger: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  datePickerTriggerText: { flex: 1, fontSize: 16, fontFamily: Fonts.medium },


  methodOptions: { gap: 16 },
  methodCard: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 16, shadowColor: '#0a0a0a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  methodContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  methodText: { flex: 1, gap: 2 },
  methodTitle: { fontSize: 16, fontFamily: Fonts.medium, lineHeight: 20 },
  methodSubtitle: { fontSize: 14, fontFamily: Fonts.medium, lineHeight: 20, opacity: 0.7 },
  methodRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  methodRadioFill: { width: 12, height: 12, borderRadius: 6 },

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
  nextBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  nextBtnText: { fontSize: 16, fontFamily: Fonts.bold, lineHeight: 20 },
});
