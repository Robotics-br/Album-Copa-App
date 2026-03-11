import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { totalStickers, stickers } from '../data/teams';
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

  const getEvolutionImage = (percent: number) => {
    if (percent <= 10) return require('../../assets/images/album-estagio-01.png');
    if (percent <= 35) return require('../../assets/images/album-estagio-02.png');
    if (percent <= 65) return require('../../assets/images/album-estagio-03.png');
    if (percent <= 90) return require('../../assets/images/album-estagio-04.png');
    return require('../../assets/images/album-estagio-05.png');
  };

  return (
    <View className="mx-3 mt-2 rounded-xl border border-border bg-surface p-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 justify-center gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[14px] font-bold uppercase tracking-widest text-text">
              {i18n_t('summary.title')}
            </Text>
            <Text className="text-[11px] font-semibold italic text-accent">
              {i18n_t('summary.missing', { percent: 100 - pct })}
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
          <Image
            source={getEvolutionImage(pct)}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(SummaryCard);
