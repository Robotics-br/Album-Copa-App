import React, { useState, useMemo, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { AppText as Text } from '../../src/components/ui/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useAlbumFiltersStore } from '../../src/store/useAlbumFiltersStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { stickers as allStickers } from '../../src/data/teams';
import MainHeader from '../../src/components/MainHeader';
import StickerModal from '../../src/components/StickerModal';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';
import MainList from '../../src/components/MainList';
import type { Sticker } from '../../src/types';

const COLUMNS = 5;
const GAP = 6;

function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase();
}

export default function AlbumScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const t = useTheme();

  const itemWidth = useMemo(() => {
    return Math.floor((windowWidth - HORIZONTAL_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);
  }, [windowWidth]);

  const isHydrated = useCollectionStore((s) => s._hasHydrated);
  const collection = useCollectionStore((s) => s.collection);
  const toggleSticker = useCollectionStore((s) => s.toggleSticker);
  const { t: i18n_t } = useTranslation();

  const { soundEnabled, animationsEnabled } = useSettingsStore();
  const { stickerFilter, currentTeam, setTeam, searchQuery, setSearchQuery } =
    useAlbumFiltersStore();
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  const getQty = useCallback((code: string) => collection[code] ?? 0, [collection]);

  const insets = useSafeAreaInsets();

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

  const onSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setTeam(null);
    }
  };

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-primary opacity-50">{i18n_t('common.loading') ?? '...'}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="py-2">
        <Text className="text-[18px] font-bold uppercase text-primary">
          {i18n_t('album.title')}
        </Text>
        <Text className="text-[13px] text-text-secondary">{i18n_t('album.subtitle')}</Text>
      </View>

      <MainHeader searchQuery={searchQuery} setSearchQuery={onSearch} />

      <MainList
        filteredStickers={filtered}
        currentTeam={currentTeam}
        itemWidth={itemWidth}
        animationsEnabled={animationsEnabled}
        soundEnabled={soundEnabled}
        toggleSticker={toggleSticker}
        setSelectedSticker={setSelectedSticker}
        t={t}
        i18n_t={i18n_t}
        stickerFilter={stickerFilter}
        searchQuery={searchQuery}
      />

      <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
    </View>
  );
}
