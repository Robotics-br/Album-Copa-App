import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import { useCollectionStore } from '../store/useCollectionStore';
import type { ThemeColors } from '../theme/themes';
import type { Sticker } from '../types';

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
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';
  const prevQty = useRef(qty);

  useEffect(() => {
    if (qty < prevQty.current) {
      if (soundEnabled) playStickerRemovedSound();
      errorNotification();
    }
    prevQty.current = qty;
  }, [qty, soundEnabled]);

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

  const borderColor =
    status === 'owned' ? t.owned : status === 'duplicate' ? t.gold : t.border;

  const bgClass =
    status === 'owned'
      ? 'bg-owned/15'
      : status === 'duplicate'
        ? 'bg-gold/15'
        : 'bg-surface';

  return (
    <Pressable
      onPress={handlePress}
      className={`h-[80px] items-center justify-between overflow-hidden rounded-lg border-[1.5px] p-1.5 ${bgClass}`}
      style={{ borderColor }}>
      <View className="z-10 w-full flex-row items-center justify-between">
        <Text className="text-[14px]">{flag}</Text>
        {status !== 'missing' && <Text className="text-[10px] text-gold">★</Text>}
        {qty > 1 && (
          <View className="rounded-full bg-duplicate px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-white">+{qty - 1}</Text>
          </View>
        )}
      </View>

      <View className="z-10 w-full items-center">
        <Text
          numberOfLines={1}
          style={{ color: status === 'missing' ? t.textSecondary : t.text }}
          className="text-center text-[10px] font-semibold">
          {sticker.name.startsWith('Escudo ')
            ? `${i18n_t('stickers.badge')} ${i18n_t(`teams.${sticker.section}`)}`
            : sticker.name.startsWith('Seleção ')
              ? `${i18n_t('stickers.team')} ${i18n_t(`teams.${sticker.section}`)}`
              : sticker.name}
        </Text>
        <Text className="text-[8px] font-bold text-gold">{sticker.code}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(StickerCardLight);
