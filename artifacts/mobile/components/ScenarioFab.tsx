import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

const FLOW_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  'sparkles': 'zap',
  'target': 'target',
  'layers': 'layers',
  'user-check': 'user-check',
  'alert-triangle': 'alert-triangle',
  'brain': 'cpu',
  'award': 'award',
};

export function ScenarioFab() {
  const { colors } = useTheme();
  const { activePanel, activePersona, activeScenario, switchScenario } = useCoach();
  const [open, setOpen] = useState(false);

  const scale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (activePanel !== 'none' || !activePersona) return null;

  const flows = activePersona.flows;

  const handleFlowSelect = (scenarioId: string) => {
    switchScenario(scenarioId, activePersona.id);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {open && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(120)}
            style={[styles.popover, { backgroundColor: colors.surfaceElevated }]}
          >
            <Text style={[styles.popoverTitle, { color: colors.contentSecondary }]}>
              {activePersona.name}'s scenarios
            </Text>
            {flows.map((flow, idx) => {
              const isActive = activeScenario === flow.scenarioId;
              return (
                <Pressable
                  key={flow.scenarioId}
                  style={[
                    styles.flowRow,
                    idx < flows.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.contentMuted },
                    isActive && { backgroundColor: colors.surfaceTint },
                  ]}
                  onPress={() => handleFlowSelect(flow.scenarioId)}
                >
                  <Feather
                    name={FLOW_ICONS[flow.icon] || 'play'}
                    size={16}
                    color={isActive ? colors.contentBrand : colors.contentSecondary}
                  />
                  <Text
                    style={[
                      styles.flowLabel,
                      { color: colors.contentPrimary },
                      isActive && { color: colors.contentBrand, fontFamily: Fonts.medium },
                    ]}
                  >
                    {flow.label}
                  </Text>
                  {isActive && (
                    <Feather name="check" size={14} color={colors.contentBrand} />
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        </>
      )}

      <Animated.View style={fabStyle}>
        <Pressable
          style={[styles.fab, { backgroundColor: colors.contentPrimary }]}
          onPress={() => setOpen(!open)}
          onPressIn={() => { scale.value = withSpring(0.92, { damping: 15, stiffness: 300 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        >
          <Feather name="sliders" size={18} color={colors.contentPrimaryInverse} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    alignItems: 'flex-end',
    zIndex: 30,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  popover: {
    position: 'absolute',
    bottom: 56,
    right: 0,
    minWidth: 220,
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  popoverTitle: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  flowLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
});
