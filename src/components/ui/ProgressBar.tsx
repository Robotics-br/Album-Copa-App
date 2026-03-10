import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ProgressBarProps {
  percent: number;
  height?: number;
}

export default function ProgressBar({ percent, height = 8 }: ProgressBarProps) {
  const t = useTheme();

  return (
    <View
      style={{
        height,
        backgroundColor: t.surfaceLight,
        borderRadius: 999,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: t.border,
      }}>
      <View
        style={{
          height: '100%',
          width: `${Math.min(100, percent)}%`,
          backgroundColor: t.gold,
          borderRadius: 999,
        }}
      />
    </View>
  );
}
