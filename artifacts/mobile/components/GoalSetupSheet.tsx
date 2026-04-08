import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useCoach, PendingGoalSetup } from '@/context/CoachContext';
import { Fonts } from '@/constants/fonts';
import { GoalType } from '@/constants/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  EMERGENCY_FUND: 'Emergency Fund',
  DEBT_PAYOFF: 'Debt Payoff',
  SAVINGS_TARGET: 'Savings Target',
  INVESTMENT: 'Investment',
  CUSTOM: 'Custom',
};

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

export function GoalSetupSheet() {
  const { colors } = useTheme();
  const { pendingGoalSetup, createGoalFromSetup, cancelGoalSetup } = useCoach();
  const [visible, setVisible] = useState(false);
  const [setup, setSetup] = useState<PendingGoalSetup | null>(null);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [linkedAccount, setLinkedAccount] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('CUSTOM');
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const slideY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

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
      } else {
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 6);
        setTitle('');
        setTargetAmount('');
        setMonthlyContribution('');
        setTargetDate(defaultDate);
        setLinkedAccount('');
        setGoalType('SAVINGS_TARGET');
      }
      setShowAccountPicker(false);
      setVisible(true);
      slideY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else if (visible) {
      dismiss();
    }
  }, [pendingGoalSetup]);

  const onDismissComplete = () => {
    setVisible(false);
    cancelGoalSetup();
  };

  const dismiss = () => {
    slideY.value = withTiming(SHEET_HEIGHT, { duration: 280, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onDismissComplete)();
    });
    backdropOpacity.value = withTiming(0, { duration: 250 });
  };

  const handleCancel = () => {
    dismiss();
  };

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

  const adjustMonth = (delta: number) => {
    setTargetDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      if (d <= new Date()) return prev;
      return d;
    });
  };

  const animatedSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const animatedBackdrop = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  const isNewGoal = !setup?.proposal;
  const isValid = title.trim().length > 0 && parseCurrency(targetAmount) > 0 && parseCurrency(monthlyContribution) > 0 && linkedAccount.length > 0;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }, animatedBackdrop]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { backgroundColor: colors.surfacePrimary }, animatedSheet]}>
        <View style={styles.handleBar}>
          <View style={[styles.handle, { backgroundColor: colors.contentMuted }]} />
        </View>

        <View style={[styles.header, { borderBottomColor: colors.surfaceEdge }]}>
          <Pressable onPress={handleCancel} hitSlop={12}>
            <Feather name="x" size={22} color={colors.contentPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.contentPrimary }]}>{isNewGoal ? 'New goal' : 'Set up goal'}</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.contentSecondary }]}>Goal name</Text>
            <TextInput
              style={[styles.input, { color: colors.contentPrimary, borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Credit Card Payoff"
              placeholderTextColor={colors.contentDimmed}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.contentSecondary }]}>Type</Text>
            <View style={[styles.typeChips]}>
              {(Object.keys(GOAL_TYPE_LABELS) as GoalType[]).map(t => (
                <Pressable
                  key={t}
                  style={[
                    styles.typeChip,
                    { borderColor: t === goalType ? colors.contentPrimary : colors.surfaceEdge, backgroundColor: t === goalType ? colors.contentPrimary : 'transparent' },
                  ]}
                  onPress={() => setGoalType(t)}
                >
                  <Text style={[styles.typeChipText, { color: t === goalType ? colors.contentPrimaryInverse : colors.contentSecondary }]}>
                    {GOAL_TYPE_LABELS[t]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfSection]}>
              <Text style={[styles.label, { color: colors.contentSecondary }]}>Target amount</Text>
              <View style={[styles.inputRow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.currencyPrefix, { color: colors.contentSecondary }]}>$</Text>
                <TextInput
                  style={[styles.inputInner, { color: colors.contentPrimary }]}
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.contentDimmed}
                />
              </View>
            </View>

            <View style={[styles.section, styles.halfSection]}>
              <Text style={[styles.label, { color: colors.contentSecondary }]}>Monthly amount</Text>
              <View style={[styles.inputRow, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.currencyPrefix, { color: colors.contentSecondary }]}>$</Text>
                <TextInput
                  style={[styles.inputInner, { color: colors.contentPrimary }]}
                  value={monthlyContribution}
                  onChangeText={setMonthlyContribution}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.contentDimmed}
                />
                <Text style={[styles.perMonth, { color: colors.contentSecondary }]}>/mo</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.contentSecondary }]}>Target date</Text>
            <View style={styles.dateRow}>
              <Pressable onPress={() => adjustMonth(-1)} style={[styles.dateBtn, { borderColor: colors.surfaceEdge }]} hitSlop={8}>
                <Feather name="chevron-left" size={18} color={colors.contentPrimary} />
              </Pressable>
              <Text style={[styles.dateText, { color: colors.contentPrimary }]}>{formatMonthYear(targetDate)}</Text>
              <Pressable onPress={() => adjustMonth(1)} style={[styles.dateBtn, { borderColor: colors.surfaceEdge }]} hitSlop={8}>
                <Feather name="chevron-right" size={18} color={colors.contentPrimary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.contentSecondary }]}>Linked account</Text>
            <Pressable
              style={[styles.selectBtn, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}
              onPress={() => setShowAccountPicker(!showAccountPicker)}
            >
              <Text style={[styles.selectBtnText, { color: linkedAccount ? colors.contentPrimary : colors.contentDimmed }]}>
                {linkedAccount || 'Select account'}
              </Text>
              <Feather name={showAccountPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.contentSecondary} />
            </Pressable>
            {showAccountPicker && (
              <View style={[styles.accountList, { borderColor: colors.surfaceEdge, backgroundColor: colors.surfaceElevated }]}>
                {LINKED_ACCOUNTS.map(a => (
                  <Pressable
                    key={a}
                    style={[styles.accountItem, a === linkedAccount && { backgroundColor: colors.surfaceTint }]}
                    onPress={() => { setLinkedAccount(a); setShowAccountPicker(false); }}
                  >
                    <Text style={[styles.accountItemText, { color: a === linkedAccount ? colors.contentPrimary : colors.contentSecondary }]}>{a}</Text>
                    {a === linkedAccount && <Feather name="check" size={14} color={colors.contentPrimary} />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdge }]}>
            <View style={styles.summaryRow}>
              <Feather name="target" size={14} color={colors.contentSecondary} />
              <Text style={[styles.summaryText, { color: colors.contentSecondary }]}>
                ${formatCurrency(parseCurrency(targetAmount))} goal · ${formatCurrency(parseCurrency(monthlyContribution))}/mo · {formatMonthYear(targetDate)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.surfaceEdge }]}>
          <Pressable
            style={[styles.createBtn, { backgroundColor: isValid ? colors.contentPrimary : colors.contentDisabled }]}
            onPress={handleCreate}
            disabled={!isValid}
          >
            <Feather name="target" size={16} color={colors.contentPrimaryInverse} style={{ marginRight: 6 }} />
            <Text style={[styles.createBtnText, { color: colors.contentPrimaryInverse }]}>Create goal</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: Fonts.bold,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfSection: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    marginRight: 2,
  },
  inputInner: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    padding: 0,
  },
  perMonth: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    marginLeft: 4,
  },
  typeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeChipText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    flex: 1,
    textAlign: 'center',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectBtnText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  accountList: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  accountItemText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  createBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
