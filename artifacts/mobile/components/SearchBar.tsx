import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';

function FilterIcon({ size = 16, color = '#706f6e' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.375 4C1.375 3.65482 1.65482 3.375 2 3.375H14C14.3452 3.375 14.625 3.65482 14.625 4C14.625 4.34518 14.3452 4.625 14 4.625H2C1.65482 4.625 1.375 4.34518 1.375 4ZM3.375 8C3.375 7.65482 3.65482 7.375 4 7.375H12C12.3452 7.375 12.625 7.65482 12.625 8C12.625 8.34518 12.3452 8.625 12 8.625H4C3.65482 8.625 3.375 8.34518 3.375 8ZM5.375 12C5.375 11.6548 5.65482 11.375 6 11.375H10C10.3452 11.375 10.625 11.6548 10.625 12C10.625 12.3452 10.3452 12.625 10 12.625H6C5.65482 12.625 5.375 12.3452 5.375 12Z"
        fill={color}
      />
    </Svg>
  );
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: 'search' | 'search-filter';
  filterActive?: boolean;
  onFilterPress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  variant = 'search',
  filterActive = false,
  onFilterPress,
}: SearchBarProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <View style={[styles.pill, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
        <Feather name="search" size={16} color={colors.contentSecondary} />
        <TextInput
          style={[styles.input, { color: colors.contentPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={colors.contentSecondary}
          value={value}
          onChangeText={onChangeText}
          cursorColor={colors.contentBone600}
          selectionColor={colors.selectionColor}
        />
      </View>
      {variant === 'search-filter' && onFilterPress && (
        <Pressable
          style={[styles.filterBtn, filterActive && { backgroundColor: colors.contentPrimary }]}
          onPress={onFilterPress}
        >
          <FilterIcon size={16} color={filterActive ? colors.contentPrimaryInverse : colors.contentSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
