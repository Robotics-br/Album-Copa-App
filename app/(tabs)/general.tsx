import React, { useMemo, useCallback } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { teams, stickers, totalStickers, getStickersByTeam } from '../../src/data/teams';
import ProgressBar from '../../src/components/ui/ProgressBar';
import type { Team, Sticker } from '../../src/types';

const COLUMNS = 7;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 6;
const PADDING = 12;
const ITEM_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

type HeaderItem = { type: 'header' };
type TeamHeaderItem = { type: 'team-header'; team: Team; owned: number; total: number };
type StickerRowItem = { type: 'sticker-row'; stickers: Sticker[] };
type ListItem = HeaderItem | TeamHeaderItem | StickerRowItem;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function GeneralScreen() {
  const t = useTheme();
  const collection = useCollectionStore((s) => s.collection);

  const ownedCount = useMemo(
    () => stickers.filter((s) => (collection[s.code] ?? 0) > 0).length,
    [collection]
  );
  const pct = Math.round((ownedCount / totalStickers) * 100);

  const listData = useMemo((): ListItem[] => {
    const items: ListItem[] = [{ type: 'header' }];

    for (const team of teams) {
      const teamStickers = getStickersByTeam(team.id);
      const teamOwned = teamStickers.filter((s) => (collection[s.code] ?? 0) > 0).length;

      items.push({ type: 'team-header', team, owned: teamOwned, total: teamStickers.length });

      const rows = chunkArray(teamStickers, COLUMNS);
      for (const row of rows) {
        items.push({ type: 'sticker-row', stickers: row });
      }
    }

    return items;
  }, [collection]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'header') {
        return (
          <View className="m-3 rounded-xl border border-border bg-surface p-3.5">
            <Text className="mb-2 text-[13px] text-text-secondary">
              <Text className="text-[18px] font-extrabold text-gold">{ownedCount}</Text> /{' '}
              {totalStickers} figurinhas ({pct}%)
            </Text>
            <ProgressBar percent={pct} />
          </View>
        );
      }

      if (item.type === 'team-header') {
        return (
          <View className="mt-2 flex-row items-center gap-2 px-3 py-2">
            <Text className="text-[20px]">{item.team.flag}</Text>
            <Text className="flex-1 text-[15px] font-semibold text-text">{item.team.name}</Text>
            <Text className="text-[13px] font-medium text-text-secondary">
              {item.owned}/{item.total}
            </Text>
          </View>
        );
      }

      return (
        <View className="mb-1.5 flex-row px-3">
          {item.stickers.map((sticker) => {
            const qty = collection[sticker.code] ?? 0;
            const owned = qty > 0;
            return (
              <View
                key={sticker.code}
                className="mr-1.5 items-center justify-center rounded-lg border"
                style={{
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  backgroundColor: owned ? t.owned : t.surfaceLight,
                  borderColor: owned ? t.owned : t.border,
                }}>
                <Text
                  numberOfLines={1}
                  className="text-[9px] font-bold"
                  style={{ color: owned ? '#fff' : t.textSecondary }}>
                  {sticker.code}
                </Text>
                {qty > 1 && (
                  <View className="absolute -right-0.5 -top-0.5 rounded-full bg-duplicate px-1">
                    <Text className="text-[8px] font-bold text-white">+{qty - 1}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      );
    },
    [t, collection, ownedCount, pct]
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'header') return 'header';
    if (item.type === 'team-header') return `th-${item.team.id}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-3 py-2">
        <Text className="text-[14px] font-bold uppercase text-gold">VISÃO GERAL</Text>
      </View>

      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        extraData={collection}
        drawDistance={300}
        ListFooterComponent={<View style={{ height: 20 }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
