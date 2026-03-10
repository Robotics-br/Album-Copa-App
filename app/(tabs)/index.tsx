import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useAlbumFiltersStore } from '../../src/store/useAlbumFiltersStore';
import { teams, stickers as allStickers, getTeamById, getStickerById } from '../../src/data/teams';
import SummaryCard from '../../src/components/SummaryCard';
import FilterBar from '../../src/components/FilterBar';
import TeamTabs from '../../src/components/TeamTabs';
import StickerCard from '../../src/components/StickerCard';
import StickerModal from '../../src/components/StickerModal';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import type { Sticker } from '../../src/types';

const COLUMNS = 5;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 6;
const ITEM_WIDTH = (SCREEN_WIDTH - 16 - GAP * (COLUMNS - 1)) / COLUMNS;

type TeamHeaderItem = { type: 'team-header'; teamId: string; count: number; owned: number };
type StickerRowItem = { type: 'sticker-row'; stickers: Sticker[] };
type EmptyItem = { type: 'empty' };
type ListItem = TeamHeaderItem | StickerRowItem | EmptyItem;

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

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) return;
    const num = parseInt(q, 10);
    if (!Number.isNaN(num) && num >= 1) {
      const sticker = getStickerById(num);
      if (sticker) setTeam(sticker.teamId);
    } else {
      const lower = q.toLowerCase();
      const team = teams.find(
        (t) => t.name.toLowerCase().startsWith(lower) || t.code.toLowerCase().startsWith(lower)
      );
      if (team) setTeam(team.id);
    }
  }, [searchQuery, setTeam]);

  const getQty = useCallback((id: number) => collection[id] ?? 0, [collection]);

  const filtered = useMemo(() => {
    switch (stickerFilter) {
      case 'missing':
        return allStickers.filter((s) => getQty(s.id) === 0);
      case 'owned':
        return allStickers.filter((s) => getQty(s.id) >= 1);
      case 'duplicates':
        return allStickers.filter((s) => getQty(s.id) > 1);
      default:
        return allStickers;
    }
  }, [stickerFilter, getQty]);

  const listData = useMemo((): ListItem[] => {
    if (currentTeam) {
      const teamStickers = filtered.filter((s) => s.teamId === currentTeam);
      if (teamStickers.length === 0) return [{ type: 'empty' }];
      return chunkArray(teamStickers, COLUMNS).map((row) => ({
        type: 'sticker-row' as const,
        stickers: row,
      }));
    }

    const byTeam = new Map<string, Sticker[]>();
    for (const s of filtered) {
      const list = byTeam.get(s.teamId) ?? [];
      list.push(s);
      byTeam.set(s.teamId, list);
    }

    const items: ListItem[] = [];
    for (const team of teams) {
      const stickers = byTeam.get(team.id);
      if (!stickers?.length) continue;
      const ownedInTeam = stickers.filter((s) => getQty(s.id) > 0).length;
      items.push({
        type: 'team-header',
        teamId: team.id,
        count: stickers.length,
        owned: ownedInTeam,
      });
      const rows = chunkArray(stickers, COLUMNS);
      for (const row of rows) {
        items.push({ type: 'sticker-row', stickers: row });
      }
    }

    if (items.length === 0) return [{ type: 'empty' }];
    return items;
  }, [filtered, currentTeam, getQty]);

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
        const team = getTeamById(item.teamId);
        return (
          <View
            style={{
              marginTop: 4,
              borderTopWidth: 1,
              borderTopColor: t.border,
              paddingTop: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}>
            <Text style={{ fontSize: 15 }}>{team?.flag}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: t.text }}>{team?.name}</Text>
            <Text style={{ marginLeft: 'auto', fontSize: 12, color: t.textSecondary }}>
              {stickerFilter === 'all' ? `${item.owned}/${item.count}` : item.count}
            </Text>
          </View>
        );
      }

      // sticker-row
      return (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 8,
            marginBottom: GAP,
          }}>
          {item.stickers.map((sticker) => (
            <View key={sticker.id} style={{ width: ITEM_WIDTH, marginRight: GAP }}>
              <StickerCard sticker={sticker} onLongPress={setSelectedSticker} />
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
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
          <Search size={18} color={t.gold} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Nº ou nome da seleção"
            placeholderTextColor={t.textSecondary}
            returnKeyType="search"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: t.border,
              backgroundColor: t.surface,
              color: t.text,
              fontSize: 13,
            }}
          />
          <AnimatedPressable
            onPress={handleSearch}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: t.gold,
            }}>
            <Text style={{ fontWeight: '700', fontSize: 13, color: '#0F1923' }}>Buscar</Text>
          </AnimatedPressable>
        </View>
        <TeamTabs />
        <FilterBar />
      </>
    ),
    [t, searchQuery, handleSearch]
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'empty') return 'empty';
    if (item.type === 'team-header') return `header-${item.teamId}`;
    return `row-${item.stickers[0].id}`;
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
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<View style={{ height: 20 }} />}
        showsVerticalScrollIndicator={false}
      />

      <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
    </SafeAreaView>
  );
}
