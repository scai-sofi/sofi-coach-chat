import React, { useRef, useEffect, ComponentProps } from 'react';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import type { AppTheme } from '../../constants/theme';
import { Fonts } from '../../constants/fonts';
import { MessageChip } from '../../constants/types';
import { useCoach } from '../../context/CoachContext';
import { useToast } from '../Toast';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
export type IconName = FeatherIconName | 'brain';

export function BrainIcon({ size = 12, color = '#000' }: { size?: number; color?: string }) {
  return <MaterialCommunityIcons name="brain" size={size} color={color} />;
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
