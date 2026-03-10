import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { totalStickers, stickers } from '../data/teams';
import ProgressBar from './ui/ProgressBar';

function SummaryCard() {
  const t = useTheme();
  const collection = useCollectionStore((s) => s.collection);

  const ownedCount = useMemo(
    () => stickers.filter((s) => (collection[s.code] ?? 0) > 0).length,
    [collection]
  );
  const pct = Math.round((ownedCount / totalStickers) * 100);

  return (
    <View className="border-border mx-3 mt-2 rounded-xl border bg-surface p-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-text text-[14px] font-bold uppercase tracking-widest">SEU ÁLBUM</Text>
        <View className="flex-1">
          <ProgressBar percent={pct} height={8} />
        </View>
        <Text className="text-[15px] font-extrabold text-gold">{pct}%</Text>
        <Text className="text-[11px] font-semibold italic text-accent">{100 - pct}% faltando</Text>
      </View>
    </View>
  );
}

export default React.memo(SummaryCard);
