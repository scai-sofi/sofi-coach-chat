import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { usePrototype } from './PrototypeContext';

const SPRING_CONFIG = { damping: 15 };

const PHASE_META = {
  phase1: { badge: 'P1', subtitle: 'Memory Center', bg: '#1a1919' },
  phase2: { badge: 'P2', subtitle: 'Profile', bg: '#00a2c7' },
} as const;

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
      scale.value = withSpring(1.05, SPRING_CONFIG);
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

  const meta = PHASE_META[protoPhase];
  const otherPhase = protoPhase === 'phase1' ? 'phase2' : 'phase1';
  const otherMeta = PHASE_META[otherPhase];

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.fab, { backgroundColor: meta.bg }, animatedStyle]}>
        <View style={styles.row}>
          <View style={styles.badgeCircle}>
            <Text style={[styles.badgeText, { color: meta.bg }]}>{meta.badge}</Text>
          </View>
          <View style={styles.textCol}>
            <Text style={styles.subtitle}>{meta.subtitle}</Text>
            <Text style={styles.hint}>Tap for {otherMeta.badge} · {otherMeta.subtitle}</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 14,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  textCol: {
    flexDirection: 'column',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  hint: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 13,
  },
});
