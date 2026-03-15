import React from 'react';
import { ScrollView } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { selectionTap } from '../utils/haptics';
import type { StickerFilter } from '../types';
import { useAlbumFiltersStore } from '@/store/useAlbumFiltersStore';
import AnimatedPressable from './ui/AnimatedPressable';
import { useTranslation } from 'react-i18next';

const filters: { key: StickerFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'filters.all' },
  { key: 'missing', labelKey: 'filters.missing' },
  { key: 'owned', labelKey: 'filters.owned' },
  { key: 'duplicates', labelKey: 'filters.duplicates' },
];

export default function FilterBar() {
  const { t: i18n_t } = useTranslation();
  const { stickerFilter, setFilter } = useAlbumFiltersStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 6 }}>
      {filters.map(({ key, labelKey }) => {
        const active = stickerFilter === key;
        return (
          <AnimatedPressable
            key={key}
            onPress={() => {
              selectionTap();
              setFilter(key);
            }}
            className={`rounded-full border px-3.5 py-1.5 ${
              active ? 'border-primary bg-primary' : 'border-border bg-surface-light'
            }`}>
            <Text
              className={`text-[13px] ${
                active ? 'font-bold text-[#0F1923]' : 'font-medium text-text-secondary'
              }`}>
              {i18n_t(labelKey)}
            </Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}
