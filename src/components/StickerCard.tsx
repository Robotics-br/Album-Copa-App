import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
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
import { hexToRgba } from '../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StarExplosion } from './ui/StarExplosion';
import { useTranslation } from 'react-i18next';
import type { Sticker } from '../types';

interface StickerCardProps {
  sticker: Sticker;
  flag: string;
  onPress: (sticker: Sticker) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StickerCard({ sticker, flag, onPress }: StickerCardProps) {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const qty = useCollectionStore((s) => s.collection[sticker.code] ?? 0);
  const toggleSticker = useCollectionStore((s) => s.toggleSticker);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const prevQty = useRef(qty);
  const justTapped = useRef(false);
  const [explosionTrigger, setExplosionTrigger] = React.useState(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    zIndex: zIndex.value,
  }));

  useEffect(() => {
    if (qty > prevQty.current) {
      if (!justTapped.current) {
        if (soundEnabled) playStickerCollectedSound();
        successNotification();
        zIndex.value = 100;
        
        // Shake animation
        rotation.value = withSequence(
          withTiming(-8, { duration: 100 }),
          withTiming(8, { duration: 100 }),
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );

        scale.value = withSequence(
          withTiming(2.0, { duration: 300 }),
          withTiming(0.95, { duration: 200 }),
          withTiming(1, { duration: 250 }, () => {
            zIndex.value = withTiming(0, { duration: 0 });
          })
        );
        setExplosionTrigger((prev) => prev + 1);
      }
    } else if (qty < prevQty.current) {
      if (soundEnabled) playStickerRemovedSound();
      errorNotification();
      zIndex.value = 100;
      scale.value = withSequence(
        withTiming(0.92, { duration: 80 }),
        withTiming(1, { duration: 150 }, () => {
          zIndex.value = withTiming(0, { duration: 0 });
        })
      );
    }
    prevQty.current = qty;
    justTapped.current = false;
  }, [qty, soundEnabled, scale, zIndex, rotation]);

  const handlePress = useCallback(() => {
    const currentQty = useCollectionStore.getState().collection[sticker.code] ?? 0;
    const isOwned = currentQty > 0;

    if (!isOwned) {
      justTapped.current = true;
      if (useSettingsStore.getState().soundEnabled) playStickerCollectedSound();
      successNotification();
      zIndex.value = 100;

      // Shake animation
      rotation.value = withSequence(
        withTiming(-8, { duration: 100 }),
        withTiming(8, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      scale.value = withSequence(
        withTiming(2.0, { duration: 300 }),
        withTiming(0.95, { duration: 200 }),
        withTiming(1, { duration: 250 }, () => {
          zIndex.value = withTiming(0, { duration: 0 });
        })
      );
      setExplosionTrigger((prev) => prev + 1);

      toggleSticker(sticker.code);
    } else {
      lightTap();
      onPress(sticker);
    }
  }, [sticker, toggleSticker, onPress, scale, rotation, zIndex]);

  const bgColor = 'transparent';

  const borderColor =
    status === 'owned' ? `${t.owned}80` : status === 'duplicate' ? t.gold : t.border;

  const gradientBaseColor =
    status === 'owned' ? t.owned : status === 'duplicate' ? t.duplicate : t.textSecondary;
  const gradientColors: readonly [string, string, ...string[]] = [
    hexToRgba(gradientBaseColor, 0.22),
    hexToRgba(gradientBaseColor, 0.08),
  ];

  const gradientStart = { x: 0.1, y: 0 };
  const gradientEnd = { x: 0.9, y: 1 };

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="h-[80px] items-center justify-between overflow-hidden rounded-lg border-[1.5px] p-1.5"
      style={[
        animatedStyle,
        {
          borderColor,
          backgroundColor: bgColor,
        },
      ]}>
      {/* Remove overflow hidden wrapper if needed, but the wrapper is safe inside animated pressable */}
      <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 6, overflow: 'hidden' }}>
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      </View>

      <StarExplosion 
        trigger={explosionTrigger} 
        colors={[t.gold, t.owned, t.accent]} 
      />

      <View className="w-full flex-row items-center justify-between z-10">
        <Text className="text-[14px]">{flag}</Text>
        {status !== 'missing' && <Text className="text-[10px] text-gold">★</Text>}
        {qty > 1 && (
          <View className="rounded-full bg-duplicate px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-white">+{qty - 1}</Text>
          </View>
        )}
      </View>

      <View className="w-full items-center z-10">
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
    </AnimatedPressable>
  );
}

export default React.memo(StickerCard);
