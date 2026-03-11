import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Image, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { totalStickers, stickers } from '../data/teams';
import { playStickerCollectedSound } from '../utils/sounds';
import { StarExplosion } from './ui/StarExplosion';
import ProgressBar from './ui/ProgressBar';
import { useTranslation } from 'react-i18next';

function SummaryCard() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const collection = useCollectionStore((s) => s.collection);

  const ownedCount = useMemo(
    () => stickers.filter((s) => (collection[s.code] ?? 0) > 0).length,
    [collection]
  );
  const pct = Math.round((ownedCount / totalStickers) * 100);
  const missingCount = totalStickers - ownedCount;

  const getEvolutionImage = (percent: number) => {
    if (percent < 10) return require('../../assets/images/album-estagio-01.png');
    if (percent < 35) return require('../../assets/images/album-estagio-02.png');
    if (percent < 65) return require('../../assets/images/album-estagio-03.png');
    if (percent < 90) return require('../../assets/images/album-estagio-04.png');
    return require('../../assets/images/album-estagio-05.png');
  };

  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [explosionTrigger, setExplosionTrigger] = useState(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handlePress = useCallback(() => {
    setShowEasterEgg(true);
    scale.value = 0;
    rotation.value = 0;
  }, [scale, rotation]);

  const triggerStars = useCallback(() => {
    setExplosionTrigger((prev) => prev + 1);
  }, []);

  const handleModalShow = useCallback(() => {
    if (useSettingsStore.getState().soundEnabled) playStickerCollectedSound();

    scale.value = 0;
    rotation.value = 0;

    scale.value = withSequence(
      withTiming(3.0, { duration: 400 }, (finished) => {
        if (finished) runOnJS(triggerStars)();
      }),
      withTiming(2.5, { duration: 300 }),
      withTiming(2.8, { duration: 1300 })
    );

    rotation.value = withSequence(
      withTiming(-12, { duration: 100 }),
      withTiming(12, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-8, { duration: 100 }),
      withTiming(8, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    setTimeout(() => {
      setShowEasterEgg(false);
      setExplosionTrigger(0);
    }, 2000);
  }, [scale, rotation, triggerStars]);

  const animatedEasterEggStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="mx-3 mt-2 rounded-xl border border-border bg-surface p-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 justify-center gap-1.5">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="shrink-0 text-[14px] font-bold uppercase tracking-widest text-text">
              {i18n_t('summary.title')}
            </Text>
            <Text
              className="flex-1 flex-wrap text-right text-[11px] font-semibold italic text-accent"
              numberOfLines={2}>
              {i18n_t('summary.missing', { count: missingCount })}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <ProgressBar percent={pct} height={8} />
            </View>
            <Text className="min-w-[36px] text-right text-[14px] font-extrabold text-gold">
              {pct}%
            </Text>
          </View>
        </View>

        <View className="ml-1 justify-center border-l border-border pl-3">
          <Pressable onPress={handlePress}>
            <Image
              source={getEvolutionImage(pct)}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      <Modal transparent visible={showEasterEgg} animationType="fade" onShow={handleModalShow}>
        <View className="absolute inset-0 z-[9999] items-center justify-center bg-black/65">
          <Animated.Image
            source={getEvolutionImage(pct)}
            style={animatedEasterEggStyle}
            className="h-[120px] w-[120px]"
            resizeMode="contain"
          />
          <StarExplosion
            trigger={explosionTrigger}
            colors={[t.gold, t.owned, t.accent]}
            radius={350}
          />
        </View>
      </Modal>
    </View>
  );
}

export default React.memo(SummaryCard);
