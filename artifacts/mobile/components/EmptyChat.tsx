import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

const SPRING_CONFIG = { damping: 20, stiffness: 180, mass: 0.8 };
const EASE_OUT = { duration: 400, easing: Easing.bezier(0.16, 1, 0.3, 1) };

const FLOAT_DURATION = 3200;
const BREATHE_DURATION = 4000;
const EASE_INOUT = Easing.bezier(0.45, 0, 0.55, 1);

const ORB_FULL_W = 96;
const ORB_FULL_H = 120;
const SPHERE_H = 86;
const SHADOW_H = ORB_FULL_H - SPHERE_H;

const SUGGESTIONS = [
  {
    label: 'Support',
    text: 'I need help with my SoFi account.',
    type: 'full' as const,
  },
  {
    label: 'Credit score',
    text: 'Why did my credit score change?',
    type: 'half' as const,
  },
  {
    label: 'Spending',
    text: 'Review monthly spending.',
    type: 'half' as const,
  },
];

export function EmptyChat() {
  const { colors } = useTheme();
  const { sendMessage, inputFocused } = useCoach();

  const fullCard = SUGGESTIONS.find(s => s.type === 'full')!;
  const halfCards = SUGGESTIONS.filter(s => s.type === 'half');

  const progress = useSharedValue(0);
  const fullCardProgress = useSharedValue(0);
  const halfCardProgress = useSharedValue(0);

  const floatPhase = useSharedValue(0);
  const breathePhase = useSharedValue(0);

  useEffect(() => {
    floatPhase.value = withRepeat(
      withTiming(1, { duration: FLOAT_DURATION, easing: EASE_INOUT }),
      -1,
      true,
    );

    breathePhase.value = withRepeat(
      withTiming(1, { duration: BREATHE_DURATION, easing: EASE_INOUT }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    if (inputFocused) {
      fullCardProgress.value = withTiming(1, { duration: 350, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      halfCardProgress.value = withDelay(80, withTiming(1, { duration: 300, easing: Easing.bezier(0.4, 0, 0.2, 1) }));
      progress.value = withDelay(100, withSpring(1, SPRING_CONFIG));
    } else {
      progress.value = withSpring(0, SPRING_CONFIG);
      halfCardProgress.value = withDelay(120, withTiming(0, EASE_OUT));
      fullCardProgress.value = withDelay(200, withTiming(0, EASE_OUT));
    }
  }, [inputFocused]);

  const orbSectionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -60]) },
      { scale: interpolate(progress.value, [0, 1], [1, 0.95]) },
    ],
  }));

  const sphereStyle = useAnimatedStyle(() => {
    const floatY = interpolate(floatPhase.value, [0, 1], [-5, 5]);
    const breatheScale = interpolate(breathePhase.value, [0, 1], [0.97, 1.03]);
    return {
      transform: [
        { translateY: floatY },
        { scale: breatheScale },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const floatY = interpolate(floatPhase.value, [0, 1], [-5, 5]);
    const scaleX = interpolate(floatY, [-5, 5], [1.08, 0.9]);
    const scaleY = interpolate(floatY, [-5, 5], [1.12, 0.85]);
    const shadowOpacity = interpolate(floatY, [-5, 5], [0.45, 0.85]);
    return {
      transform: [
        { scaleX },
        { scaleY },
      ],
      opacity: shadowOpacity,
    };
  });

  const fullCardAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(fullCardProgress.value, [0, 1], [1, 0]),
    transform: [
      { translateY: interpolate(fullCardProgress.value, [0, 1], [0, 20]) },
      { scale: interpolate(fullCardProgress.value, [0, 1], [1, 0.97]) },
    ],
  }));

  const halfCardAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(halfCardProgress.value, [0, 1], [1, 0]),
    transform: [
      { translateY: interpolate(halfCardProgress.value, [0, 1], [0, 24]) },
      { scale: interpolate(halfCardProgress.value, [0, 1], [1, 0.97]) },
    ],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.orbSection, orbSectionStyle]}>
        <View style={styles.orbCombo}>
          <Animated.View style={sphereStyle}>
            <View style={styles.sphereClip}>
              <Image
                source={require('@/assets/images/orb-combo.png')}
                style={styles.orbFullImage}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <Animated.View style={[styles.shadowClip, shadowStyle]}>
            <Image
              source={require('@/assets/images/orb-combo.png')}
              style={[styles.orbFullImage, { marginTop: -SPHERE_H }]}
              resizeMode="cover"
            />
          </Animated.View>
        </View>
        <Text style={[styles.greeting, { color: colors.contentPrimary }]}>
          {"I'm Coach.\nHow can I help?"}
        </Text>
      </Animated.View>

      <View style={styles.suggestionsSection}>
        <Animated.View style={fullCardAnimStyle}>
          <Pressable
            style={[styles.fullCard, { backgroundColor: colors.surfaceElevated, boxShadow: `0px 2px 8px ${colors.contentStatusbar}0A` }]}
            onPress={() => sendMessage(fullCard.text)}
          >
            <Text style={[styles.cardLabel, { color: colors.contentSecondary }]}>{fullCard.label.toUpperCase()}</Text>
            <Text style={[styles.cardText, { color: colors.contentPrimary }]}>{fullCard.text}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.halfRow, halfCardAnimStyle]}>
          {halfCards.map((card, i) => (
            <Pressable
              key={i}
              style={[styles.halfCard, { backgroundColor: colors.surfaceElevated, boxShadow: `0px 2px 8px ${colors.contentStatusbar}0A` }]}
              onPress={() => sendMessage(card.text)}
            >
              <Text style={[styles.cardLabel, { color: colors.contentSecondary }]}>{card.label.toUpperCase()}</Text>
              <Text style={[styles.halfCardText, { color: colors.contentPrimary }]} numberOfLines={2}>
                {card.text}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  orbSection: {
    alignItems: 'center',
    gap: 24,
    paddingTop: 100,
  },
  orbCombo: {
    alignItems: 'center',
    width: ORB_FULL_W,
    height: ORB_FULL_H,
  },
  sphereClip: {
    width: ORB_FULL_W,
    height: SPHERE_H,
    overflow: 'hidden',
  },
  shadowClip: {
    width: ORB_FULL_W,
    height: SHADOW_H,
    overflow: 'hidden',
  },
  orbFullImage: {
    width: ORB_FULL_W,
    height: ORB_FULL_H,
  },
  greeting: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  suggestionsSection: {
    gap: 12,
    paddingBottom: 16,
    paddingTop: 40,
  },
  fullCard: {
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  halfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    height: 92,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  cardText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  halfCardText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    marginTop: 4,
  },
});
