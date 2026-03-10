import React, { useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getTeamById } from '../data/teams';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import type { Sticker } from '../types';

interface StickerCardProps {
  sticker: Sticker;
  onLongPress: (sticker: Sticker) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function StickerCard({ sticker, onLongPress }: StickerCardProps) {
  const t = useTheme();
  const { getQuantity, toggleSticker } = useCollectionStore();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const qty = getQuantity(sticker.id);
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';
  const team = getTeamById(sticker.teamId);

  const scale = useSharedValue(1);
  const brightness = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: brightness.value,
  }));

  const handlePress = useCallback(() => {
    const wasOwned = getQuantity(sticker.id) > 0;
    toggleSticker(sticker.id);

    if (wasOwned) {
      if (soundEnabled) playStickerRemovedSound();
      errorNotification();
      scale.value = withSequence(
        withTiming(1.08, { duration: 80 }),
        withTiming(0.95, { duration: 100 }),
        withSpring(1, { damping: 12 })
      );
      brightness.value = withSequence(
        withTiming(0.7, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
    } else {
      if (soundEnabled) playStickerCollectedSound();
      successNotification();
      scale.value = withSequence(
        withTiming(1.35, { duration: 100 }),
        withTiming(0.9, { duration: 120 }),
        withSpring(1, { damping: 8, stiffness: 200 })
      );
      brightness.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [sticker.id, getQuantity, toggleSticker, scale, brightness, soundEnabled]);

  const handleLongPress = useCallback(() => {
    lightTap();
    onLongPress(sticker);
  }, [sticker, onLongPress]);

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
        <Text style={{ fontSize: 14 }}>{team?.flag}</Text>
        {status !== 'missing' && <Star size={12} fill="#FFD700" color="#FFD700" />}
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
        <Text style={{ fontSize: 8, fontWeight: '700', color: t.gold }}>
          #{String(sticker.id).padStart(3, '0')}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
