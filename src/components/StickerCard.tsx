import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import { hexToRgba } from '../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StarExplosion } from './ui/StarExplosion';
import { useCollectionStore } from '../store/useCollectionStore';
import type { ThemeColors } from '../theme/themes';
import type { Sticker } from '../types';

interface StickerCardProps {
  sticker: Sticker;
  flag: string;
  onPress: (sticker: Sticker) => void;
  t: ThemeColors;
  i18n_t: (key: string, options?: any) => string;
  toggleSticker: (code: string) => void;
  soundEnabled: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StickerCard({
  sticker,
  flag,
  onPress,
  t,
  i18n_t,
  toggleSticker,
  soundEnabled,
}: StickerCardProps) {
  const qty = useCollectionStore((s) => s.collection[sticker.code] ?? 0);
  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const zIndex = useSharedValue(0);

  const prevQty = useRef(qty);
  const justTapped = useRef(false);
  const prevStickerCode = useRef(sticker.code);
  const [explosionTrigger, setExplosionTrigger] = React.useState(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    zIndex: zIndex.value,
  }));

  useEffect(() => {
    if (prevStickerCode.current !== sticker.code) {
      prevStickerCode.current = sticker.code;
      prevQty.current = qty;
      return;
    }

    if (qty > prevQty.current) {
      if (!justTapped.current) {
        if (soundEnabled) playStickerCollectedSound();
        successNotification();
        zIndex.value = 100;

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
  }, [qty, sticker.code, soundEnabled, scale, zIndex, rotation]);

  const handlePress = useCallback(() => {
    const isOwned = qty > 0;

    if (!isOwned) {
      justTapped.current = true;
      if (soundEnabled) playStickerCollectedSound();
      successNotification();
      zIndex.value = 100;

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
  }, [sticker, toggleSticker, onPress, scale, rotation, zIndex, qty, soundEnabled]);

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
      <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 6, overflow: 'hidden' }}>
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      </View>

      <StarExplosion trigger={explosionTrigger} colors={[t.gold, t.owned, t.accent]} />

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
    </AnimatedPressable>
  );
}

export default React.memo(StickerCard, (prevProps, nextProps) => {
  return (
    prevProps.sticker.code === nextProps.sticker.code &&
    prevProps.soundEnabled === nextProps.soundEnabled
  );
});
