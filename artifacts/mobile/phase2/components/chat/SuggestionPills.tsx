import React from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

export function SuggestionPills({ suggestions, onTap }: { suggestions: string[]; onTap: (s: string) => void }) {
  const { colors } = useTheme();
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <View style={styles.suggestions}>
      {suggestions.slice(0, 3).map((s, i) => (
        <Pressable key={i} style={[styles.suggestionPill, { borderColor: colors.contentBone600 }]} onPress={() => { Keyboard.dismiss(); onTap(s); }}>
          <Text style={[styles.suggestionText, { color: colors.contentPrimary }]} numberOfLines={1}>{s}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestions: {
    alignItems: 'flex-end', gap: 8,
  },
  suggestionPill: {
    borderWidth: 0.75,
    borderRadius: 24, paddingTop: 11, paddingBottom: 12, paddingHorizontal: 16,
  },
  suggestionText: { fontSize: 16, fontFamily: Fonts.regular, lineHeight: 20 },
});
