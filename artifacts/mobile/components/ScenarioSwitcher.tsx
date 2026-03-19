import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { SCENARIOS, SCENARIO_ORDER } from '@/constants/scenarios';

const ICON_MAP: Record<string, string> = {
  'sparkles': 'star',
  'user-check': 'user-check',
  'brain': 'cpu',
  'target': 'target',
  'alert-triangle': 'alert-triangle',
  'party-popper': 'award',
  'calendar-check': 'calendar',
  'layers': 'layers',
  'shield-check': 'shield',
  'message-circle': 'message-circle',
};

export function ScenarioSwitcher() {
  const { activeScenario, switchScenario, setActivePanel } = useCoach();
  const orderedScenarios = SCENARIO_ORDER.map(id => SCENARIOS.find(s => s.id === id)!).filter(Boolean);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Experience Demos</Text>
        <Pressable style={styles.closeBtn} onPress={() => setActivePanel('none')}>
          <Feather name="x" size={18} color={Colors.contentPrimary} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 20 }}>
        <Text style={styles.intro}>
          Each scenario demonstrates a different part of the memory + goals strategy. Tap to load the conversation.
        </Text>

        {orderedScenarios.map(scenario => {
          const isActive = activeScenario === scenario.id;
          const iconName = ICON_MAP[scenario.icon] || 'message-circle';

          return (
            <Pressable
              key={scenario.id}
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => switchScenario(scenario.id)}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Feather name={iconName as any} size={14} color={isActive ? '#fff' : Colors.contentPrimary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, isActive && { color: '#fff' }]}>{scenario.title}</Text>
                <Text style={[styles.cardSubtitle, isActive && { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={2}>
                  {scenario.subtitle}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>All data is simulated. Scenarios reset when you switch.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: Colors.surfaceBase },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(10,10,10,0.1)',
  },
  headerTitle: { fontSize: 16, fontFamily: Fonts.medium, color: Colors.contentPrimary, lineHeight: 20 },
  closeBtn: { padding: 6, borderRadius: 9999 },
  content: { flex: 1 },
  intro: {
    fontSize: 13, color: Colors.contentSecondary, fontFamily: Fonts.regular, lineHeight: 18, marginBottom: 8,
  },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 12, borderRadius: 16,
    backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)',
  },
  cardActive: {
    backgroundColor: Colors.contentPrimary, borderColor: Colors.contentPrimary,
  },
  iconWrap: {
    padding: 6, borderRadius: 9999, backgroundColor: Colors.surfaceTint,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontFamily: Fonts.medium, color: Colors.contentPrimary, lineHeight: 18 },
  cardSubtitle: { fontSize: 12, color: Colors.contentSecondary, fontFamily: Fonts.regular, lineHeight: 16, marginTop: 2 },
  footer: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(10,10,10,0.1)',
    alignItems: 'center',
  },
  footerText: { fontSize: 11, color: Colors.contentSecondary, fontFamily: Fonts.regular, textAlign: 'center', lineHeight: 14 },
});
