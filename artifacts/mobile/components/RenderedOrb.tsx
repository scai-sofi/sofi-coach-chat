import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, Path, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

const SIZE = 86;
const HALF = SIZE / 2;
const HIGHLIGHT_DURATION = 6000;
const EASE_INOUT = Easing.bezier(0.45, 0, 0.55, 1);

export function RenderedOrb() {
  const highlightPhase = useSharedValue(0);

  useEffect(() => {
    highlightPhase.value = withRepeat(
      withTiming(1, { duration: HIGHLIGHT_DURATION, easing: EASE_INOUT }),
      -1,
      true,
    );
  }, []);

  const highlightStyle = useAnimatedStyle(() => {
    const tx = interpolate(highlightPhase.value, [0, 0.5, 1], [-6, 8, -6]);
    const ty = interpolate(highlightPhase.value, [0, 0.5, 1], [-4, 4, -4]);
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
      ],
    };
  });

  const rimGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(highlightPhase.value, [0, 0.5, 1], [0.3, 0.55, 0.3]);
    return { opacity };
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <RadialGradient id="sphereBase" cx="50%" cy="40%" rx="50%" ry="55%" fx="50%" fy="35%">
            <Stop offset="0%" stopColor="#5dd8e8" stopOpacity="1" />
            <Stop offset="35%" stopColor="#2abdd4" stopOpacity="1" />
            <Stop offset="65%" stopColor="#1aa5c0" stopOpacity="1" />
            <Stop offset="85%" stopColor="#0d8ba8" stopOpacity="1" />
            <Stop offset="100%" stopColor="#127e9a" stopOpacity="1" />
          </RadialGradient>

          <RadialGradient id="depthShadow" cx="50%" cy="85%" rx="45%" ry="25%">
            <Stop offset="0%" stopColor="#0a5e72" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#0a5e72" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="topLight" cx="50%" cy="25%" rx="40%" ry="30%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>

          <SvgLinearGradient id="edgeRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#8aeef8" stopOpacity="0.4" />
            <Stop offset="50%" stopColor="#40d0e0" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#60e8f0" stopOpacity="0.5" />
          </SvgLinearGradient>
        </Defs>

        <Circle cx={HALF} cy={HALF} r={HALF - 1} fill="url(#sphereBase)" />
        <Circle cx={HALF} cy={HALF} r={HALF - 1} fill="url(#depthShadow)" />
        <Circle cx={HALF} cy={HALF} r={HALF - 1} fill="url(#topLight)" />
        <Circle cx={HALF} cy={HALF} r={HALF - 1.5} fill="none" stroke="url(#edgeRim)" strokeWidth={1} />
      </Svg>

      <Animated.View style={[styles.highlightLayer, highlightStyle]} pointerEvents="none">
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <RadialGradient id="specular" cx="42%" cy="35%" rx="28%" ry="25%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <Stop offset="40%" stopColor="#ffffff" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={HALF} cy={HALF} r={HALF - 1} fill="url(#specular)" />
        </Svg>
      </Animated.View>

      <View style={styles.swooshLayer} pointerEvents="none">
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <SvgLinearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <Stop offset="25%" stopColor="#ffffff" stopOpacity="0.7" />
              <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <Stop offset="75%" stopColor="#ffffff" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M 30 22 Q 22 38, 32 48 Q 42 58, 38 68"
            fill="none"
            stroke="url(#swooshGrad)"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      <Animated.View style={[styles.rimGlowLayer, rimGlowStyle]} pointerEvents="none">
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <RadialGradient id="bottomGlow" cx="50%" cy="90%" rx="35%" ry="15%">
              <Stop offset="0%" stopColor="#80f0ff" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#80f0ff" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={HALF} cy={HALF} r={HALF - 1} fill="url(#bottomGlow)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: HALF,
    overflow: 'hidden',
  },
  highlightLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  swooshLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  rimGlowLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
