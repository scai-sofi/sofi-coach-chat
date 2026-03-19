import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

export function ScenarioFab() {
  const { setActivePanel, activePanel, messages } = useCoach();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);

  const openPanel = () => setActivePanel('scenarios');

  const gesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.1, { damping: 15 });
    })
    .onUpdate((e) => {
      translateX.value = offsetX.value + e.translationX;
      translateY.value = offsetY.value + e.translationY;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      scale.value = withSpring(1, { damping: 15 });
      isDragging.value = false;
    });

  const tap = Gesture.Tap()
    .onEnd(() => {
      runOnJS(openPanel)();
    });

  const composed = Gesture.Race(gesture, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (activePanel !== 'none' || messages.length === 0) return null;

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.fab, animatedStyle]}>
        <Feather name="play-circle" size={20} color="#fff" />
        <Animated.Text style={styles.fabText}>Demos</Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 100 : 120,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.contentPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 30,
  },
  fabText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
});
