import React, { useCallback, useEffect } from 'react';
import { View, Pressable, Modal, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@/context/ThemeContext';

const DISMISS_THRESHOLD = 120;
const SPRING_CONFIG = { damping: 28, stiffness: 220, mass: 0.6 };

interface PacificBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function PacificBottomSheet({ visible, onClose, children }: PacificBottomSheetProps) {
  const { colors } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const translateY = useSharedValue(screenHeight);
  const scrimOpacity = useSharedValue(0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, SPRING_CONFIG);
      scrimOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [visible]);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(screenHeight, { duration: 280 }, () => {
      runOnJS(onClose)();
    });
    scrimOpacity.value = withTiming(0, { duration: 250 });
  }, [onClose, screenHeight]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragY.value = 0;
    })
    .onUpdate((e) => {
      const clampedY = Math.max(0, e.translationY);
      dragY.value = clampedY;
      translateY.value = clampedY;
      scrimOpacity.value = interpolate(
        clampedY,
        [0, DISMISS_THRESHOLD * 2],
        [1, 0.2],
        Extrapolation.CLAMP,
      );
    })
    .onEnd((e) => {
      if (dragY.value > DISMISS_THRESHOLD || e.velocityY > 500) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
        scrimOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.round(translateY.value) }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={dismiss}>
      <GestureHandlerRootView style={s.fill}>
        <View style={s.overlay}>
          <Animated.View style={[s.scrim, scrimStyle]}>
            <Pressable style={s.fill} onPress={dismiss} />
          </Animated.View>

          <Animated.View style={[s.sheetOuter, { backgroundColor: colors.surfaceBase }, sheetStyle]}>
            <GestureDetector gesture={panGesture}>
              <Animated.View style={s.dragZone}>
                <View style={s.dragHandleWrap}>
                  <View style={[s.dragHandle, { backgroundColor: colors.contentDimmed }]} />
                </View>
              </Animated.View>
            </GestureDetector>

            <View style={s.sheetBody}>
              {children}
            </View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.5)',
  },
  sheetOuter: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  dragZone: {
    zIndex: 10,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 4,
  },
  sheetBody: {
    overflow: 'hidden',
  },
});
