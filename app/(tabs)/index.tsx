import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useAlbumFiltersStore } from '../../src/store/useAlbumFiltersStore';
import { teams, stickers as allStickers, getStickersByTeam, teamMap } from '../../src/data/teams';
import SummaryCard from '../../src/components/SummaryCard';
import FilterBar from '../../src/components/FilterBar';
import TeamTabs from '../../src/components/TeamTabs';
import StickerCard from '../../src/components/StickerCard';
import StickerModal from '../../src/components/StickerModal';
import TeamHeader from '../../src/components/TeamHeader';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';

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
  const { stickerFilter, currentTeam, setTeam } = useAlbumFiltersStore();
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      return chunkArray(teamStickers, COLUMNS).map((row) => ({
        type: 'sticker-row' as const,
        stickers: row,
      }));
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
          <Text style={{ textAlign: 'center', padding: 48, color: t.textSecondary, fontSize: 13 }}>
            Nenhuma figurinha nesta categoria
          </Text>
        );
      }

      if (item.type === 'team-header') {
        return <TeamHeader sectionId={item.sectionId} totalCount={item.totalCount} />;
      }

      return (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 8,
            marginBottom: GAP,
          }}>
          {item.stickers.map((sticker) => (
            <View key={sticker.code} style={{ width: ITEM_WIDTH, marginRight: GAP }}>
              <StickerCard
                sticker={sticker}
                flag={teamMap.get(sticker.section)?.flag ?? ''}
                onLongPress={setSelectedSticker}
              />
            </View>
          ))}
        </View>
      );
    },
    [t, stickerFilter, setSelectedSticker]
  );

  const ListHeader = useMemo(
    () => (
      <>
        <SummaryCard />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 12,
            marginVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.surface,
            paddingHorizontal: 12,
          }}>
          <Search size={16} color={t.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Nome do jogador ou código"
            placeholderTextColor={t.textSecondary}
            returnKeyType="search"
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 8,
              color: t.text,
              fontSize: 13,
            }}
          />
          {searchQuery.length > 0 && (
            <AnimatedPressable
              onPress={() => setSearchQuery('')}
              scaleDown={0.8}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: t.surfaceLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <X size={14} color={t.textSecondary} />
            </AnimatedPressable>
          )}
        </View>
        <TeamTabs />
        <FilterBar />
      </>
    ),
    [t, searchQuery]
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'empty') return 'empty';
    if (item.type === 'team-header') return `header-${item.sectionId}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: t.gold,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
          MINHA COPA 2026
        </Text>
      </View>

      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        extraData={collection}
        drawDistance={300}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<View style={{ height: 20 }} />}
        showsVerticalScrollIndicator={false}
      />

      <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
    </SafeAreaView>
  );
}
