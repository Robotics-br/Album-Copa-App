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
      className="overflow-hidden rounded-full border border-border bg-surface-light"
      style={{ height }}>
      <View
        className="h-full rounded-full bg-gold"
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </View>
  );
}
