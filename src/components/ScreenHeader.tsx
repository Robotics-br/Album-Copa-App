import React from 'react';
import { View, Image } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';

interface ScreenHeaderProps {
  titleKey: string;
}

export default function ScreenHeader({ titleKey }: ScreenHeaderProps) {
  const { t: i18n_t } = useTranslation();

  return (
    <View
      style={{ paddingHorizontal: HORIZONTAL_PADDING }}
      className="flex-row items-center justify-between py-2.5">
      <Image
        source={require('../../assets/images/app-logo.png')}
        style={{ width: 32, height: 32, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View className="ml-3 flex-1">
        <Text className="text-[18px] font-extrabold uppercase tracking-tight text-primary">
          {i18n_t(titleKey)}
        </Text>
      </View>
    </View>
  );
}
