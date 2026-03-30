import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Fonts } from '@/constants/fonts';

import ProfileIconSvg from '@/assets/svg/profile-icon.svg';
import NotificationBellSvg from '@/assets/svg/notification-bell.svg';
import PlusBadgeLogoSvg from '@/assets/svg/plus-badge-logo.svg';
import CoachGlyph1Svg from '@/assets/svg/coach-glyph-1.svg';
import CoachGlyph2Svg from '@/assets/svg/coach-glyph-2.svg';
import CaretExpandSvg from '@/assets/svg/caret-expand.svg';
import TabHomeSvg from '@/assets/svg/tab-home.svg';
import TabBankingSvg from '@/assets/svg/tab-banking.svg';
import TabCreditCardSvg from '@/assets/svg/tab-credit-card.svg';
import TabInvestSvg from '@/assets/svg/tab-invest.svg';
import TabLoansSvg from '@/assets/svg/tab-loans.svg';
import ChartSpendingSvg from '@/assets/svg/chart-spending.svg';
import ChartNetworthSvg from '@/assets/svg/chart-networth.svg';
import CreditScoreBarSvg from '@/assets/svg/credit-score-bar.svg';
import IconPersonalLoansSvg from '@/assets/svg/icon-personal-loans.svg';
import IconLifeInsuranceSvg from '@/assets/svg/icon-life-insurance.svg';
import IconSlrSvg from '@/assets/svg/icon-slr.svg';
import IconExploreAllSvg from '@/assets/svg/icon-explore-all.svg';

const COLORS = {
  teal: '#00a2c7',
  surfaceBase: '#faf8f5',
  white: '#ffffff',
  primaryText: '#1c1b1b',
  secondaryText: '#706f6e',
  tabSelected: '#1a1919',
  tabUnselected: '#5c5b5a',
  positive: '#1bc245',
  caution: '#8c6914',
  cautionSurface: '#ffcc00',
  accent: '#00a2c7',
  divider: 'rgba(10,10,10,0.1)',
  askCoachBg: 'rgba(0,70,97,0.2)',
  askCoachText: 'rgba(255,255,255,0.7)',
  cardShadow1: 'rgba(18,18,17,0.1)',
  cardShadow2: 'rgba(18,18,17,0.06)',
  dotInactive: 'rgba(255,255,255,0.3)',
  pillText: '#006280',
};

const cardShadowStyle: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#121211',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  android: {
    elevation: 2,
  },
  default: {
    // @ts-expect-error boxShadow works on web
    boxShadow: '0px 0px 1px 0px rgba(18,18,17,0.1), 0px 6px 12px -6px rgba(18,18,17,0.06)',
  },
}) ?? {};

