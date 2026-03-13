import React, { useMemo, useCallback, memo } from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { teams, getStickersByTeam, teamMap } from '../data/teams';
import StickerCard from './StickerCard';
import StickerCardLight from './StickerCardLight';
import TeamHeader from './TeamHeader';
import { HORIZONTAL_PADDING } from '../utils/consts';
import type { Sticker } from '../types';

const COLUMNS = 5;

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

// eslint-disable-next-line react/display-name
const StickerRow = memo(
  ({
    item,
    itemWidth,
    animationsEnabled,
    soundEnabled,
    toggleSticker,
    setSelectedSticker,
    t,
    i18n_t,
  }: any) => {
    const phantomCount = COLUMNS - item.stickers.length;

    return (
      <View
        className="mb-1.5 flex-row justify-between"
        style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
        {item.stickers.map((sticker: Sticker, index: any) => (
          <View key={`slot-${index}`} style={{ width: itemWidth }}>
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
            <View key={`slot-${item.stickers.length + i}`} style={{ width: itemWidth }} />
          ))}
      </View>
    );
  },
  (prevProps, nextProps) => {
    const prevStickers = prevProps.item.stickers;
    const nextStickers = nextProps.item.stickers;

    if (prevStickers.length !== nextStickers.length) return false;

    for (let i = 0; i < prevStickers.length; i++) {
      if (prevStickers[i].code !== nextStickers[i].code) {
        return false;
      }
    }

    return true;
  }
);

interface MainListProps {
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

export default function MainList({
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
}: MainListProps) {
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
  }, [filteredStickers, currentTeam]);

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

      return (
        <StickerRow
          item={item}
          itemWidth={itemWidth}
          animationsEnabled={animationsEnabled}
          soundEnabled={soundEnabled}
          toggleSticker={toggleSticker}
          setSelectedSticker={setSelectedSticker}
          t={t}
          i18n_t={i18n_t}
        />
      );
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSelectedSticker, itemWidth, toggleSticker, soundEnabled, animationsEnabled]
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'empty') return 'empty';
    if (item.type === 'team-header') return `header-${item.sectionId}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <View className="flex-1">
      <FlashList
        key={`${stickerFilter}-${currentTeam}-${searchQuery === '' ? 'idle' : 'searching'}`}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        extraData={animationsEnabled}
        ListFooterComponent={<View className="h-5" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
