import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';

function FilterIcon({ size = 16, color = '#706f6e' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M2 4h12M4 8h8M6 12h4" stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
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
