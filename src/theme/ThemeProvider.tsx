import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { themeMap, type ThemeColors } from './themes';

const ThemeContext = createContext<ThemeColors>(themeMap['original-dark']);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const style = useSettingsStore((s) => s.style);
  const colors = useMemo(() => themeMap[style] ?? themeMap['original-dark'], [style]);

  return (
    <ThemeContext.Provider value={colors}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeColors {
  return useContext(ThemeContext);
}
