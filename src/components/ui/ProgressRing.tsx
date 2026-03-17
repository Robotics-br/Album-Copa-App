import React from 'react';
import { View } from 'react-native';
import { AppText as Text } from './AppText';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({ percent, size = 140, strokeWidth = 6 }: ProgressRingProps) {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const PADDING = 2; // Buffer to prevent stroke clipping
  const radius = (size - strokeWidth - PADDING * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percent / 100) * circumference;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Outer border */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2}
          stroke={t.primary}
          strokeWidth={1}
          fill="none"
          opacity={1}
        />
        {/* Background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={t.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Inner border */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2}
          stroke={t.primary}
          strokeWidth={1}
          fill="none"
          opacity={Platform.OS === 'ios' ? 0.5 : 0.8}
        />
        {/* Progress ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={t.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text className="text-[24px] font-extrabold text-primary">{percent}%</Text>
      <Text className="mt-0.5 text-[10px] text-text-secondary">
        {i18n_t('components.progressRing.complete')}
      </Text>
    </View>
  );
}
