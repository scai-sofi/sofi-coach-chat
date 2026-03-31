import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { getMember360Profile } from '../constants/member360';
import { AppBar } from '../components/AppBar';

const profile360 = getMember360Profile();

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  provenance: string;
}

function DetailRow({ icon, label, value, provenance }: DetailRowProps) {
  const { colors } = useTheme();
  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.iconWrap}>
        <Feather name={icon as any} size={18} color={colors.contentSecondary} />
      </View>
      <View style={detailStyles.textArea}>
        <Text style={[detailStyles.label, { color: colors.contentSecondary }]}>{label}</Text>
        <Text style={[detailStyles.value, { color: colors.contentPrimary }]}>{value}</Text>
      </View>
      <Text style={[detailStyles.provenance, { color: colors.contentSecondary }]}>{provenance}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
  value: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  provenance: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
});

function sourceLabel(source: string): string {
  if (source === 'EXPLICIT') return 'You told Coach';
  if (source === 'IMPLICIT_CONFIRMED') return 'Coach learned';
  if (source === 'MEMBER_360') return 'From your profile';
  return 'You added';
}

export default function AboutMeScreen() {
  const { colors } = useTheme();
  const { navigate } = usePhase2Nav();
  const { memories } = useCoach();

  const aboutMeMemories = memories.filter(
    m => m.category === 'ABOUT_ME' && m.status === 'ACTIVE'
  );

  const lifeDetails: DetailRowProps[] = [];
  if (profile360.income) lifeDetails.push({ icon: 'dollar-sign', label: 'Income', value: profile360.income, provenance: 'From your profile' });
  if (profile360.employer) lifeDetails.push({ icon: 'briefcase', label: 'Employer', value: profile360.employer, provenance: 'From your profile' });
  if (profile360.location) lifeDetails.push({ icon: 'map-pin', label: 'Location', value: profile360.location, provenance: 'From your profile' });
  if (profile360.age) lifeDetails.push({ icon: 'calendar', label: 'Age', value: `${profile360.age} years old`, provenance: 'From your profile' });
  if (profile360.creditScore) lifeDetails.push({ icon: 'bar-chart-2', label: 'Credit score', value: profile360.creditScore, provenance: 'From your profile' });
  if (profile360.housingStatus) lifeDetails.push({ icon: 'home', label: 'Housing', value: profile360.housingStatus.charAt(0).toUpperCase() + profile360.housingStatus.slice(1), provenance: 'From your profile' });
  if (profile360.maritalStatus) lifeDetails.push({ icon: 'heart', label: 'Marital status', value: profile360.maritalStatus.charAt(0).toUpperCase() + profile360.maritalStatus.slice(1), provenance: 'From your profile' });

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="About Me" onBack={() => navigate('home')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.frameBg }]}>
            <Feather name="user" size={28} color={colors.contentSecondary} />
          </View>
          <Text style={[styles.name, { color: colors.contentPrimary }]}>Olivia</Text>
          <Text style={[styles.memberSince, { color: colors.contentSecondary }]}>SoFi Member since 2023</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.contentPrimary }]}>Life details</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
            {lifeDetails.map((item, i) => (
              <React.Fragment key={item.label}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.surfaceEdge }]} />}
                <DetailRow {...item} />
              </React.Fragment>
            ))}
          </View>
        </View>

        {aboutMeMemories.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.contentPrimary }]}>What Coach knows</Text>
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}>
              {aboutMeMemories.map((mem, i) => (
                <React.Fragment key={mem.id}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.surfaceEdge }]} />}
                  <View style={styles.knowledgeRow}>
                    <Text style={[styles.knowledgeContent, { color: colors.contentPrimary }]}>{mem.content}</Text>
                    <Text style={[styles.knowledgeSource, { color: colors.contentSecondary }]}>{sourceLabel(mem.source)}</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
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
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  knowledgeRow: {
    paddingVertical: 14,
    gap: 4,
  },
  knowledgeContent: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  knowledgeSource: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
});
