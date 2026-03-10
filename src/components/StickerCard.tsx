import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import type { Sticker, Team } from '../types';

interface StickerCardProps {
  sticker: Sticker;
  flag: string;
  onPress: (sticker: Sticker) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StickerCard({ sticker, flag, onPress }: StickerCardProps) {
  const t = useTheme();
  const qty = useCollectionStore((s) => s.collection[sticker.code] ?? 0);
  const toggleSticker = useCollectionStore((s) => s.toggleSticker);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const scale = useSharedValue(1);
  const prevQty = useRef(qty);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (qty > prevQty.current) {
      if (soundEnabled) playStickerCollectedSound();
      successNotification();
      scale.value = withSequence(
        withTiming(1.15, { duration: 100 }),
        withTiming(0.95, { duration: 80 }),
        withTiming(1, { duration: 120 })
      );
    } else if (qty < prevQty.current) {
      if (soundEnabled) playStickerRemovedSound();
      errorNotification();
      scale.value = withSequence(
        withTiming(0.92, { duration: 80 }),
        withTiming(1, { duration: 150 })
      );
    }
    prevQty.current = qty;
  }, [qty, soundEnabled, scale]);

  const handlePress = useCallback(() => {
    const currentQty = useCollectionStore.getState().collection[sticker.code] ?? 0;
    const isOwned = currentQty > 0;

    if (!isOwned) {
      toggleSticker(sticker.code);
    } else {
      lightTap();
      onPress(sticker); // Abre o modal
    }
  }, [sticker, toggleSticker, onPress]);

  const bgColor =
    status === 'owned'
      ? `${t.owned}30`
      : status === 'duplicate'
        ? `${t.duplicate}30`
        : t.surfaceLight;

  const borderColor =
    status === 'owned' ? `${t.owned}80` : status === 'duplicate' ? t.gold : t.border;

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="h-[80px] items-center justify-between rounded-lg border-[1.5px] p-1.5"
      style={[
        animatedStyle,
        {
          borderColor,
          backgroundColor: bgColor,
        },
      ]}>
      <View className="w-full flex-row items-center justify-between">
        <Text className="text-[14px]">{flag}</Text>
        {status !== 'missing' && <Text className="text-[10px] text-gold">★</Text>}
        {qty > 1 && (
          <View className="rounded-full bg-duplicate px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-white">+{qty - 1}</Text>
          </View>
        )}
      </View>

      <View className="w-full items-center">
        <Text
          numberOfLines={1}
          style={{ color: status === 'missing' ? t.textSecondary : t.text }}
          className="text-center text-[10px] font-semibold">
          {sticker.name}
        </Text>
        <Text className="text-[8px] font-bold text-gold">{sticker.code}</Text>
      </View>
    </AnimatedPressable>
  );
}

export default React.memo(StickerCard);
