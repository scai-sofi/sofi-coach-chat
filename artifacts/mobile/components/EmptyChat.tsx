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

const ORB_W = 96;
const ORB_H = 120;
const SPHERE_H = 86;
const SHADOW_H = ORB_H - SPHERE_H;

const SUGGESTIONS = [
  { label: 'Support', text: 'I need help with my SoFi account.', type: 'full' as const },
  { label: 'Credit score', text: 'Why did my credit score change?', type: 'half' as const },
  { label: 'Spending', text: 'Review monthly spending.', type: 'half' as const },
];

export function EmptyChat() {
  const { colors } = useTheme();
  const { inputFocused } = useCoach();

  const lift = useSharedValue(0);
  const float = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.bezier(0.45, 0, 0.55, 1) }),
      -1, true,
    );
    breathe.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.bezier(0.45, 0, 0.55, 1) }),
      -1, true,
    );
  }, []);

  useEffect(() => {
    lift.value = withSpring(inputFocused ? 1 : 0, { damping: 20, stiffness: 180, mass: 0.8 });
  }, [inputFocused]);

  const orbSectionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(lift.value, [0, 1], [0, -50]) }],
  }));

  const sphereStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY:
        interpolate(float.value, [0, 1], [-5, 5]) +
        interpolate(breathe.value, [0, 1], [-2, 2]),
    }],
  }));

  const shadowStyle = useAnimatedStyle(() => {
    const y =
      interpolate(float.value, [0, 1], [-5, 5]) +
      interpolate(breathe.value, [0, 1], [-2, 2]);
    return {
      transform: [
        { scaleX: interpolate(y, [-7, 7], [1.08, 0.9]) },
        { scaleY: interpolate(y, [-7, 7], [1.12, 0.85]) },
      ],
      opacity: interpolate(y, [-7, 7], [0.45, 0.85]),
    };
  });

  return (
    <View style={styles.orbWrapper}>
      <Animated.View style={[styles.orbSection, orbSectionStyle]}>
        <View style={styles.orbCombo}>
          <Animated.View style={sphereStyle}>
            <View style={styles.sphereClip}>
              <Image
                source={require('@/assets/images/orb-combo.png')}
                style={styles.orbImage}
                resizeMode="cover"
              />
            </View>
          </Animated.View>
          <Animated.View style={[styles.shadowClip, shadowStyle]}>
            <Image
              source={require('@/assets/images/orb-combo.png')}
              style={[styles.orbImage, { marginTop: -SPHERE_H }]}
              resizeMode="cover"
            />
          </Animated.View>
        </View>
        <Text style={[styles.greeting, { color: colors.contentPrimary }]}>
          {"I'm Coach.\nHow can I help?"}
        </Text>
      </Animated.View>
    </View>
  );
}

export function SuggestionCards({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const { colors } = useTheme();
  const { sendMessage, inputFocused } = useCoach();

  const fullCard = SUGGESTIONS.find(s => s.type === 'full')!;
  const halfCards = SUGGESTIONS.filter(s => s.type === 'half');

  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = inputFocused
      ? withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
      : withDelay(80, withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }));
  }, [inputFocused]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(fade.value, [0, 1], [1, 0]),
    transform: [{ translateY: interpolate(fade.value, [0, 1], [0, 10]) }],
    pointerEvents: fade.value > 0.5 ? 'none' as const : 'auto' as const,
  }));

  return (
    <Animated.View style={[styles.suggestionsSection, { bottom: bottomOffset + 12 }, animStyle]}>
      <Pressable
        style={[styles.fullCard, { backgroundColor: colors.surfaceElevated, boxShadow: `0px 2px 8px ${colors.contentStatusbar}0A` }]}
        onPress={() => sendMessage(fullCard.text)}
      >
        <Text style={[styles.cardLabel, { color: colors.contentSecondary }]}>{fullCard.label.toUpperCase()}</Text>
        <Text style={[styles.cardText, { color: colors.contentPrimary }]}>{fullCard.text}</Text>
      </Pressable>

      <View style={styles.halfRow}>
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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orbWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orbSection: {
    alignItems: 'center',
    gap: 24,
    paddingTop: 100,
  },
  orbCombo: {
    alignItems: 'center',
    width: ORB_W,
    height: ORB_H,
  },
  sphereClip: {
    width: ORB_W,
    height: SPHERE_H,
    overflow: 'hidden',
  },
  shadowClip: {
    width: ORB_W,
    height: SHADOW_H,
    overflow: 'hidden',
  },
  orbImage: {
    width: ORB_W,
    height: ORB_H,
  },
  greeting: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  suggestionsSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 12,
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