const HEADER_ROW_HEIGHT = 44;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const headerHeight = insets.top + HEADER_ROW_HEIGHT;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <ProfileIconSvg width={20} height={20} />
            <LinearGradient
              colors={['#151035', '#201749', '#330072']}
              locations={[0, 0.316, 0.632]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.plusBadge}
            >
              <PlusBadgeLogoSvg width={10} height={10} />
              <Text style={styles.plusBadgeText}>Plus</Text>
            </LinearGradient>
          </View>
          <View style={styles.headerRight}>
            <Pressable hitSlop={12}>
              <NotificationBellSvg width={24} height={24} />
            </Pressable>
          </View>
        </View>
        <View style={styles.askCoachPillCenter}>
          <Pressable
            onPress={() => router.push('/chat')}
            style={styles.askCoachPillOuter}
          >
            <BlurView intensity={10} tint="dark" style={styles.askCoachPill}>
            <View style={styles.coachGlyphWrap}>
              <CoachGlyph1Svg width={14.5} height={15} style={{ position: 'absolute' }} />
              <CoachGlyph2Svg width={11} height={12} style={{ position: 'absolute', transform: [{ rotate: '4.72deg' }] }} />
            </View>
            <Text style={styles.askCoachText}>Ask Coach</Text>
            </BlurView>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 52 + insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.tealScrollSection, { paddingTop: headerHeight }]}>
          <View style={styles.greetingSection}>
            <Text style={styles.greetingText}>Good morning, Olivia</Text>
            <View style={styles.pillRow}>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardPillText}>250 pts</Text>
                <Text style={styles.rewardPillArrow}> →</Text>
              </View>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardPillText}>Get $75</Text>
                <Text style={styles.rewardPillArrow}> →</Text>
              </View>
            </View>
          </View>

          <View style={styles.dotsRow}>
            <View style={styles.dotActive} />
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
          </View>
        </View>

        <View style={styles.boneArea}>
          <View style={styles.boneTopCurve} />
          <View style={styles.accountsCards}>
            <AccountCard
              title="Banking"
              count={2}
              subtitle="0 transactions"
              balance="$27,282.12"
              showCaret
            />
            <AccountCard
              title="Invest"
              subtitle="Start trading for $1"
              actionText="Get up to $1,000"
              actionColor={COLORS.accent}
            />
            <AccountCard
              title="Crypto"
              subtitle="Win $1000 in BTC"
              actionText="Explore"
              actionColor={COLORS.accent}
            />
          </View>

        <View style={styles.shortcutsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcutsScroll}>
            <ShortcutCard icon={<IconPersonalLoansSvg width={20} height={20} />} title="Personal loans" subtitle="See rates in 1 min" />
            <ShortcutCard icon={<IconLifeInsuranceSvg width={18} height={20} />} title="Life insurance" subtitle="Starts at $5/mo" />
            <ShortcutCard icon={<IconSlrSvg width={24} height={24} />} title="Serious savings" subtitle="Student loan refis" />
            <ExploreCard />
          </ScrollView>
        </View>

        <View style={styles.insightsSection}>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsTitle}>Coach insights</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.insightsLink}>View dashboard {'>'}</Text>
            </Pressable>
          </View>
          <View style={styles.insightsCards}>
            <View style={[styles.insightCard, cardShadowStyle]}>
              <View style={styles.insightTextBlock}>
                <Text style={styles.insightLabel}>Spending</Text>
                <View style={styles.insightDataBlock}>
                  <View style={styles.marqueeRow}>
                    <View style={styles.dollarWrap}>
                      <Text style={styles.dollarSign}>$</Text>
                    </View>
                    <View style={styles.digitsRow}>
                      <Text style={styles.insightDigits}>1</Text>
                      <Text style={styles.insightComma}>,</Text>
                      <Text style={styles.insightDigits}>282</Text>
                      <View style={styles.centsWrap}>
                        <Text style={styles.insightCents}>.12</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.insightCaution}>Pacing high this month</Text>
                </View>
              </View>
              <View style={styles.chartAbsolute}>
                <ChartSpendingSvg width="100%" height={37} preserveAspectRatio="none" />
              </View>
            </View>
            <View style={[styles.insightCardSquare, cardShadowStyle]}>
              <View style={styles.insightTextBlock}>
                <Text style={styles.insightLabel}>Net Worth</Text>
                <View style={styles.insightDataBlock}>
                  <View style={styles.marqueeRow}>
                    <View style={styles.dollarWrap}>
                      <Text style={styles.dollarSign}>$</Text>
                    </View>
                    <View style={styles.digitsRow}>
                      <Text style={styles.insightDigits}>1</Text>
                      <Text style={styles.insightComma}>,</Text>
                      <Text style={styles.insightDigits}>278</Text>
                      <Text style={styles.insightComma}>,</Text>
                      <Text style={styles.insightDigits}>220</Text>
                      <View style={styles.centsWrap}>
                        <Text style={styles.insightCents}>.50</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.subtextRow}>
                    <Text style={styles.insightSubtextMedium}>2 SoFi</Text>
                    <View style={styles.subtextDivider} />
                    <Text style={styles.insightSubtextMedium}>13 external</Text>
                  </View>
                </View>
              </View>
              <View style={styles.chartAbsolute}>
                <ChartNetworthSvg width="100%" height={32} preserveAspectRatio="none" />
              </View>
            </View>
          </View>

          <View style={[styles.creditScoreCard, cardShadowStyle]}>
            <View style={styles.creditScoreContent}>
              <View style={styles.creditScoreLeft}>
                <Text style={styles.insightLabel}>Credit Score</Text>
                <View style={styles.insightDataBlock}>
                  <Text style={styles.creditScoreNumber}>732</Text>
                  <View style={styles.subtextRow}>
                    <Text style={styles.insightSubtextMedium}>Good</Text>
                    <View style={styles.subtextDivider} />
                    <Text style={styles.insightSubtextMedium}>Updated Jul 25</Text>
                  </View>
                </View>
              </View>
              <View style={styles.creditScoreRight}>
                <Text style={styles.creditScoreStatus}>Holding steady</Text>
                <Text style={styles.creditScoreDesc}>No changes to your score within the past 7 days.</Text>
              </View>
            </View>
            <View style={styles.creditBarWrap}>
              <CreditScoreBarSvg width="100%" height={12} preserveAspectRatio="none" />
            </View>
          </View>
        </View>
        </View>
      </ScrollView>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.tabBarInner}>
          <TabItem icon={<TabHomeSvg width={20} height={20} />} label="Home" active />
          <TabItem icon={<TabBankingSvg width={20} height={20} />} label="Banking" />
          <TabItem icon={<TabCreditCardSvg width={20} height={17} />} label="Credit card" />
          <TabItem icon={<TabInvestSvg width={20} height={20} />} label="Invest" />
          <TabItem icon={<TabLoansSvg width={20} height={20} />} label="Loans" />
        </View>
      </View>
    </View>
  );
}

