import React, { useMemo, useCallback, memo } from 'react';
import { View } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { FlashList } from '@shopify/flash-list';
import { sections, getStickersBySection, sectionMap } from '../data/sections';
import StickerCard from './StickerCard';
import StickerCardLight from './StickerCardLight';
import SectionHeader from './SectionHeader';
import { HORIZONTAL_PADDING, ALBUM_COLUMNS } from '../utils/consts';
import type { Sticker } from '../types';

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
    const phantomCount = ALBUM_COLUMNS - item.stickers.length;

    return (
      <View
        className="mb-1.5 flex-row justify-between"
        style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
        {item.stickers.map((sticker: Sticker, index: any) => (
          <View key={`slot-${index}`} style={{ width: itemWidth }}>
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
            <View key={`slot-${item.stickers.length + i}`} style={{ width: itemWidth }} />
          ))}
      </View>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.t !== nextProps.t || prevProps.i18n_t !== nextProps.i18n_t) {
      return false;
    }

    if (
      prevProps.animationsEnabled !== nextProps.animationsEnabled ||
      prevProps.soundEnabled !== nextProps.soundEnabled
    ) {
      return false;
    }

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

export default function MainList({
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
}: MainListProps) {
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

      const rows = chunkArray(sectionStickers, ALBUM_COLUMNS).map((row) => ({
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

    const items: ListItem[] = [];
    for (const section of sections) {
      const stickers = bySection.get(section.id);
      if (!stickers?.length) continue;
      items.push({
        type: 'section-header',
        sectionId: section.id,
        totalCount: getStickersBySection(section.id).length,
      });
      const rows = chunkArray(stickers, ALBUM_COLUMNS);
      for (const row of rows) {
        items.push({ type: 'sticker-row', stickers: row });
      }
    }

    if (items.length === 0) return [{ type: 'empty' }];
    return items;
  }, [filteredStickers, currentSection]);

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
    [itemWidth, animationsEnabled, soundEnabled, toggleSticker, setSelectedSticker, t, i18n_t]
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'empty') return 'empty';
    if (item.type === 'section-header') return `header-${item.sectionId}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <View className="flex-1">
      <FlashList
        key={`${stickerFilter}-${currentSection}-${searchQuery === '' ? 'idle' : 'searching'}`}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        extraData={{ animationsEnabled, soundEnabled, t, i18n_t }}
        ListFooterComponent={<View className="h-5" />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
}
