import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { themeMap, type ThemeColors } from './themes';

import { View } from 'react-native';
import { vars } from 'nativewind';

const ThemeContext = createContext<ThemeColors>(themeMap['original-dark']);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const style = useSettingsStore((s) => s.style);
  const colors = useMemo(() => themeMap[style] ?? themeMap['original-dark'], [style]);

  const cssVars = useMemo(
    () =>
      vars({
        '--theme-bg': colors.bg,
        '--theme-surface': colors.surface,
        '--theme-border': colors.border,
        '--theme-missingStickerBg': colors.missingStickerBg,
        '--theme-missingStickerBorder': colors.missingStickerBorder,
        '--theme-text': colors.text,
        '--theme-textSecondary': colors.textSecondary,
        '--theme-ownedStickerTextColor': colors.ownedStickerTextColor,
        '--theme-primary': colors.primary,
        '--theme-onPrimary': colors.onPrimary,
        '--theme-accent': colors.accent,
        '--theme-owned': colors.owned,
        '--theme-duplicate': colors.duplicate,
        '--theme-onDuplicate': colors.onDuplicate,
      }),
    [colors]
  );

  return (
    <ThemeContext.Provider value={colors}>
      <View style={[{ flex: 1 }, cssVars]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeColors {
  return useContext(ThemeContext);
}
