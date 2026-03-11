import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { lightTap, successNotification } from '../utils/haptics';
import { playStickerCollectedSound } from '../utils/sounds';
import { hexToRgba } from '../utils/colors';
import type { ThemeColors } from '../theme/themes';
import type { Sticker } from '../types';

interface StickerCardLightProps {
  sticker: Sticker;
  flag: string;
  onPress: (sticker: Sticker) => void;
  t: ThemeColors;
  i18n_t: (key: string, options?: any) => string;
  qty: number;
  toggleSticker: (code: string) => void;
  soundEnabled: boolean;
}

const StickerCardLight = ({
  sticker,
  flag,
  onPress,
  t,
  i18n_t,
  qty,
  toggleSticker,
  soundEnabled,
}: StickerCardLightProps) => {
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const handlePress = useCallback(() => {
    if (qty === 0) {
      if (soundEnabled) playStickerCollectedSound();
      successNotification();
      toggleSticker(sticker.code);
    } else {
      lightTap();
      onPress(sticker);
    }
  }, [sticker.code, qty, toggleSticker, onPress, soundEnabled]);

  const backgroundColor =
    status === 'owned'
      ? hexToRgba(t.owned, 0.15)
      : status === 'duplicate'
        ? hexToRgba(t.gold, 0.15)
        : t.surface;

  const borderColor =
    status === 'owned' ? t.owned : status === 'duplicate' ? t.gold : t.border;

  return (
    <Pressable
      onPress={handlePress}
      style={{
        height: 80,
        backgroundColor,
        borderColor,
        borderWidth: 1.5,
        borderRadius: 8,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 14 }}>{flag}</Text>
        {status !== 'missing' && <Text style={{ fontSize: 10, color: t.gold }}>★</Text>}
        {qty > 1 && (
          <View
            style={{
              backgroundColor: t.duplicate,
              borderRadius: 10,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>+{qty - 1}</Text>
          </View>
        )}
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text
          numberOfLines={1}
          style={{
            color: status === 'missing' ? t.textSecondary : t.text,
            fontSize: 10,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {sticker.name.startsWith('Escudo ')
            ? `${i18n_t('stickers.badge')} ${i18n_t(`teams.${sticker.section}`)}`
            : sticker.name.startsWith('Seleção ')
              ? `${i18n_t('stickers.team')} ${i18n_t(`teams.${sticker.section}`)}`
              : sticker.name}
        </Text>
        <Text style={{ color: t.gold, fontSize: 8, fontWeight: 'bold' }}>{sticker.code}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(StickerCardLight);
