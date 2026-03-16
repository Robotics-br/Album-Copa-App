import React, { useMemo, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { AppText as Text } from '../../src/components/ui/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { sections, stickers, totalStickers, getStickersBySection } from '../../src/data/sections';
import ProgressBar from '../../src/components/ui/ProgressBar';
import { useTranslation, Trans } from 'react-i18next';
import type { Section, Sticker } from '../../src/types';
import ScreenHeader from '../../src/components/ScreenHeader';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';

const COLUMNS = 7;
const GAP = 6;

type HeaderItem = { type: 'header' };
type SectionHeaderItem = { type: 'section-header'; section: Section; owned: number; total: number };
type StickerRowItem = { type: 'sticker-row'; stickers: Sticker[] };
type ListItem = HeaderItem | SectionHeaderItem | StickerRowItem;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function GeneralScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const itemSize = useMemo(() => {
    return Math.floor((windowWidth - HORIZONTAL_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);
  }, [windowWidth]);

  const { t: i18n_t } = useTranslation();
  const collection = useCollectionStore((s) => s.collection);

  const ownedCount = useMemo(
    () => stickers.filter((s) => (collection[s.code] ?? 0) > 0).length,
    [collection]
  );
  const pct = Math.round((ownedCount / totalStickers) * 100);

  const listData = useMemo((): ListItem[] => {
    const items: ListItem[] = [{ type: 'header' }];

    for (const section of sections) {
      const sectionStickers = getStickersBySection(section.id);
      const sectionOwned = sectionStickers.filter((s) => (collection[s.code] ?? 0) > 0).length;

      items.push({
        type: 'section-header',
        section,
        owned: sectionOwned,
        total: sectionStickers.length,
      });

      const rows = chunkArray(sectionStickers, COLUMNS);
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
            style={{ marginHorizontal: HORIZONTAL_PADDING }}
            className="mt-3 rounded-xl border border-border bg-surface p-3.5">
            <Text className="mb-2 text-[13px] text-text-secondary">
              <Trans
                i18nKey="general.summary"
                values={{ ownedCount, totalStickers, pct }}
                components={{ 1: <Text className="text-[18px] font-extrabold text-primary" /> }}
              />
            </Text>
            <ProgressBar percent={pct} />
          </View>
        );
      }

      if (item.type === 'section-header') {
        const isSpecial = item.section.id === 'special' || item.section.id === 'stadiums';
        const nameKey = isSpecial ? `sections.${item.section.id}` : `teams.${item.section.id}`;
        return (
          <View
            style={{ paddingHorizontal: HORIZONTAL_PADDING }}
            className="mt-2 flex-row items-center gap-2 py-2">
            <Text className="text-[20px]">{item.section.icon}</Text>
            <Text className="flex-1 text-[15px] font-semibold text-text">{i18n_t(nameKey)}</Text>
            <Text className="text-[13px] font-medium text-text-secondary">
              {item.owned}/{item.total}
            </Text>
          </View>
        );
      }

      return (
        <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="mb-1.5 flex-row">
          {item.stickers.map((sticker) => {
            const qty = collection[sticker.code] ?? 0;
            const owned = qty > 0;
            return (
              <View
                key={sticker.code}
                className="mr-1.5 items-center justify-center rounded-lg border"
                style={{
                  width: itemSize,
                  height: itemSize,
                  backgroundColor: owned ? t.owned : t.missingStickerBg,
                  borderColor: owned ? t.owned : t.missingStickerBg,
                }}>
                <Text
                  numberOfLines={1}
                  className="text-[9px] font-bold"
                  style={{ color: owned ? '#fff' : t.textSecondary }}>
                  {sticker.code}
                </Text>
                {qty > 1 && (
                  <View className="absolute -right-0.5 -top-0.5 rounded-full bg-duplicate px-1">
                    <Text className="text-[8px] font-bold text-on-duplicate">+{qty - 1}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, collection, ownedCount, pct, i18n_t, itemSize]
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'header') return 'header';
    if (item.type === 'section-header') return `sh-${item.section.id}`;
    return `row-${item.stickers[0].code}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScreenHeader titleKey="general.title" />

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
    </View>
  );
}
