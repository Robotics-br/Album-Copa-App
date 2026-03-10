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
      style={[
        animatedStyle,
        {
          height: 80,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: bgColor,
          padding: 6,
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 14 }}>{flag}</Text>
        {status !== 'missing' && <Text style={{ fontSize: 10, color: '#FFD700' }}>★</Text>}
        {qty > 1 && (
          <View
            style={{
              backgroundColor: t.duplicate,
              paddingHorizontal: 6,
              paddingVertical: 1,
              borderRadius: 999,
            }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>×{qty}</Text>
          </View>
        )}
      </View>

      <View style={{ alignItems: 'center', width: '100%' }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            fontWeight: '600',
            color: status === 'missing' ? t.textSecondary : t.text,
            textAlign: 'center',
          }}>
          {sticker.name}
        </Text>
        <Text style={{ fontSize: 8, fontWeight: '700', color: t.gold }}>{sticker.code}</Text>
      </View>
    </AnimatedPressable>
  );
}

export default React.memo(StickerCard);
