import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { SearchIcon, FilterIcon } from '@/components/icons';

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
        <SearchIcon size={16} color={colors.contentSecondary} />
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
          <FilterIcon size={18} color={filterActive ? colors.contentPrimaryInverse : colors.contentSecondary} />
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
    borderWidth: 0.75,
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
