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
import { Fonts } from '@/constants/fonts';
import {
  ProfileIcon,
  BellIcon,
  CoachGlyph1,
  CoachGlyph2,
  CaretExpandIcon,
  TabHomeIcon,
  TabBankingIcon,
  TabCreditCardIcon,
  TabInvestIcon,
  TabLoansIcon,
  PlusBadgeLogo,
  SpendingChart,
  NetWorthChart,
  PersonalLoansIcon,
  SoFiTravelIcon,
  FinancialPlannerIcon,
  CareerNetworkingIcon,
} from '@/components/HomeIcons';

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
  dotInactive: 'rgba(255,255,255,0.3)',
  homeIndicator: '#1a1919',
};

const cardShadowStyle: ViewStyle = Platform.select({
  ios: {
    shadowColor: COLORS.cardShadow1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) ?? {};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.tealBg}>
        <View style={[styles.headerRow, { paddingTop: insets.top }]}>
          <View style={styles.headerLeft}>
            <ProfileIcon size={20} color="#ffffff" />
            <LinearGradient
              colors={['#151035', '#201749', '#330072']}
              locations={[0, 0.316, 0.632]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.plusBadge}
            >
              <PlusBadgeLogo size={14} />
              <Text style={styles.plusBadgeTextLabel}>PLUS</Text>
            </LinearGradient>
          </View>
          <View style={styles.headerRight}>
            <Pressable hitSlop={12}>
              <BellIcon size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.askCoachPill}
          onPress={() => router.push('/chat')}
        >
          <View style={styles.coachGlyphWrap}>
            <CoachGlyph1 size={10} />
            <CoachGlyph2 size={8} />
          </View>
          <Text style={styles.askCoachText}>Ask Coach</Text>
        </Pressable>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Good morning, Olivia</Text>
          <View style={styles.pillRow}>
            <View style={styles.rewardPill}>
              <Text style={styles.rewardPillText}>250 pts →</Text>
            </View>
            <View style={styles.rewardPill}>
              <Text style={styles.rewardPillText}>Get $75 →</Text>
            </View>
          </View>
        </View>

        <View style={styles.dotsRow}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 52 + insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accountsSection}>
          <AccountCard
            title="Banking"
            subtitle="SoFi Checking and Savings"
            balance="$7,282.12"
            showCaret
          />
          <AccountCard
            title="Invest"
            subtitle="Active Investing"
            actionText="Start investing"
            actionColor={COLORS.accent}
          />
          <AccountCard
            title="Crypto"
            subtitle="Active Investing"
            actionText="Get started"
            actionColor={COLORS.accent}
          />
        </View>

        <View style={styles.shortcutsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcutsScroll}>
            <ShortcutCard icon={<PersonalLoansIcon size={32} />} line1="Personal" line2="loans" />
            <ShortcutCard icon={<SoFiTravelIcon size={32} />} line1="SoFi" line2="Travel" />
            <ShortcutCard icon={<FinancialPlannerIcon size={32} />} line1="Financial" line2="Planner" />
            <ShortcutCard icon={<CareerNetworkingIcon size={32} />} line1="Career" line2="Networking" />
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
              <Text style={styles.insightLabel}>Spending</Text>
              <Text style={styles.insightAmount}>$1,282.12</Text>
              <View style={styles.insightStatusRow}>
                <View style={[styles.cautionDot, { backgroundColor: COLORS.cautionSurface }]} />
                <Text style={[styles.insightStatus, { color: COLORS.caution }]}>Pacing high this month</Text>
              </View>
              <View style={styles.chartWrap}>
                <SpendingChart width={150} height={38} />
              </View>
            </View>
            <View style={[styles.insightCard, cardShadowStyle]}>
              <Text style={styles.insightLabel}>Net Worth</Text>
              <Text style={styles.insightAmount}>$1,278,220.50</Text>
              <Text style={styles.insightSubtext}>2 SoFi | 13 external</Text>
              <View style={styles.chartWrap}>
                <NetWorthChart width={150} height={38} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.tabBarInner}>
          <TabItem icon={<TabHomeIcon size={20} color={COLORS.tabSelected} />} label="Home" active />
          <TabItem icon={<TabBankingIcon size={20} color={COLORS.tabUnselected} />} label="Banking" />
          <TabItem icon={<TabCreditCardIcon size={20} color={COLORS.tabUnselected} />} label="Credit card" />
          <TabItem icon={<TabInvestIcon size={20} color={COLORS.tabUnselected} />} label="Invest" />
          <TabItem icon={<TabLoansIcon size={20} color={COLORS.tabUnselected} />} label="Loans" />
        </View>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

function AccountCard({
  title,
  subtitle,
  balance,
  showCaret,
  actionText,
  actionColor,
}: {
  title: string;
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
          <Text style={styles.accountTitle}>{title}</Text>
          <Text style={styles.accountSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.accountCardRight}>
          {balance && <Text style={styles.accountBalance}>{balance}</Text>}
          {showCaret && <CaretExpandIcon size={13} color="#70706E" />}
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
  line1,
  line2,
}: {
  icon: React.ReactNode;
  line1: string;
  line2: string;
}) {
  return (
    <View style={[styles.shortcutCard, cardShadowStyle]}>
      {icon}
      <View>
        <Text style={styles.shortcutLine1}>{line1}</Text>
        <Text style={styles.shortcutLine2}>{line2}</Text>
      </View>
    </View>
  );
}

function TabItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  const color = active ? COLORS.tabSelected : COLORS.tabUnselected;
  return (
    <View style={styles.tabItem}>
      {icon}
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  tealBg: {
    backgroundColor: COLORS.teal,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 8,
    gap: 4,
  },
  plusBadgeTextLabel: {
    fontFamily: Fonts.bold,
    fontSize: 9,
    lineHeight: 12,
    color: '#ffffff',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  askCoachPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.askCoachBg,
    height: 36,
    borderRadius: 32,
    paddingLeft: 12,
    paddingRight: 16,
    gap: 8,
    marginTop: 4,
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
    marginTop: 16,
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
    marginTop: 12,
  },
  rewardPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  rewardPillText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
    color: COLORS.white,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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
    marginTop: -30,
  },
  scrollContent: {
    paddingTop: 0,
  },
  accountsSection: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  accountCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  accountCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountCardLeft: {
    flex: 1,
  },
  accountTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: COLORS.primaryText,
  },
  accountSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondaryText,
    marginTop: 2,
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
    fontSize: 14,
    lineHeight: 20,
  },
  shortcutsSection: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
  },
  shortcutsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  shortcutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
  },
  shortcutLine1: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
    color: COLORS.primaryText,
  },
  shortcutLine2: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
    color: COLORS.secondaryText,
  },
  insightsSection: {
    backgroundColor: COLORS.surfaceBase,
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
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  insightLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondaryText,
  },
  insightAmount: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: COLORS.primaryText,
    marginTop: 4,
  },
  insightStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cautionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  insightStatus: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
  },
  insightSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  chartWrap: {
    marginTop: 8,
    overflow: 'hidden',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 52,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    gap: 2,
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: COLORS.homeIndicator,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
});
