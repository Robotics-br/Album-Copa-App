import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { selectionTap } from '../utils/haptics';
import type { StickerFilter } from '../types';
import { useAlbumFiltersStore } from '@/store/useAlbumFiltersStore';
import AnimatedPressable from './ui/AnimatedPressable';

const filters: { key: StickerFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'missing', label: 'Faltam' },
  { key: 'owned', label: 'Tenho' },
  { key: 'duplicates', label: 'Repetidas' },
];

export default function FilterBar() {
  const t = useTheme();
  const { stickerFilter, setFilter } = useAlbumFiltersStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 6 }}>
      {filters.map(({ key, label }) => {
        const active = stickerFilter === key;
        return (
          <AnimatedPressable
            key={key}
            onPress={() => {
              selectionTap();
              setFilter(key);
            }}
            className={`rounded-full border px-3.5 py-1.5 ${
              active ? 'border-gold bg-gold' : 'border-border bg-surface-light'
            }`}>
            <Text
              className={`text-[13px] ${
                active ? 'font-bold text-[#0F1923]' : 'font-medium text-text-secondary'
              }`}>
              {label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}
