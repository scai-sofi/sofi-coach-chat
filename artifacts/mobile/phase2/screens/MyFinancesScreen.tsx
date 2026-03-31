import React, { ComponentProps } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { getMember360Profile } from '../constants/member360';
import { AppBar } from '../components/AppBar';

const profile360 = getMember360Profile();

const cardShadowStyle: ViewStyle = {
  // @ts-expect-error boxShadow works across all platforms
  boxShadow: '0px 0px 1px 0px rgba(10,10,10,0.16), 0px 2px 8px 0px rgba(10,10,10,0.04), 0px 4px 16px 0px rgba(10,10,10,0.02)',
};

function sourceLabel(source: string): string {
  if (source === 'EXPLICIT') return 'You told Coach';
  if (source === 'IMPLICIT_CONFIRMED') return 'Coach learned';
  if (source === 'MEMBER_360') return 'From your profile';
  return 'You added manually';
}

const MOCK_ACCOUNTS: { title: string; subtitle: string; balance: string; icon: FeatherIconName }[] = [
  { title: 'Banking', subtitle: '0 transactions', balance: '$27,282.12', icon: 'credit-card' },
  { title: 'Invest', subtitle: 'Start trading for $1', balance: '$45,120.50', icon: 'trending-up' },
  { title: 'Credit Card', subtitle: 'Current balance', balance: '$1,282.12', icon: 'credit-card' },
];

const NET_WORTH = '$1,278,220.50';

function ProductChip({ name }: { name: string }) {
  const { colors } = useTheme();
  return (
    <View style={[chipStyles.chip, { backgroundColor: colors.surfaceTint }]}>
      <Feather name="check-circle" size={12} color={colors.contentSecondary} />
      <Text style={[chipStyles.text, { color: colors.contentPrimary }]}>{name}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
});

export default function MyFinancesScreen() {
  const { colors } = useTheme();
  const { goBack } = usePhase2Nav();
  const { memories } = useCoach();

  const priorityInsights = memories.filter(
    m => m.category === 'PRIORITIES' && m.status === 'ACTIVE'
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="My Finances" onBack={() => goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.netWorthHeader}>
          <Text style={[styles.netWorthLabel, { color: colors.contentSecondary }]}>Net worth</Text>
          <Text style={[styles.netWorthValue, { color: colors.contentPrimary }]}>{NET_WORTH}</Text>
          <Text style={[styles.netWorthSub, { color: colors.contentSecondary }]}>2 SoFi | 13 external</Text>
        </View>

        {profile360.sofiProducts && profile360.sofiProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.contentPrimary }]}>SoFi Products</Text>
            <View style={styles.productGrid}>
              {profile360.sofiProducts.map(p => (
                <ProductChip key={p} name={p} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.contentPrimary }]}>Accounts</Text>
          {MOCK_ACCOUNTS.map(acct => (
            <View key={acct.title} style={[styles.accountCard, cardShadowStyle, { backgroundColor: colors.surfaceElevated }]}>
              <View style={styles.accountTop}>
                <View style={styles.accountLeft}>
                  <View style={[styles.accountIconWrap, { backgroundColor: colors.surfaceTint }]}>
                    <Feather name={acct.icon} size={16} color={colors.contentSecondary} />
                  </View>
                  <View>
                    <Text style={[styles.accountTitle, { color: colors.contentPrimary }]}>{acct.title}</Text>
                    <Text style={[styles.accountSubtitle, { color: colors.contentSecondary }]}>{acct.subtitle}</Text>
                  </View>
                </View>
                <Text style={[styles.accountBalance, { color: colors.contentPrimary }]}>{acct.balance}</Text>
              </View>
            </View>
          ))}
        </View>

        {priorityInsights.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.contentPrimary }]}>Coach insights</Text>
            <View style={[styles.insightsCard, cardShadowStyle, { backgroundColor: colors.surfaceElevated }]}>
              {priorityInsights.map((mem, i) => (
                <React.Fragment key={mem.id}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.surfaceEdge }]} />}
                  <View style={styles.insightRow}>
                    <Feather name="zap" size={14} color={colors.contentSecondary} />
                    <View style={styles.insightTextArea}>
                      <Text style={[styles.insightText, { color: colors.contentPrimary }]}>{mem.content}</Text>
                      <Text style={[styles.insightSource, { color: colors.contentSecondary }]}>{sourceLabel(mem.source)}</Text>
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  netWorthHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 2,
  },
  netWorthLabel: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  netWorthValue: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  netWorthSub: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountCard: {
    borderRadius: 16,
    padding: 16,
  },
  accountTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  accountSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  accountBalance: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  insightsCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 14,
  },
  insightTextArea: {
    flex: 1,
    gap: 2,
  },
  insightText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  insightSource: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
});
