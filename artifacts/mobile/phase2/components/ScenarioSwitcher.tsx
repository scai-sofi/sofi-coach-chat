import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Platform } from 'react-native';
import Svg, { Ellipse, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { AppBar } from './AppBar';
import { CloseIcon } from './icons';
import { PERSONAS, PERSONA_ORDER } from '../constants/personas';
import { Persona } from '../constants/types';

const CARD_STAGGER_MS = 100;
const SPRING_ENTER = { damping: 24, stiffness: 90, mass: 0.9 };

function darkenHex(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const r = Math.max(0, parseInt(c.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(c.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(c.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function AvatarCard({
  persona,
  index,
  isActive,
  onSelect,
  colors,
  exitProgress,
  dismissProgress,
  isSelected,
}: {
  persona: Persona;
  index: number;
  isActive: boolean;
  onSelect: (p: Persona) => void;
  colors: any;
  exitProgress: Animated.SharedValue<number>;
  dismissProgress: Animated.SharedValue<number>;
  isSelected: boolean;
}) {
  const enterScale = useSharedValue(0.3);
  const enterOpacity = useSharedValue(0);
  const enterY = useSharedValue(60);
  const enterRotate = useSharedValue(-8 + (index % 2) * 16);

  const floatY = useSharedValue(0);
  const floatRotate = useSharedValue(0);

  const shadowScale = useSharedValue(0);

  useEffect(() => {
    const delay = index * CARD_STAGGER_MS + 200;
    enterScale.value = withDelay(delay, withSpring(1, SPRING_ENTER));
    enterOpacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    enterY.value = withDelay(delay, withSpring(0, SPRING_ENTER));
    enterRotate.value = withDelay(delay, withSpring(0, { damping: 22, stiffness: 70, mass: 1 }));

    shadowScale.value = withDelay(delay + 200, withSpring(1, { damping: 24, stiffness: 80 }));

    const floatDelay = delay + 600;
    const period = 4200 + (index % 3) * 600;
    const amplitude = 4 + (index % 2) * 2;
    const rotAmplitude = 1.2;

    floatY.value = withDelay(floatDelay, withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: period / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(amplitude, { duration: period / 2, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ));

    floatRotate.value = withDelay(floatDelay, withRepeat(
      withSequence(
        withTiming(rotAmplitude, { duration: period / 2 + 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(-rotAmplitude, { duration: period / 2 + 200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ));
  }, []);

  const cardAnimStyle = useAnimatedStyle(() => {
    const ep = exitProgress.value;
    const dp = dismissProgress.value;
    if (isSelected) {
      const floatDampen = interpolate(ep, [0, 0.2], [1, 0]);
      return {
        opacity: enterOpacity.value,
        transform: [
          { translateY: enterY.value + floatY.value * floatDampen },
          { scale: enterScale.value * interpolate(ep, [0, 0.25, 0.6, 1], [1, 1.15, 1.55, 1.6]) },
          { rotate: `${interpolate(ep, [0, 0.35], [enterRotate.value + floatRotate.value * floatDampen, 0])}deg` },
        ],
      };
    }
    const stagger = index * 0.08;
    const dismissFade = interpolate(dp, [stagger, stagger + 0.5], [1, 0], 'clamp');
    const dismissDrift = interpolate(dp, [stagger, stagger + 0.6], [0, 40], 'clamp');
    const dismissShrink = interpolate(dp, [stagger, stagger + 0.5], [1, 0.85], 'clamp');
    return {
      opacity: enterOpacity.value * interpolate(ep, [0, 0.15, 0.4], [1, 0.6, 0]) * dismissFade,
      transform: [
        { translateY: enterY.value + floatY.value + interpolate(ep, [0, 0.5], [0, 30]) + dismissDrift },
        { scale: enterScale.value * interpolate(ep, [0, 0.4], [1, 0.7]) * dismissShrink },
        { rotate: `${enterRotate.value + floatRotate.value}deg` },
      ],
    };
  });

  const shadowAnimStyle = useAnimatedStyle(() => {
    const ep = exitProgress.value;
    const dp = dismissProgress.value;
    const baseOpacity = interpolate(shadowScale.value, [0, 1], [0, 0.6]);
    const stagger = index * 0.08;
    const dismissFade = interpolate(dp, [stagger, stagger + 0.4], [1, 0], 'clamp');
    if (isSelected) {
      return {
        opacity: baseOpacity * interpolate(ep, [0, 0.5, 1], [1, 1.2, 0]),
        transform: [
          { scaleX: interpolate(shadowScale.value, [0, 1], [0.4, 1]) * interpolate(ep, [0, 0.5], [1, 1.3]) },
          { scaleY: interpolate(shadowScale.value, [0, 1], [0.2, 1]) },
        ],
      };
    }
    return {
      opacity: baseOpacity * interpolate(ep, [0, 0.3], [1, 0]) * dismissFade,
      transform: [
        { scaleX: interpolate(shadowScale.value, [0, 1], [0.4, 1]) },
        { scaleY: interpolate(shadowScale.value, [0, 1], [0.2, 1]) },
      ],
    };
  });

  const textAnimStyle = useAnimatedStyle(() => {
    const ep = exitProgress.value;
    const dp = dismissProgress.value;
    const stagger = index * 0.08;
    const dismissFade = interpolate(dp, [stagger, stagger + 0.3], [1, 0], 'clamp');
    return {
      opacity: enterOpacity.value * interpolate(ep, [0, 0.12, 0.3], [1, 0.5, 0]) * dismissFade,
      transform: [
        { translateY: interpolate(ep, [0, 0.3], [0, 8]) },
      ],
    };
  });

  const pressScale = useSharedValue(1);
  const pressAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <View style={styles.avatarCell}>
      <Animated.View style={pressAnimStyle}>
        <Pressable
          onPress={() => onSelect(persona)}
          onPressIn={() => { pressScale.value = withSpring(0.9, { damping: 10, stiffness: 400 }); }}
          onPressOut={() => { pressScale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
          style={styles.avatarPressable}
        >
          <View style={styles.avatarStack}>
            <Animated.View style={[cardAnimStyle]}>
              <View style={[
                styles.avatarImageWrap,
                isActive && { borderWidth: 3, borderColor: darkenHex(persona.accentColor, 40), transform: [{ scale: 1.08 }] },
              ]}>
                <Image source={persona.avatar} style={styles.avatarImage} fadeDuration={0} />
              </View>
            </Animated.View>

            <Animated.View style={[styles.avatarShadow, shadowAnimStyle]}>
              {Platform.OS === 'web' ? (
                <View style={[styles.avatarShadowLayer, {
                  backgroundColor: persona.accentColor,
                  // @ts-expect-error web-only CSS property
                  filter: 'blur(6px)',
                }]} />
              ) : (
                <Svg width={96} height={36} style={styles.avatarShadowSvg}>
                  <Defs>
                    <Filter
                      id={`shadow-${persona.id}`}
                      x="-25%"
                      y="-100%"
                      width="150%"
                      height="300%"
                    >
                      <FeGaussianBlur stdDeviation="4" />
                    </Filter>
                  </Defs>
                  <Ellipse
                    cx={48}
                    cy={18}
                    rx={30}
                    ry={5}
                    fill={persona.accentColor}
                    opacity={0.7}
                    filter={`url(#shadow-${persona.id})`}
                  />
                </Svg>
              )}
            </Animated.View>
          </View>

          <Animated.View style={textAnimStyle}>
            <Text
              style={[styles.avatarName, { color: colors.contentPrimary }]}
              numberOfLines={1}
            >
              {persona.name}
            </Text>
            <Text
              style={[styles.avatarSubtitle, { color: colors.contentSecondary }]}
              numberOfLines={2}
            >
              {persona.subtitle}
            </Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export function ScenarioSwitcher({ isLaunch }: { isLaunch?: boolean }) {
  const { colors } = useTheme();
  const { activePersona: currentPersona, preparePersona, setActivePanel } = useCoach();
  const insets = useSafeAreaInsets();
  const orderedPersonas = PERSONA_ORDER.map(id => PERSONAS.find(p => p.id === id)!).filter(Boolean);

  const screenOpacity = useSharedValue(0);
  const exitProgress = useSharedValue(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exitProgress.value, [0, 0.1, 0.3], [1, 0.7, 0]),
    transform: [{ translateY: interpolate(exitProgress.value, [0, 0.35], [0, -24]) }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exitProgress.value, [0, 0.15], [1, 0]),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value * interpolate(exitProgress.value, [0, 0.55, 0.85, 1], [1, 1, 0.3, 0]),
  }));

  const finishDismiss = useCallback(() => {
    setActivePanel('none');
  }, [setActivePanel]);

  const dismissProgress = useSharedValue(0);

  const dismissHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dismissProgress.value, [0, 0.3], [1, 0]),
    transform: [{ translateY: interpolate(dismissProgress.value, [0, 0.5], [0, -20]) }],
  }));

  const dismissContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dismissProgress.value, [0, 0.6, 1], [1, 0.4, 0]),
  }));

  const [isDismissing, setIsDismissing] = useState(false);

  const dismiss = () => {
    if (isDismissing || selectedId) return;
    setIsDismissing(true);
    dismissProgress.value = withTiming(1, { duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1) }, (finished) => {
      if (finished) {
        runOnJS(finishDismiss)();
      }
    });
  };

  const handleSelect = (persona: Persona) => {
    if (selectedId || isDismissing) return;
    setSelectedId(persona.id);
    preparePersona(persona.id);
    exitProgress.value = withTiming(1, { duration: 1100, easing: Easing.bezier(0.22, 1, 0.36, 1) }, (finished) => {
      if (finished) {
        runOnJS(finishDismiss)();
      }
    });
  };

  return (
    <Animated.View style={[styles.fullScreen, { backgroundColor: colors.surfaceBase }, containerStyle, dismissContainerStyle]}>
      <Animated.View style={[headerStyle, dismissHeaderStyle]}>
        {isLaunch ? (
          <View style={{ paddingTop: insets.top }}>
            <View style={styles.launchHeader}>
              <Text style={[styles.headerTitle, { color: colors.contentPrimary }]}>Choose a Profile</Text>
            </View>
          </View>
        ) : (
          <AppBar
            variant="standard"
            title="Switch Accounts"
            rightActions={[{
              icon: <CloseIcon size={24} color={colors.contentPrimary} />,
              onPress: dismiss,
            }]}
            backgroundColor={colors.surfaceBase}
          />
        )}
      </Animated.View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {orderedPersonas.map((persona, index) => (
            <AvatarCard
              key={persona.id}
              persona={persona}
              index={index}
              isActive={!selectedId && currentPersona?.id === persona.id}
              onSelect={handleSelect}
              colors={colors}
              exitProgress={exitProgress}
              dismissProgress={dismissProgress}
              isSelected={selectedId === persona.id}
            />
          ))}
        </View>
      </View>

      <Animated.View
        entering={FadeIn.delay(orderedPersonas.length * CARD_STAGGER_MS + 400).duration(400)}
        style={[styles.footer, { bottom: Math.max(insets.bottom, 16) }, footerStyle]}
      >
        <Text style={[styles.footerText, { color: colors.contentMuted }]}>All data is simulated</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  launchHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 28,
    columnGap: 16,
    maxWidth: 360,
  },
  avatarCell: {
    alignItems: 'center',
    width: 160,
  },
  avatarPressable: {
    alignItems: 'center',
    gap: 8,
  },
  avatarStack: {
    width: 112,
    height: 130,
    alignItems: 'center',
  },
  avatarImageWrap: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarShadow: {
    width: 96,
    height: 36,
    position: 'absolute',
    bottom: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarShadowLayer: {
    width: 72,
    height: 12,
    borderRadius: 36,
  },
  avatarShadowSvg: {
    position: 'absolute',
  },
  avatarName: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  avatarSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 14,
  },
});
