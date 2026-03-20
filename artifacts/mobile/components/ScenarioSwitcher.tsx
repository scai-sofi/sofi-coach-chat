import React, { ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { SCENARIOS, SCENARIO_ORDER } from '@/constants/scenarios';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

const ICON_MAP: Record<string, FeatherIconName> = {
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

const DISMISS_THRESHOLD = 120;

export function ScenarioSwitcher() {
  const { activeScenario, switchScenario, setActivePanel } = useCoach();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const orderedScenarios = SCENARIO_ORDER.map(id => SCENARIOS.find(s => s.id === id)!).filter(Boolean);
  const bottomPad = Math.max(insets.bottom, 16);

  const translateY = useSharedValue(0);
  const backdropOpacity = useSharedValue(1);

  const dismiss = () => setActivePanel('none');

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        backdropOpacity.value = Math.max(0, 1 - e.translationY / (screenHeight * 0.4));
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 800) {
        translateY.value = withTiming(screenHeight, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        backdropOpacity.value = withSpring(1, { damping: 20, stiffness: 300 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, { paddingBottom: bottomPad }, sheetStyle]}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Experience Demos</Text>
            <Pressable style={styles.closeBtn} onPress={dismiss} hitSlop={8}>
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
              const iconName: FeatherIconName = ICON_MAP[scenario.icon] || 'message-circle';

              return (
                <Pressable
                  key={scenario.id}
                  style={[styles.row, isActive && styles.rowActive]}
                  onPress={() => { switchScenario(scenario.id); setActivePanel('none'); }}
                >
                  <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                    <Feather name={iconName} size={14} color={isActive ? '#fff' : Colors.contentPrimary} />
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
        </Animated.View>
      </GestureDetector>
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
