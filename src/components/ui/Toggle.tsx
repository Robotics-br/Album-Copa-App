import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export default function Toggle({ value, onValueChange }: ToggleProps) {
  const t = useTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: t.border, true: t.owned }}
      ios_backgroundColor={t.border}
      thumbColor="#fff"
    />
  );
}
