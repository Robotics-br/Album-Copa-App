import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  percent: number;
  height?: number;
}

export default function ProgressBar({ percent, height = 8 }: ProgressBarProps) {
  return (
    <View
      className="overflow-hidden rounded-full border border-border bg-surface-light"
      style={{ height }}>
      <View
        className="bg-primary h-full rounded-full"
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </View>
  );
}
