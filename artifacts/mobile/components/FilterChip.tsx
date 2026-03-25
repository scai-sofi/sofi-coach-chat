import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  count?: number;
}

export function FilterChip({ label, selected, onPress, count }: FilterChipProps) {
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
          { color: colors.contentPrimary },
          selected && { color: colors.contentPrimaryInverse },
        ]}
      >
        {label}
      </Text>
      {count != null && (
        <Text
          style={[
            styles.count,
            { color: colors.contentSecondary },
            selected && { color: colors.inverseAlpha60 },
          ]}
        >
          {count}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  count: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
