import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { usePrototype } from './PrototypeContext';

const SPRING_CONFIG = { damping: 15 };

export function PhaseSwitcherFab() {
  const { protoPhase, togglePhase } = usePrototype();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);

  const openToggle = () => togglePhase();

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.1, SPRING_CONFIG);
    })
    .onUpdate((e) => {
      translateX.value = offsetX.value + e.translationX;
      translateY.value = offsetY.value + e.translationY;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      scale.value = withSpring(1, SPRING_CONFIG);
      isDragging.value = false;
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(openToggle)();
    });

  const composed = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const otherLabel = protoPhase === 'phase1' ? 'P2' : 'P1';
  const bgColor = protoPhase === 'phase1' ? '#1a1919' : '#00a2c7';

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.fab, { backgroundColor: bgColor }, animatedStyle]}>
        <Text style={styles.label}>Switch to {otherLabel}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
