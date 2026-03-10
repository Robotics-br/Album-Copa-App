import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
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

  return (
    <View className="mx-3 mt-2 rounded-xl border border-border bg-surface p-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-[14px] font-bold uppercase tracking-widest text-text">
          {i18n_t('summary.title')}
        </Text>
        <View className="flex-1">
          <ProgressBar percent={pct} height={8} />
        </View>
        <Text className="text-[15px] font-extrabold text-gold">{pct}%</Text>
        <Text className="text-[11px] font-semibold italic text-accent">
          {i18n_t('summary.missing', { percent: 100 - pct })}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(SummaryCard);
