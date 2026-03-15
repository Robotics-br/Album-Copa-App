import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useSettingsStore } from '../../store/useSettingsStore';
import { cssInterop } from 'nativewind';

export function AppText({ style, ...props }: TextProps) {
  const seniorMode = useSettingsStore((s) => s.seniorMode);

  if (!seniorMode) {
    return <RNText style={style} {...props} />;
  }

  const scaleFactor = 1.25;

  const scaleStyle = (s: any): any => {
    if (!s) return s;

    // If it's an array or number (StyleSheet ID), flatten it first
    const flattened = StyleSheet.flatten(s);

    const newStyle = { ...flattened };
    if (typeof newStyle.fontSize === 'number') {
      newStyle.fontSize = newStyle.fontSize * scaleFactor;
    }
    if (typeof newStyle.lineHeight === 'number') {
      newStyle.lineHeight = newStyle.lineHeight * scaleFactor;
    }
    return newStyle;
  };

  const scaledStyle = scaleStyle(style);

  return <RNText style={scaledStyle} {...props} />;
}

// Register cssInterop for our custom component so NativeWind
// passes 'className' styles into our 'style' prop.
cssInterop(AppText, {
  className: 'style',
});
