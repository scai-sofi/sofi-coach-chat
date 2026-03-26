import React, { ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { SCENARIOS, SCENARIO_ORDER } from '@/constants/scenarios';
import { AppBar } from '@/components/AppBar';

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
  const { colors } = useTheme();
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
      <Animated.View style={[styles.backdrop, { backgroundColor: colors.scrimBackdrop }, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, { backgroundColor: colors.surfaceBase, shadowColor: colors.contentStatusbar, paddingBottom: bottomPad }, sheetStyle]}>
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: colors.contentMuted }]} />
          </View>

          <AppBar
            variant="sheet"
            title="Experience Demos"
            rightAction={{
              icon: <Feather name="x" size={16} color={colors.contentSecondary} />,
              onPress: dismiss,
            }}
          />

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
                  style={[styles.row, isActive && { backgroundColor: colors.contentPrimary }, scenario.notReady && !isActive && { opacity: 0.55 }]}
                  onPress={() => { switchScenario(scenario.id); setActivePanel('none'); }}
                >
                  <View style={[styles.iconWrap, { backgroundColor: colors.surfaceTint }, isActive && { backgroundColor: colors.inverseAlpha20 }]}>
                    <Feather name={iconName} size={14} color={isActive ? colors.contentPrimaryInverse : colors.contentPrimary} />
                  </View>
                  <View style={styles.rowContent}>
                    <View style={styles.rowTitleRow}>
                      <Text style={[styles.rowTitle, { color: colors.contentPrimary }, isActive && { color: colors.contentPrimaryInverse }]} numberOfLines={1}>{scenario.title}</Text>
                      {scenario.notReady && !isActive && (
                        <View style={[styles.notReadyBadge, { backgroundColor: colors.warningBg }]}>
                          <Text style={[styles.notReadyText, { color: colors.warning }]}>WIP</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.rowSubtitle, { color: colors.contentSecondary }, isActive && { color: colors.inverseAlpha60 }]} numberOfLines={1}>
                      {scenario.subtitle}
                    </Text>
                  </View>
                  {isActive && <Feather name="check" size={16} color={colors.contentPrimaryInverse} />}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.contentSecondary }]}>All data is simulated</Text>
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
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
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
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notReadyBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  notReadyText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    lineHeight: 14,
    letterSpacing: 0.3,
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 18,
  },
  rowSubtitle: {
    fontSize: 12,
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
    fontFamily: Fonts.regular,
    lineHeight: 14,
  },
});
