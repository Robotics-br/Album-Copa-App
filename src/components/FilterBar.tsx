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
            style={{
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor: active ? t.gold : t.additionalSurface,
              borderWidth: 1,
              borderColor: active ? t.gold : t.border,
            }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: active ? '700' : '500',
                color: active ? '#0F1923' : t.textSecondary,
              }}>
              {label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}
