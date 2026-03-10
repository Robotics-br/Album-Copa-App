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
          <View
            style={{
              backgroundColor: t.surface,
              borderWidth: 1,
              borderColor: t.border,
              borderRadius: 12,
              padding: 14,
              margin: PADDING,
            }}>
            <Text style={{ fontSize: 13, color: t.textSecondary, marginBottom: 8 }}>
              <Text style={{ color: t.gold, fontSize: 18, fontWeight: '800' }}>{ownedCount}</Text> /{' '}
              {totalStickers} figurinhas ({pct}%)
            </Text>
            <ProgressBar percent={pct} />
          </View>
        );
      }

      if (item.type === 'team-header') {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingVertical: 8,
              paddingHorizontal: PADDING,
              marginTop: 8,
            }}>
            <Text style={{ fontSize: 20 }}>{item.team.flag}</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: t.text, flex: 1 }}>
              {item.team.name}
            </Text>
            <Text style={{ fontSize: 13, color: t.textSecondary, fontWeight: '500' }}>
              {item.owned}/{item.total}
            </Text>
          </View>
        );
      }

      return (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: PADDING,
            marginBottom: GAP,
          }}>
          {item.stickers.map((sticker) => {
            const qty = collection[sticker.code] ?? 0;
            const owned = qty > 0;
            return (
              <View
                key={sticker.code}
                style={{
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: owned ? t.owned : t.surfaceLight,
                  borderWidth: 1,
                  borderColor: owned ? t.owned : t.border,
                  marginRight: GAP,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 9,
                    fontWeight: '700',
                    color: owned ? '#fff' : t.textSecondary,
                  }}>
                  {sticker.code}
                </Text>
                {qty > 1 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: t.duplicate,
                      paddingHorizontal: 4,
                      borderRadius: 999,
                    }}>
                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#fff' }}>×{qty}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '700', color: t.gold, textTransform: 'uppercase' }}>
          VISÃO GERAL
        </Text>
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
