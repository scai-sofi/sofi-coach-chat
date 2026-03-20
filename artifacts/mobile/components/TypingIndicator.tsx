import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Fonts } from '@/constants/fonts';

const orbGif = require('@/assets/images/orb-analyzing.gif');

function ShimmerText() {
  const sweep = useSharedValue(0);

  useEffect(() => {
    sweep.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const char0 = useAnimatedStyle(() => {
    const color = interpolateColor(sweep.value, [0, 0.3, 0.5, 0.8, 1], ['#c4a882', '#00a2c7', '#00a2c7', '#00a2c7', '#c4a882']);
    return { color };
  });
  const char1 = useAnimatedStyle(() => {
    const color = interpolateColor(sweep.value, [0, 0.15, 0.4, 0.7, 1], ['#c4a882', '#c4a882', '#00a2c7', '#00a2c7', '#c4a882']);
    return { color };
  });
  const char2 = useAnimatedStyle(() => {
    const color = interpolateColor(sweep.value, [0, 0.3, 0.55, 0.85, 1], ['#c4a882', '#c4a882', '#c4a882', '#00a2c7', '#c4a882']);
    return { color };
  });

  const textBase = styles.analyzingText;

  return (
    <View style={styles.textRow}>
      <Animated.Text style={[textBase, char0]}>Ana</Animated.Text>
      <Animated.Text style={[textBase, char1]}>lyzi</Animated.Text>
      <Animated.Text style={[textBase, char2]}>ng...</Animated.Text>
    </View>
  );
}

export function TypingIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.orbClip}>
        <Image source={orbGif} style={styles.orbImage} />
      </View>
      <ShimmerText />
    </View>
  );
}

const ORB_SIZE = 14.5;
const ORB_IMG_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  orbClip: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbImage: {
    width: ORB_IMG_SIZE,
    height: ORB_IMG_SIZE,
  },
  textRow: {
    flexDirection: 'row',
  },
  analyzingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    letterSpacing: 0,
  },
});
