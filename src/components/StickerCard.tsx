import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppText as Text } from './ui/AppText';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { lightTap, successNotification } from '../utils/haptics';
import { playStickerCollectedSound } from '../utils/sounds';
import { hexToRgba } from '../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StarExplosion } from './ui/StarExplosion';
import { useCollectionStore } from '../store/useCollectionStore';
import type { ThemeColors } from '../theme/themes';
import type { Sticker } from '../types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Check, UserRoundPlus } from 'lucide-react-native';
import { ALBUM_STICKER_HEIGHT, ALBUM_STICKER_HEIGHT_SENIOR } from '@/utils/consts';

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
  const seniorModeEnabled = useSettingsStore((s) => s.seniorMode);
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
  }, [qty, sticker.code, scale, rotation, zIndex]);

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

  const borderColor = status === 'missing' ? `${t.missingStickerBorder}CC` : `${t.owned}CC`;

  const acquiredGradientColors: readonly [string, string, ...string[]] = [
    hexToRgba(t.owned, 0.55),
    hexToRgba(t.owned, 0.22),
  ];

  const missingGradientColors: readonly [string, string, ...string[]] = [
    hexToRgba(t.missingStickerBg, 0.8),
    hexToRgba(t.missingStickerBg, 0.4),
  ];

  const gradientStart = { x: 0.0, y: 0 };
  const gradientEnd = { x: 1, y: 1 };

  const gradientColors = status !== 'missing' ? acquiredGradientColors : missingGradientColors;

  const textColor = status === 'missing' ? t.textSecondary : t.ownedStickerTextColor;

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="items-center justify-between rounded-lg p-1.5"
      style={[
        animatedStyle,
        {
          height: seniorModeEnabled ? ALBUM_STICKER_HEIGHT_SENIOR : ALBUM_STICKER_HEIGHT,
          overflow: 'visible',
        },
      ]}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          top: 2,
          bottom: 2,
          left: 2,
          right: 2,
          borderWidth: 1.5,
          borderColor,
          borderStyle: status === 'missing' ? 'dashed' : 'solid',
          borderRadius: 6,
          zIndex: 1,
        }}
      />
      <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 6, overflow: 'hidden' }}>
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      </View>

      <StarExplosion trigger={explosionTrigger} colors={[t.primary, t.owned, t.accent]} />

      <View className="z-10 w-full flex-row items-center justify-between">
        <Text className="text-[14px]">{flag}</Text>
        {qty === 1 && (
          <Text style={{ color: t.ownedStickerTextColor }} className="text-[10px]">
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
          <UserRoundPlus color={t.textSecondary} size={20} />
        ) : (
          <Check color={t.ownedStickerTextColor} size={20} />
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
    </AnimatedPressable>
  );
}

export default React.memo(StickerCard, (prevProps, nextProps) => {
  return (
    prevProps.sticker.code === nextProps.sticker.code &&
    prevProps.soundEnabled === nextProps.soundEnabled &&
    prevProps.t === nextProps.t &&
    prevProps.i18n_t === nextProps.i18n_t
  );
});