function AccountCard({
  title,
  count,
  subtitle,
  balance,
  showCaret,
  actionText,
  actionColor,
}: {
  title: string;
  count?: number;
  subtitle: string;
  balance?: string;
  showCaret?: boolean;
  actionText?: string;
  actionColor?: string;
}) {
  return (
    <View style={[styles.accountCard, cardShadowStyle]}>
      <View style={styles.accountCardTop}>
        <View style={styles.accountCardLeft}>
          <View style={styles.accountTitleRow}>
            <Text style={styles.accountTitle}>{title}</Text>
            {count != null && (
              <View style={styles.accountCountBadge}>
                <Text style={styles.accountCountDot}>·</Text>
                <Text style={styles.accountCountNum}>{count}</Text>
              </View>
            )}
          </View>
          <Text style={styles.accountSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.accountCardRight}>
          {balance && <Text style={styles.accountBalance}>{balance}</Text>}
          {showCaret && <CaretExpandSvg width={13} height={8} />}
          {actionText && (
            <Text style={[styles.accountAction, { color: actionColor }]}>{actionText}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

function ShortcutCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={[styles.shortcutCard, cardShadowStyle]}>
      <View style={styles.shortcutIconTextRow}>
        {icon}
        <View>
          <Text style={styles.shortcutTitle}>{title}</Text>
          <Text style={styles.shortcutSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

function ExploreCard() {
  return (
    <View style={[styles.exploreCard, cardShadowStyle]}>
      <View style={styles.exploreIconTextRow}>
        <IconExploreAllSvg width={18} height={18} />
        <View>
          <Text style={styles.shortcutTitle}>Explore all</Text>
          <Text style={styles.exploreSubtitle}>See more products</Text>
        </View>
      </View>
    </View>
  );
}

function TabItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  const color = active ? COLORS.tabSelected : COLORS.tabUnselected;
  return (
    <View style={styles.tabItem}>
      <View style={styles.tabIconWrap}>{icon}</View>
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.teal,
    zIndex: 10,
  },
  tealScrollSection: {
    backgroundColor: COLORS.teal,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
    height: 22,
    borderRadius: 100,
    paddingLeft: 6,
    gap: 2,
  },
  plusBadgeText: {
    color: '#ffffff',
    fontFamily: Fonts.medium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.12,
    lineHeight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  askCoachPillCenter: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  askCoachPillOuter: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  askCoachPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.askCoachBg,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 16,
    gap: 8,
  },
  coachGlyphWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askCoachText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.askCoachText,
  },
  greetingSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  greetingText: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: COLORS.white,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  rewardPill: {
    backgroundColor: '#edf8fc',
    height: 24,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  rewardPillText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.pillText,
  },
  rewardPillArrow: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.pillText,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.dotInactive,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  boneArea: {
    backgroundColor: COLORS.surfaceBase,
    marginTop: -20,
  },
  boneTopCurve: {
    height: 20,
    backgroundColor: COLORS.teal,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  accountsCards: {
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  accountCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
  },
  accountCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  accountCardLeft: {
    flex: 1,
  },
  accountTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accountTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: COLORS.primaryText,
  },
  accountCountBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    paddingTop: 4,
  },
  accountCountDot: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.secondaryText,
  },
  accountCountNum: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.secondaryText,
  },
  accountSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondaryText,
    marginTop: 1,
  },
  accountCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountBalance: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: COLORS.primaryText,
  },
  accountAction: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  shortcutsSection: {
  },
  shortcutsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  shortcutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 56,
  },
  shortcutIconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shortcutTitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.primaryText,
  },
  shortcutSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.secondaryText,
  },
  exploreCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 56,
  },
  exploreIconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exploreSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: COLORS.secondaryText,
  },
  insightsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: COLORS.primaryText,
  },
  insightsLink: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.accent,
  },
  insightsCards: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    height: 173,
    overflow: 'hidden',
  },
  insightCardSquare: {
    width: 173,
    height: 173,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  insightTextBlock: {
    gap: 4,
  },
  insightLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    color: COLORS.secondaryText,
    textTransform: 'uppercase' as const,
  },
  insightDataBlock: {
    gap: 0,
  },
  marqueeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  dollarWrap: {
    paddingBottom: 2,
  },
  dollarSign: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: COLORS.primaryText,
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  insightDigits: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.48,
    color: COLORS.primaryText,
  },
  insightComma: {
    fontFamily: Fonts.regular,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.48,
    color: COLORS.primaryText,
  },
  centsWrap: {
    paddingBottom: 9,
  },
  insightCents: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.primaryText,
  },
  insightCaution: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.caution,
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtextDivider: {
    width: 0.5,
    height: 10,
    backgroundColor: COLORS.secondaryText,
  },
  insightSubtextMedium: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.secondaryText,
  },
  chartAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  creditScoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    height: 173,
    paddingHorizontal: 12,
    paddingVertical: 16,
    overflow: 'hidden',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  creditScoreContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditScoreLeft: {
    gap: 4,
  },
  creditScoreRight: {
    width: 149,
    paddingTop: 27,
  },
  creditScoreNumber: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.72,
    color: COLORS.primaryText,
  },
  creditScoreStatus: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: COLORS.primaryText,
  },
  creditScoreDesc: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.secondaryText,
    marginTop: 1,
  },
  creditBarWrap: {
    overflow: 'hidden',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surfaceBase,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    gap: 2,
  },
  tabIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
});
