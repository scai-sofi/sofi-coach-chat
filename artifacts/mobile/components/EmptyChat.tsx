import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

const SPRING_CONFIG = { damping: 20, stiffness: 180, mass: 0.8 };
const EASE_OUT = { duration: 400, easing: Easing.bezier(0.16, 1, 0.3, 1) };

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

  const orbAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -60]) },
      { scale: interpolate(progress.value, [0, 1], [1, 0.95]) },
    ],
  }));

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
      <Animated.View style={[styles.orbSection, orbAnimStyle]}>
        <View style={styles.orbCombo}>
          <Image
            source={require('@/assets/images/orb-combo.png')}
            style={styles.orbComboImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.greeting, { color: colors.contentPrimary }]}>
          {"I'm Coach.\nHow can I help?"}
        </Text>
      </Animated.View>

      <View style={styles.suggestionsSection}>
        <Animated.View style={fullCardAnimStyle}>
          <Pressable
            style={[styles.fullCard, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}
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
              style={[styles.halfCard, { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadowColor }]}
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
    gap: 12,
  },
  orbComboImage: {
    width: 96,
    height: 120,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
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
