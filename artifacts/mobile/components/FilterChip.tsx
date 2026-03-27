import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.chip,
        { backgroundColor: colors.chipUnselectedBg, borderColor: colors.chipUnselectedBorder },
        selected && { backgroundColor: colors.chipSelectedBg, borderColor: colors.chipSelectedBg },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          { color: colors.contentBone600 },
          selected && { color: colors.contentPrimaryInverse },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
});
