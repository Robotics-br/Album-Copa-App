import React, { useCallback, useMemo } from 'react';
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
  onLongPress: (sticker: Sticker) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StickerCard({ sticker, flag, onLongPress }: StickerCardProps) {
  const t = useTheme();
  const qty = useCollectionStore((s) => s.collection[sticker.code] ?? 0);
  const toggleSticker = useCollectionStore((s) => s.toggleSticker);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    const currentQty = useCollectionStore.getState().collection[sticker.code] ?? 0;
    const wasOwned = currentQty > 0;
    toggleSticker(sticker.code);

    if (wasOwned) {
      if (soundEnabled) playStickerRemovedSound();
      errorNotification();
      scale.value = withSequence(
        withTiming(0.92, { duration: 80 }),
        withTiming(1, { duration: 150 })
      );
    } else {
      if (soundEnabled) playStickerCollectedSound();
      successNotification();
      scale.value = withSequence(
        withTiming(1.15, { duration: 100 }),
        withTiming(0.95, { duration: 80 }),
        withTiming(1, { duration: 120 })
      );
    }
  }, [sticker.code, toggleSticker, scale, soundEnabled]);

  const handleLongPress = useCallback(() => {
    lightTap();
    onLongPress(sticker);
  }, [sticker, onLongPress]);

  const bgColor =
    status === 'owned'
      ? `${t.owned}30`
      : status === 'duplicate'
        ? `${t.duplicate}30`
        : t.additionalSurface;

  const borderColor =
    status === 'owned' ? `${t.owned}80` : status === 'duplicate' ? t.gold : t.border;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
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
          <View className="bg-duplicate rounded-full px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-white">×{qty}</Text>
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
