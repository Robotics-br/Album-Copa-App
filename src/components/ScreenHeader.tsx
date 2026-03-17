import React from 'react';
import { View, Image } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { hexToRgba } from '../utils/colors';

interface ScreenHeaderProps {
  titleKey: string;
}

export default function ScreenHeader({ titleKey }: ScreenHeaderProps) {
  const { t: i18n_t } = useTranslation();
  const insets = useSafeAreaInsets();
  const t = useTheme();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: t.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(t.border, 0.3),
      }}>
      <View
        style={{ paddingHorizontal: HORIZONTAL_PADDING }}
        className="flex-row items-center justify-between py-2">
        <Image
          source={require('../../assets/images/app-logo.png')}
          style={{ width: 34, height: 34, borderRadius: 10 }}
          resizeMode="cover"
        />
        <View className="ml-3 flex-1">
          <Text
            style={{ color: t.onHeader }}
            className="text-[20px] font-black uppercase tracking-tighter">
            {i18n_t(titleKey)}
          </Text>
        </View>
      </View>
    </View>
  );
}
