import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { AppText as Text } from '../../src/components/ui/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { sections, stickers, totalStickers, getStickersBySection } from '../../src/data/sections';
import ProgressRing from '../../src/components/ui/ProgressRing';
import ProgressBar from '../../src/components/ui/ProgressBar';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../src/components/ScreenHeader';

export default function StatsScreen() {
  const { t: i18n_t } = useTranslation();
  const collection = useCollectionStore((s) => s.collection);
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => {
    const owned = stickers.filter((s) => (collection[s.code] ?? 0) > 0).length;
    const totalDuplicates = Object.values(collection).reduce(
      (sum, q) => sum + Math.max(0, q - 1),
      0
    );
    const pct = Math.round((owned / totalStickers) * 100);

    const sectionStats = sections.map((section) => {
      const sectionStickers = getStickersBySection(section.id);
      const sectionOwned = sectionStickers.filter((s) => (collection[s.code] ?? 0) > 0).length;
      const sectionPct = Math.round((sectionOwned / sectionStickers.length) * 100);
      return { section, owned: sectionOwned, total: sectionStickers.length, pct: sectionPct };
    });

    sectionStats.sort((a, b) => {
      const isASpecial = a.section.id === 'special' || a.section.id === 'stadiums';
      const isBSpecial = b.section.id === 'special' || b.section.id === 'stadiums';

      if (isASpecial && !isBSpecial) return -1;
      if (!isASpecial && isBSpecial) return 1;

      return (b.pct || 0) - (a.pct || 0);
    });

    return { owned, totalDuplicates, pct, sectionStats };
  }, [collection]);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScreenHeader titleKey="stats.title" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="items-center py-2">
          <ProgressRing percent={stats.pct} size={110} />
        </View>

        <View className="flex-row gap-2.5">
          {[
            { label: i18n_t('stats.stickers'), value: stats.owned },
            { label: i18n_t('stats.missing'), value: totalStickers - stats.owned },
            { label: i18n_t('stats.repeated'), value: stats.totalDuplicates },
          ].map(({ label, value }) => (
            <View
              key={label}
              className="flex-1 items-center rounded-xl border border-border bg-surface py-2.5">
              <Text className="text-[20px] font-extrabold text-primary">{value}</Text>
              <Text className="mt-0.5 text-[10px] text-text-secondary">{label}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-2xl border border-border bg-surface p-4">
          <Text className="mb-4 text-[15px] font-semibold text-text">
            {i18n_t('stats.progressBySection')}
          </Text>
          {stats.sectionStats.map(({ section, owned, total, pct }) => {
            const isSpecial = section.id === 'special' || section.id === 'stadiums';
            const nameKey = isSpecial ? `sections.${section.id}` : `teams.${section.id}`;
            return (
              <View key={section.id} className="mb-3.5">
                <View className="mb-1.5 flex-row items-center gap-2">
                  <Text className="text-[18px]">{section.icon}</Text>
                  <Text className="flex-1 text-[13px] font-medium text-text">
                    {i18n_t(nameKey)}
                  </Text>
                  <Text className="text-[11px] font-semibold text-text-secondary">
                    {owned}/{total}
                  </Text>
                </View>
                <ProgressBar percent={pct} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
