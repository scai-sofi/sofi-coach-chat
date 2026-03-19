import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSequence } from 'react-native-reanimated';
import Colors from '@/constants/colors';

export function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const op1 = useSharedValue(0.4);
  const op2 = useSharedValue(0.4);
  const op3 = useSharedValue(0.4);

  useEffect(() => {
    const animY = (sv: Animated.SharedValue<number>, delay: number) => {
      sv.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(-6, { duration: 480 }),
          withTiming(0, { duration: 480 }),
        ), -1, false
      ));
    };
    const animOp = (sv: Animated.SharedValue<number>, delay: number) => {
      sv.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(1, { duration: 480 }),
          withTiming(0.4, { duration: 480 }),
        ), -1, false
      ));
    };
    animY(dot1, 0); animOp(op1, 0);
    animY(dot2, 200); animOp(op2, 200);
    animY(dot3, 400); animOp(op3, 400);
  }, []);

  const style1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }], opacity: op1.value }));
  const style2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }], opacity: op2.value }));
  const style3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }], opacity: op3.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, style1]} />
      <Animated.View style={[styles.dot, style2]} />
      <Animated.View style={[styles.dot, style3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, paddingVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.contentPrimary },
});
