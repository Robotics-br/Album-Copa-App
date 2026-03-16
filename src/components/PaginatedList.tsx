import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { FlashList } from '@shopify/flash-list';
import { sections, getStickersBySection, sectionMap } from '../data/sections';
import StickerCard from './StickerCard';
import StickerCardLight from './StickerCardLight';
import SectionHeader from './SectionHeader';
import { HORIZONTAL_PADDING } from '../utils/consts';
import type { Sticker } from '../types';

const COLUMNS = 5;
const SECTIONS_PER_PAGE = 4;

type SectionHeaderItem = { type: 'section-header'; sectionId: string; totalCount: number };
type StickerRowItem = { type: 'sticker-row'; stickers: Sticker[] };
type EmptyItem = { type: 'empty' };
type ListItem = SectionHeaderItem | StickerRowItem | EmptyItem;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

interface PaginatedListProps {
  filteredStickers: Sticker[];
  currentSection: string | null;
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
  currentSection,
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
    if (currentSection) {
      const sectionStickers = filteredStickers.filter((s) => s.section === currentSection);
      if (sectionStickers.length === 0) return [{ type: 'empty' }];

      const items: ListItem[] = [
        {
          type: 'section-header',
          sectionId: currentSection,
          totalCount: getStickersBySection(currentSection).length,
        },
      ];

      const rows = chunkArray(sectionStickers, COLUMNS).map((row) => ({
        type: 'sticker-row' as const,
        stickers: row,
      }));

      return [...items, ...rows];
    }

    const bySection = new Map<string, Sticker[]>();
    for (const s of filteredStickers) {
      const list = bySection.get(s.section) ?? [];
      list.push(s);
      bySection.set(s.section, list);
    }

    const availableSections = sections.filter((s) => bySection.has(s.id));
    const totalPages = Math.ceil(availableSections.length / SECTIONS_PER_PAGE);
    const pageIndex = Math.min(currentPage, Math.max(0, totalPages - 1));
    const sectionsInPage = availableSections.slice(
      pageIndex * SECTIONS_PER_PAGE,
      (pageIndex + 1) * SECTIONS_PER_PAGE
    );

    const items: ListItem[] = [];
    for (const section of sectionsInPage) {
      const stickers = bySection.get(section.id);
      if (!stickers) continue;

      items.push({
        type: 'section-header',
        sectionId: section.id,
        totalCount: getStickersBySection(section.id).length,
      });
      const rows = chunkArray(stickers, COLUMNS);
      for (const row of rows) {
        items.push({ type: 'sticker-row', stickers: row });
      }
    }

    if (items.length === 0) return [{ type: 'empty' }];
    return items;
  }, [filteredStickers, currentSection, currentPage]);

  const totalPagesCount = useMemo(() => {
    if (currentSection) return 0;
    const sectionsWithStickers = new Set(filteredStickers.map((s) => s.section));
    const availableSectionsCount = sections.filter((s) => sectionsWithStickers.has(s.id)).length;
    return Math.ceil(availableSectionsCount / SECTIONS_PER_PAGE);
  }, [filteredStickers, currentSection]);

  useEffect(() => {
    setCurrentPage(0);
  }, [stickerFilter, searchQuery, currentSection]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'empty') {
        return (
          <Text className="p-12 text-center text-[13px] text-text-secondary">
            {i18n_t('album.empty')}
          </Text>
        );
      }

      if (item.type === 'section-header') {
        return <SectionHeader sectionId={item.sectionId} totalCount={item.totalCount} />;
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
                  flag={sectionMap.get(sticker.section)?.icon ?? ''}
                  onPress={setSelectedSticker}
                  t={t}
                  i18n_t={i18n_t}
                  toggleSticker={toggleSticker}
                  soundEnabled={soundEnabled}
                />
              ) : (
                <StickerCardLight
                  sticker={sticker}
                  flag={sectionMap.get(sticker.section)?.icon ?? ''}
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
    if (item.type === 'section-header') return `header-${item.sectionId}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <View className="flex-1">
      <View className="flex-1">
        <FlashList
          key={`${stickerFilter}-${currentSection}-${searchQuery === '' ? 'idle' : 'searching'}-${currentPage}`}
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

      {!currentSection && totalPagesCount > 1 && (
        <View
          className="flex-row items-center justify-between pb-4 pt-2"
          style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
          <View
            className={`bg-surface-secondary h-10 items-center justify-center rounded-xl px-6 ${currentPage === 0 ? 'opacity-30' : ''}`}
            onTouchEnd={() => currentPage > 0 && setCurrentPage((p) => p - 1)}>
            <Text className="text-text-primary text-[14px] font-bold">
              {i18n_t('general.previous', 'ANTERIOR')}
            </Text>
          </View>

          <Text className="text-[14px] font-medium text-text-secondary">
            {currentPage + 1} / {totalPagesCount}
          </Text>

          <View
            className={`h-10 items-center justify-center rounded-xl bg-primary px-6 ${currentPage >= totalPagesCount - 1 ? 'opacity-30' : ''}`}
            onTouchEnd={() => currentPage < totalPagesCount - 1 && setCurrentPage((p) => p + 1)}>
            <Text className="text-[14px] font-bold text-black">
              {i18n_t('general.next', 'PRÓXIMO')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
