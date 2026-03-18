import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import { useCollectionStore } from '../store/useCollectionStore';
import type { ThemeColors } from '../theme/themes';
import type { Sticker } from '../types';
import { ALBUM_STICKER_HEIGHT, ALBUM_STICKER_HEIGHT_SENIOR } from '@/utils/consts';
import { useSettingsStore } from '@/store/useSettingsStore';

interface StickerCardLightProps {
  sticker: Sticker;
  flag: string;
  onPress: (sticker: Sticker) => void;
  t: ThemeColors;
  i18n_t: (key: string, options?: any) => string;
  toggleSticker: (code: string) => void;
  soundEnabled: boolean;
}

const StickerCardLight = ({
  sticker,
  flag,
  onPress,
  t,
  i18n_t,
  toggleSticker,
  soundEnabled,
}: StickerCardLightProps) => {
  const qty = useCollectionStore((s) => s.collection[sticker.code] ?? 0);
  const seniorModeEnabled = useSettingsStore((s) => s.seniorMode);

  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const prevQty = useRef(qty);
  const prevStickerCode = useRef(sticker.code);

  useEffect(() => {
    if (prevStickerCode.current !== sticker.code) {
      prevStickerCode.current = sticker.code;
      prevQty.current = qty;
      return;
    }

    if (qty < prevQty.current) {
      if (soundEnabled) playStickerRemovedSound();
      errorNotification();
    }
    prevQty.current = qty;
  }, [qty, sticker.code, soundEnabled]);

  const handlePress = useCallback(() => {
    const isOwned = qty > 0;

    if (!isOwned) {
      if (soundEnabled) playStickerCollectedSound();
      successNotification();
      toggleSticker(sticker.code);
    } else {
      lightTap();
      onPress(sticker);
    }
  }, [sticker, qty, toggleSticker, onPress, soundEnabled]);

  const borderColor = status === 'missing' ? `${t.missingStickerBorder}80` : `${t.owned}80`;
  const backgroundColor = status === 'missing' ? `${t.missingStickerBg}` : `${t.owned}80`;
  const textColor = status === 'missing' ? t.textSecondary : t.ownedStickerTextColor;

  return (
    <Pressable
      onPress={handlePress}
      className="items-center justify-between rounded-lg p-1.5"
      style={{
        height: seniorModeEnabled ? ALBUM_STICKER_HEIGHT_SENIOR : ALBUM_STICKER_HEIGHT,
        backgroundColor: backgroundColor,
        overflow: 'visible',
      }}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          top: 2,
          bottom: 2,
          left: 2,
          right: 2,
          borderWidth: 1.5,
          borderColor: borderColor,
          borderStyle: status === 'missing' ? 'dashed' : 'solid',
          borderRadius: 6,
          zIndex: 0,
        }}
      />
      <View className="z-10 w-full flex-row items-center justify-between">
        <Text className="text-[14px]">{flag}</Text>
        {qty === 1 && (
          <Text style={{ color: '#f2cd27' }} className="text-[13px]">
            ★
          </Text>
        )}
        {qty > 1 && (
          <Text style={{ color: t.ownedStickerTextColor }} className="text-[11px] font-black">
            +{qty - 1}
          </Text>
        )}
      </View>

      <View className="absolute inset-0 z-0 items-center justify-center pb-2">
        {status === 'missing' ? (
          <Text style={{ color: t.textSecondary }} className="text-[28px]">
            +
          </Text>
        ) : (
          <Text style={{ color: t.ownedStickerTextColor }} className="text-[20px]">
            ✓
          </Text>
        )}
      </View>

      <View className="z-10 w-full items-center">
        <Text
          numberOfLines={1}
          style={{ color: textColor }}
          className="text-center text-[10px] font-semibold">
          {sticker.name === 'badge'
            ? `${i18n_t('stickers.badge')} ${i18n_t(`teams.${sticker.section}`)}`
            : sticker.name === 'team'
              ? `${i18n_t('stickers.team')} ${i18n_t(`teams.${sticker.section}`)}`
              : i18n_t(sticker.name)}
        </Text>
        <Text style={{ color: textColor }} className="text-[8px] font-bold">
          {sticker.code}
        </Text>
      </View>
    </Pressable>
  );
};

export default React.memo(StickerCardLight, (prevProps, nextProps) => {
  return (
    prevProps.sticker.code === nextProps.sticker.code &&
    prevProps.soundEnabled === nextProps.soundEnabled &&
    prevProps.t === nextProps.t &&
    prevProps.i18n_t === nextProps.i18n_t
  );
});
