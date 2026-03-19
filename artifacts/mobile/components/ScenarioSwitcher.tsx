import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const orderedScenarios = SCENARIO_ORDER.map(id => SCENARIOS.find(s => s.id === id)!).filter(Boolean);
  const bottomPad = Platform.OS === 'web' ? 20 : Math.max(insets.bottom, 16);

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => setActivePanel('none')} />
      <View style={[styles.sheet, { paddingBottom: bottomPad }]}>
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Experience Demos</Text>
          <Pressable style={styles.closeBtn} onPress={() => setActivePanel('none')} hitSlop={8}>
            <Feather name="x" size={16} color={Colors.contentSecondary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {orderedScenarios.map(scenario => {
            const isActive = activeScenario === scenario.id;
            const iconName = ICON_MAP[scenario.icon] || 'message-circle';

            return (
              <Pressable
                key={scenario.id}
                style={[styles.row, isActive && styles.rowActive]}
                onPress={() => { switchScenario(scenario.id); setActivePanel('none'); }}
              >
                <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                  <Feather name={iconName as any} size={14} color={isActive ? '#fff' : Colors.contentPrimary} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={[styles.rowTitle, isActive && { color: '#fff' }]} numberOfLines={1}>{scenario.title}</Text>
                  <Text style={[styles.rowSubtitle, isActive && { color: 'rgba(255,255,255,0.6)' }]} numberOfLines={1}>
                    {scenario.subtitle}
                  </Text>
                </View>
                {isActive && <Feather name="check" size={16} color="#fff" />}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>All data is simulated</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: Colors.surfaceBase,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.contentMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 9999,
  },
  content: {
    flexGrow: 0,
  },
  contentInner: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  rowActive: {
    backgroundColor: Colors.contentPrimary,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 18,
  },
  rowSubtitle: {
    fontSize: 12,
    color: Colors.contentSecondary,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: Colors.contentSecondary,
    fontFamily: Fonts.regular,
    lineHeight: 14,
  },
});
