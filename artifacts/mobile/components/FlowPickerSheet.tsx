import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

const FLOW_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  'message-circle': 'message-circle',
  'sparkles': 'zap',
  'target': 'target',
  'layers': 'layers',
  'user-check': 'user-check',
  'alert-triangle': 'alert-triangle',
  'brain': 'cpu',
  'award': 'award',
};

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function FlowPickerSheet() {
  const { colors } = useTheme();
  const { activePanel, activePersona, activeScenario, switchScenario, preparePersona, setActivePanel } = useCoach();
  const insets = useSafeAreaInsets();
  const [pressedId, setPressedId] = useState<string | null>(null);

  if (activePanel !== 'flows' || !activePersona) return null;

  const flows = activePersona.flows;
  const accent = activePersona.accentColor;

  const handleFlowSelect = (scenarioId: string) => {
    if (!scenarioId) {
      preparePersona(activePersona.id);
    } else {
      switchScenario(scenarioId, activePersona.id);
    }
    setActivePanel('none');
  };

  const dismiss = () => setActivePanel('none');

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.backdrop}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>

      <Animated.View
        entering={SlideInDown.springify().damping(22).stiffness(200)}
        exiting={SlideOutDown.duration(200)}
        style={[styles.sheet, {
          backgroundColor: colors.surfaceElevated,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }]}
      >
        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <View style={[styles.avatarWrap, { backgroundColor: hexToRgba(accent, 0.18) }]}>
            <Image source={activePersona.avatar} style={styles.avatarImg} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerName, { color: colors.contentPrimary }]}>
              {activePersona.name}
            </Text>
            <Text style={[styles.headerSub, { color: colors.contentMuted ?? colors.contentSecondary }]}>
              {activePersona.subtitle}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.strokeDivide ?? 'rgba(10,10,10,0.06)' }]} />

        {flows.map((flow, idx) => {
          const isActive = flow.scenarioId === '' ? !activeScenario : activeScenario === flow.scenarioId;
          const isPressed = pressedId === flow.scenarioId;
          return (
            <Pressable
              key={flow.scenarioId || 'free-chat'}
              style={[
                styles.flowRow,
                isActive && { backgroundColor: hexToRgba(accent, 0.08) },
                isPressed && !isActive && { backgroundColor: colors.surfaceHover ?? 'rgba(0,0,0,0.03)' },
                idx < flows.length - 1 && styles.flowRowBorder,
                idx < flows.length - 1 && { borderBottomColor: colors.strokeDivide ?? 'rgba(10,10,10,0.06)' },
              ]}
              onPress={() => handleFlowSelect(flow.scenarioId)}
              onPressIn={() => setPressedId(flow.scenarioId)}
              onPressOut={() => setPressedId(null)}
            >
              <View style={[
                styles.iconCircle,
                { backgroundColor: isActive ? hexToRgba(accent, 0.2) : hexToRgba(accent, 0.1) },
              ]}>
                <Feather
                  name={FLOW_ICONS[flow.icon] || 'play'}
                  size={16}
                  color={isActive ? colors.contentPrimary : colors.contentSecondary}
                />
              </View>
              <View style={styles.flowContent}>
                <Text
                  style={[
                    styles.flowLabel,
                    { color: colors.contentPrimary },
                    isActive && { fontFamily: Fonts.medium },
                  ]}
                >
                  {flow.label}
                </Text>
                {flow.description ? (
                  <Text
                    style={[styles.flowDesc, { color: colors.contentMuted ?? colors.contentSecondary }]}
                    numberOfLines={1}
                  >
                    {flow.description}
                  </Text>
                ) : null}
              </View>
              <View style={[
                styles.radio,
                { borderColor: isActive ? accent : (colors.strokeDivide ?? 'rgba(10,10,10,0.15)') },
              ]}>
                {isActive && <View style={[styles.radioDot, { backgroundColor: accent }]} />}
              </View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 80,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    zIndex: 81,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginTop: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  flowRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowContent: {
    flex: 1,
  },
  flowLabel: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  flowDesc: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 16,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
