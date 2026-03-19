import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSequence } from 'react-native-reanimated';
import Colors from '@/constants/colors';

export function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const anim = (sv: Animated.SharedValue<number>, delay: number) => {
      sv.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(-6, { duration: 400 }),
          withTiming(0, { duration: 400 }),
        ), -1, false
      ));
    };
    anim(dot1, 0);
    anim(dot2, 200);
    anim(dot3, 400);
  }, []);

  const style1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }], opacity: dot1.value < -2 ? 1 : 0.4 }));
  const style2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }], opacity: dot2.value < -2 ? 1 : 0.4 }));
  const style3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }], opacity: dot3.value < -2 ? 1 : 0.4 }));

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
