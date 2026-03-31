import React, { useEffect, useCallback, ComponentProps } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Fonts } from '../constants/fonts';
import { usePhase2Nav, Phase2Screen } from '../context/Phase2NavContext';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

const TIMING_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

interface MenuItem {
  icon: FeatherIconName;
  label: string;
  screen?: Phase2Screen;
  onPress?: () => void;
}

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'award', label: 'Membership & rewards' },
  { icon: 'user', label: 'About me', screen: 'about-me' },
  { icon: 'dollar-sign', label: 'My finances', screen: 'my-finances' },
  { icon: 'target', label: 'Goals', screen: 'goals-profile' },
  { icon: 'sliders', label: 'Preferences', screen: 'preferences' },
  { icon: 'file-text', label: 'Documents' },
  { icon: 'gift', label: 'Referral' },
];

const BOTTOM_ITEMS: MenuItem[] = [
  { icon: 'settings', label: 'Settings' },
  { icon: 'log-out', label: 'Log Out' },
];

export function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const { navigate } = usePhase2Nav();

  const handleMenuPress = useCallback((item: MenuItem) => {
    if (item.screen) {
      onClose();
      navigate(item.screen);
    } else if (item.onPress) {
      item.onPress();
    }
  }, [onClose, navigate]);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, TIMING_CONFIG);
  }, [visible]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-DRAWER_WIDTH, 0]) },
    ],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.35]),
    pointerEvents: progress.value > 0.01 ? 'auto' as const : 'none' as const,
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[styles.scrim, scrimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          { width: DRAWER_WIDTH, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
          drawerStyle,
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <Feather name="user" size={32} color="#706f6e" />
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Feather name="x" size={24} color="#1a1919" />
            </Pressable>
          </View>
          <Text style={styles.name}>Olivia</Text>
          <Text style={styles.memberSince}>SoFi Member since 2023</Text>
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => handleMenuPress(item)}
            >
              <Feather
                name={item.icon}
                size={22}
                color="#1a1919"
                style={styles.menuIcon}
              />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.spacer} />

        <View style={styles.bottomSection}>
          {BOTTOM_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => handleMenuPress(item)}
            >
              <Feather
                name={item.icon}
                size={22}
                color="#1a1919"
                style={styles.menuIcon}
              />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#faf8f5',
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  header: {
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#e8e4de',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.48,
    color: '#1a1919',
  },
  memberSince: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#706f6e',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 16,
    gap: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(10,10,10,0.05)',
  },
  menuIcon: {
    width: 28,
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: '#1a1919',
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(10,10,10,0.1)',
    paddingTop: 8,
    gap: 0,
  },
});
