import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useAlbumFiltersStore } from '../../src/store/useAlbumFiltersStore';
import { teams, stickers as allStickers, getStickersByTeam, teamMap } from '../../src/data/teams';
import MainHeader from '../../src/components/MainHeader';
import StickerCard from '../../src/components/StickerCard';
import StickerModal from '../../src/components/StickerModal';
import TeamHeader from '../../src/components/TeamHeader';

import type { Sticker } from '../../src/types';

const COLUMNS = 5;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 6;
const ITEM_WIDTH = (SCREEN_WIDTH - 16 - GAP * (COLUMNS - 1)) / COLUMNS;

type TeamHeaderItem = { type: 'team-header'; sectionId: string; totalCount: number };
type StickerRowItem = { type: 'sticker-row'; stickers: Sticker[] };
type EmptyItem = { type: 'empty' };
type ListItem = TeamHeaderItem | StickerRowItem | EmptyItem;

function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase();
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function AlbumScreen() {
  const t = useTheme();
  const collection = useCollectionStore((s) => s.collection);
  const { stickerFilter, currentTeam } = useAlbumFiltersStore();
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const listRef = useRef<FlashListRef<ListItem>>(null);

  useEffect(() => {
    if (listRef.current && listData && listData.length > 0) {
      listRef.current.scrollToTop({ animated: true });
    }
  }, [stickerFilter]);

  useEffect(() => {
    if (searchQuery === '' && listRef.current && listData && listData.length > 0) {
      listRef.current.scrollToTop({ animated: true });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (listRef.current && listData && listData.length > 0) {
      listRef.current.scrollToTop({ animated: true });
    }
  }, [currentTeam]);

  const getQty = useCallback((code: string) => collection[code] ?? 0, [collection]);

  const filtered = useMemo(() => {
    let result = allStickers;

    switch (stickerFilter) {
      case 'missing':
        result = result.filter((s) => getQty(s.code) === 0);
        break;
      case 'owned':
        result = result.filter((s) => getQty(s.code) >= 1);
        break;
      case 'duplicates':
        result = result.filter((s) => getQty(s.code) > 1);
        break;
    }
    const q = normalize(searchQuery.trim());
    if (q) {
      result = result.filter((s) => {
        return (
          normalize(s.name).includes(q) ||
          s.code.toLowerCase().includes(q) ||
          String(s.albumIndex).includes(q)
        );
      });
    }

    return result;
  }, [stickerFilter, getQty, searchQuery]);

  const listData = useMemo((): ListItem[] => {
    if (currentTeam) {
      const teamStickers = filtered.filter((s) => s.section === currentTeam);
      if (teamStickers.length === 0) return [{ type: 'empty' }];

      const items: ListItem[] = [
        {
          type: 'team-header',
          sectionId: currentTeam,
          totalCount: getStickersByTeam(currentTeam).length,
        },
      ];

      const rows = chunkArray(teamStickers, COLUMNS).map((row) => ({
        type: 'sticker-row' as const,
        stickers: row,
      }));

      return [...items, ...rows];
    }

    const byTeam = new Map<string, Sticker[]>();
    for (const s of filtered) {
      const list = byTeam.get(s.section) ?? [];
      list.push(s);
      byTeam.set(s.section, list);
    }

    const items: ListItem[] = [];
    for (const team of teams) {
      const stickers = byTeam.get(team.id);
      if (!stickers?.length) continue;
      items.push({
        type: 'team-header',
        sectionId: team.id,
        totalCount: getStickersByTeam(team.id).length,
      });
      const rows = chunkArray(stickers, COLUMNS);
      for (const row of rows) {
        items.push({ type: 'sticker-row', stickers: row });
      }
    }

    if (items.length === 0) return [{ type: 'empty' }];
    return items;
  }, [filtered, currentTeam]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'empty') {
        return (
          <Text className="p-12 text-center text-[13px] text-text-secondary">
            Nenhuma figurinha nesta categoria
          </Text>
        );
      }

      if (item.type === 'team-header') {
        return <TeamHeader sectionId={item.sectionId} totalCount={item.totalCount} />;
      }

      return (
        <View className="mb-1.5 flex-row px-2">
          {item.stickers.map((sticker) => (
            <View key={sticker.code} style={{ width: ITEM_WIDTH, marginRight: GAP }}>
              <StickerCard
                sticker={sticker}
                flag={teamMap.get(sticker.section)?.flag ?? ''}
                onPress={setSelectedSticker}
              />
            </View>
          ))}
        </View>
      );
    },
    [t, stickerFilter, setSelectedSticker]
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'empty') return 'empty';
    if (item.type === 'team-header') return `header-${item.sectionId}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-3 py-2">
        <Text className="text-[14px] font-bold uppercase tracking-widest text-gold">
          MINHA COPA 2026
        </Text>
      </View>

      <MainHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <View className="flex-1">
        <FlashList
          ref={listRef}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          extraData={collection}
          drawDistance={300}
          ListFooterComponent={<View className="h-5" />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
    </SafeAreaView>
  );
}
