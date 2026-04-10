// Pacific Design System — Typography tokens for React Native / Expo
// Font family: TT Norms (loaded via expo-font as 'TTNorms-*')
//
// Usage:
//   import { PacificType } from './pacificType';
//   <Text style={PacificType.body}>Hello</Text>
//   <Text style={[PacificType.heading1, { color: colors.contentPrimaryDefault }]}>Title</Text>

import { TextStyle } from 'react-native';

// Font family constants — must match the names loaded by expo-font
export const PacificFonts = {
  regular:    'TTNorms-Regular',
  medium:     'TTNorms-Medium',
  bold:       'TTNorms-Bold',
  italic:     'TTNorms-Italic',
  boldItalic: 'TTNorms-BoldItalic',
} as const;

// Pacific type scale — size, line height, weight
// Matches Pacific mobile spec (iOS/Android pts → React Native dp)
export const PacificType: Record<string, TextStyle> = {
  // Display — hero sections, marketing headers
  display: {
    fontFamily: PacificFonts.bold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.5,
  },

  // Headings
  heading1: {
    fontFamily: PacificFonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  heading2: {
    fontFamily: PacificFonts.bold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  heading3: {
    fontFamily: PacificFonts.medium,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.1,
  },

  // Body
  bodyLarge: {
    fontFamily: PacificFonts.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  body: {
    fontFamily: PacificFonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: PacificFonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: PacificFonts.bold,
    fontSize: 16,
    lineHeight: 24,
  },

  // Small / supporting
  bodySmall: {
    fontFamily: PacificFonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmallMedium: {
    fontFamily: PacificFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmallBold: {
    fontFamily: PacificFonts.bold,
    fontSize: 14,
    lineHeight: 20,
  },

  // Labels & captions
  label: {
    fontFamily: PacificFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: PacificFonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  captionMedium: {
    fontFamily: PacificFonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  captionBold: {
    fontFamily: PacificFonts.bold,
    fontSize: 12,
    lineHeight: 18,
  },

  // Overline — all-caps labels above sections
  overline: {
    fontFamily: PacificFonts.bold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Button text
  buttonLarge: {
    fontFamily: PacificFonts.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  buttonDefault: {
    fontFamily: PacificFonts.medium,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonSmall: {
    fontFamily: PacificFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },

  // Numeric / tabular figures
  numeric: {
    fontFamily: PacificFonts.regular,
    fontSize: 16,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  numericLarge: {
    fontFamily: PacificFonts.bold,
    fontSize: 28,
    lineHeight: 36,
    fontVariant: ['tabular-nums'],
  },
};
