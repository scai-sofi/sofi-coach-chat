import React, { useRef, useEffect, ComponentProps } from 'react';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import type { AppTheme } from '../../constants/theme';
import { Fonts } from '../../constants/fonts';
import { MessageChip } from '../../constants/types';
import { useCoach } from '../../context/CoachContext';
import { useToast } from '../Toast';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
export type IconName = FeatherIconName | 'brain';

export function BrainIcon({ size = 12, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.8 4 7.5 4 9.5C4 11.5 5 13 6.5 13.5C6.2 14.5 6.5 16 8 17C9 17.7 10 18 11 18L11 22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 2C14.5 2 16.5 3.5 17 5.5C18.5 5.8 20 7.5 20 9.5C20 11.5 19 13 17.5 13.5C17.8 14.5 17.5 16 16 17C15 17.7 14 18 13 18L13 22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7.5 10C8.5 10 10 9 10 7.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16.5 10C15.5 10 14 9 14 7.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 14.5C9.5 14 10.5 12.5 10.5 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 14.5C14.5 14 13.5 12.5 13.5 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function AppIcon({ name, size = 12, color = '#000', style }: { name: IconName; size?: number; color?: string; style?: any }) {
  if (name === 'brain') return <BrainIcon size={size} color={color} />;
  return <Feather name={name} size={size} color={color} style={style} />;
}

export function getChipStyles(c: AppTheme): Record<string, { bg: string; color: string; icon: IconName }> {
  return {
    'memory-saved': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'brain' },
    'memory-updated': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'brain' },
    'conflict-resolved': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'user' },
    'goal-created': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'target' },
    'goal-progress': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'target' },
    'goal-risk': { bg: c.dangerChipBg, color: c.dangerChipText, icon: 'alert-triangle' },
    'milestone': { bg: c.successBg, color: c.successDark, icon: 'star' },
    'handoff': { bg: c.infoBg, color: c.info, icon: 'arrow-up-right' },
    'alert': { bg: c.dangerChipBg, color: c.dangerChipText, icon: 'alert-triangle' },
  };
}

export const BOTTOM_CHIP_TYPES = new Set(['memory-saved', 'memory-updated', 'conflict-resolved', 'goal-created']);

export function ChipBadge({ chip, animate = true }: { chip: MessageChip; animate?: boolean }) {
  const { colors } = useTheme();
  const chipStyles = getChipStyles(colors);
  const style = chipStyles[chip.type] || chipStyles['memory-saved'];
  const { memories, navigateToMemory } = useCoach();
  const { showToast } = useToast();

  const fadeAnim = useRef(new RNAnimated.Value(animate ? 0 : 1)).current;
  const slideAnim = useRef(new RNAnimated.Value(animate ? 6 : 0)).current;

  useEffect(() => {
    if (!animate) return;
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 350, delay: 100, useNativeDriver: true }),
      RNAnimated.spring(slideAnim, { toValue: 0, tension: 120, friction: 8, delay: 100, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, animate]);

  const isNavigable = (chip.type === 'memory-saved' || chip.type === 'memory-updated' || chip.type === 'conflict-resolved');
  const hasMemoryIds = isNavigable && chip.memoryIds && chip.memoryIds.length > 0;

  const handlePress = () => {
    if (!hasMemoryIds) return;
    const ids = chip.memoryIds!;
    const anyAlive = memories.some(m => ids.includes(m.id) && m.status !== 'DELETED');
    if (anyAlive) {
      navigateToMemory(ids);
    } else {
      showToast({ message: 'This chat memory has been deleted.' });
    }
  };

  const animStyle = { opacity: fadeAnim, transform: [{ translateY: slideAnim }] };

  const chipContent = (
    <>
      <AppIcon name={style.icon} size={12} color={style.color} />
      <Text style={[styles.chipText, { color: style.color }]}>{chip.label}</Text>
      <Feather name="chevron-right" size={12} color={style.color} />
    </>
  );

  if (hasMemoryIds) {
    return (
      <RNAnimated.View style={animStyle}>
        <Pressable onPress={handlePress} style={[styles.chip, { backgroundColor: style.bg, borderColor: colors.surfaceEdgeLight }]}>
          {chipContent}
        </Pressable>
      </RNAnimated.View>
    );
  }

  return (
    <RNAnimated.View style={animStyle}>
      <View style={[styles.chip, { backgroundColor: style.bg, borderColor: colors.surfaceEdgeLight }]}>
        {chipContent}
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 0.75,
  },
  chipText: { fontSize: 12, fontFamily: Fonts.medium, lineHeight: 16, letterSpacing: 0.1 },
});
