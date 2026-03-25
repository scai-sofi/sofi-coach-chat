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
        { backgroundColor: colors.surfaceTint, borderColor: colors.borderSubtle },
        selected && { backgroundColor: colors.contentPrimary, borderColor: colors.contentPrimary },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          { color: colors.contentSecondary },
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 0.75,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  count: {
    fontSize: 11,
  },
});
