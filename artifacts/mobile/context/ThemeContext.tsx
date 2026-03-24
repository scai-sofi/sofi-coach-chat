import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from '@/constants/theme';

interface ThemeContextValue {
  colors: AppTheme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightTheme,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const value = useMemo(() => ({
    colors: scheme === 'dark' ? darkTheme : lightTheme,
    isDark: scheme === 'dark',
  }), [scheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
