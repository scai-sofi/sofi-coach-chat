import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/constants/fonts';

function AnimatedOrb() {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => {
    const scale = 1 + pulse.value * 0.2;
    const opacity = 0.25 + pulse.value * 0.25;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const innerPulseStyle = useAnimatedStyle(() => {
    const opacity = 0.6 + pulse.value * 0.4;
    return { opacity };
  });

  return (
    <View style={orbStyles.wrapper}>
      <Animated.View style={[orbStyles.glow, glowStyle]}>
        <LinearGradient
          colors={['rgba(0,162,199,0.5)', 'rgba(244,228,193,0.3)', 'rgba(0,162,199,0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={orbStyles.glowFill}
        />
      </Animated.View>

      <Animated.View style={[orbStyles.orbOuter, orbStyle]}>
        <LinearGradient
          colors={['#f4e4c1', '#00a2c7', '#006a83']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={orbStyles.orbGradient}
        />
      </Animated.View>

      <Animated.View style={[orbStyles.innerHighlight, innerPulseStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={orbStyles.innerHighlightFill}
        />
      </Animated.View>
    </View>
  );
}

const ORB_SIZE = 14.5;

const orbStyles = StyleSheet.create({
  wrapper: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: ORB_SIZE + 8,
    height: ORB_SIZE + 8,
    borderRadius: (ORB_SIZE + 8) / 2,
    overflow: 'hidden',
  },
  glowFill: {
    flex: 1,
    borderRadius: (ORB_SIZE + 8) / 2,
  },
  orbOuter: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: 60,
    overflow: 'hidden',
  },
  orbGradient: {
    flex: 1,
  },
  innerHighlight: {
    position: 'absolute',
    width: ORB_SIZE * 0.7,
    height: ORB_SIZE * 0.5,
    borderRadius: ORB_SIZE,
    overflow: 'hidden',
    top: 1,
  },
  innerHighlightFill: {
    flex: 1,
  },
});

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
      <AnimatedOrb />
      <ShimmerText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
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
