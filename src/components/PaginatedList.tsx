import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { FlashList } from '@shopify/flash-list';
import { teams, getStickersByTeam, teamMap } from '../data/teams';
import StickerCard from './StickerCard';
import StickerCardLight from './StickerCardLight';
import TeamHeader from './TeamHeader';
import { HORIZONTAL_PADDING } from '../utils/consts';
import type { Sticker } from '../types';

const COLUMNS = 5;
const TEAMS_PER_PAGE = 4;

type TeamHeaderItem = { type: 'team-header'; sectionId: string; totalCount: number };
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

interface PaginatedListProps {
  filteredStickers: Sticker[];
  currentTeam: string | null;
  itemWidth: number;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  toggleSticker: (code: string) => void;
  setSelectedSticker: (sticker: Sticker) => void;
  t: any;
  i18n_t: any;
  stickerFilter: string;
  searchQuery: string;
}

export default function PaginatedList({
  filteredStickers,
  currentTeam,
  itemWidth,
  animationsEnabled,
  soundEnabled,
  toggleSticker,
  setSelectedSticker,
  t,
  i18n_t,
  stickerFilter,
  searchQuery,
}: PaginatedListProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const listData = useMemo((): ListItem[] => {
    if (currentTeam) {
      const teamStickers = filteredStickers.filter((s) => s.section === currentTeam);
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
    for (const s of filteredStickers) {
      const list = byTeam.get(s.section) ?? [];
      list.push(s);
      byTeam.set(s.section, list);
    }

    const availableTeams = teams.filter((t) => byTeam.has(t.id));
    const totalPages = Math.ceil(availableTeams.length / TEAMS_PER_PAGE);
    const pageIndex = Math.min(currentPage, Math.max(0, totalPages - 1));
    const teamsInPage = availableTeams.slice(
      pageIndex * TEAMS_PER_PAGE,
      (pageIndex + 1) * TEAMS_PER_PAGE
    );

    const items: ListItem[] = [];
    for (const team of teamsInPage) {
      const stickers = byTeam.get(team.id);
      if (!stickers) continue;

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
  }, [filteredStickers, currentTeam, currentPage]);

  const totalPages = useMemo(() => {
    if (currentTeam) return 0;
    const teamsWithStickers = new Set(filteredStickers.map((s) => s.section));
    const availableTeamsCount = teams.filter((t) => teamsWithStickers.has(t.id)).length;
    return Math.ceil(availableTeamsCount / TEAMS_PER_PAGE);
  }, [filteredStickers, currentTeam]);

  useEffect(() => {
    setCurrentPage(0);
  }, [stickerFilter, searchQuery, currentTeam]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'empty') {
        return (
          <Text className="p-12 text-center text-[13px] text-text-secondary">
            {i18n_t('album.empty')}
          </Text>
        );
      }

      if (item.type === 'team-header') {
        return <TeamHeader sectionId={item.sectionId} totalCount={item.totalCount} />;
      }

      const phantomCount = COLUMNS - item.stickers.length;

      return (
        <View
          className="mb-1.5 flex-row justify-between"
          style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
          {item.stickers.map((sticker) => (
            <View key={sticker.code} style={{ width: itemWidth }}>
              {animationsEnabled ? (
                <StickerCard
                  sticker={sticker}
                  flag={teamMap.get(sticker.section)?.flag ?? ''}
                  onPress={setSelectedSticker}
                  t={t}
                  i18n_t={i18n_t}
                  toggleSticker={toggleSticker}
                  soundEnabled={soundEnabled}
                />
              ) : (
                <StickerCardLight
                  sticker={sticker}
                  flag={teamMap.get(sticker.section)?.flag ?? ''}
                  onPress={setSelectedSticker}
                  t={t}
                  i18n_t={i18n_t}
                  toggleSticker={toggleSticker}
                  soundEnabled={soundEnabled}
                />
              )}
            </View>
          ))}
          {phantomCount > 0 &&
            Array.from({ length: phantomCount }).map((_, i) => (
              <View key={`phantom-${i}`} style={{ width: itemWidth }} />
            ))}
        </View>
      );
    },
    [setSelectedSticker, itemWidth, i18n_t, toggleSticker, soundEnabled, t, animationsEnabled]
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'empty') return 'empty';
    if (item.type === 'team-header') return `header-${item.sectionId}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <View className="flex-1">
      <View className="flex-1">
        <FlashList
          key={`${stickerFilter}-${currentTeam}-${searchQuery === '' ? 'idle' : 'searching'}-${currentPage}`}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          extraData={animationsEnabled}
          ListFooterComponent={<View className="h-5" />}
          showsVerticalScrollIndicator={false}
          drawDistance={500}
        />
      </View>

      {!currentTeam && totalPages > 1 && (
        <View
          className="flex-row items-center justify-between pb-4 pt-2"
          style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
          <View
            className={`bg-surface-secondary h-10 items-center justify-center rounded-xl px-6 ${currentPage === 0 ? 'opacity-30' : ''}`}
            onTouchEnd={() => currentPage > 0 && setCurrentPage((p) => p - 1)}>
            <Text className="text-text-primary text-[14px] font-bold">ANTERIOR</Text>
          </View>

          <Text className="text-[14px] font-medium text-text-secondary">
            {currentPage + 1} / {totalPages}
          </Text>

          <View
            className={`h-10 items-center justify-center rounded-xl bg-gold px-6 ${currentPage >= totalPages - 1 ? 'opacity-30' : ''}`}
            onTouchEnd={() => currentPage < totalPages - 1 && setCurrentPage((p) => p + 1)}>
            <Text className="text-[14px] font-bold text-black">PRÓXIMO</Text>
          </View>
        </View>
      )}
    </View>
  );
}
