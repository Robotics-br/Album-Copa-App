import React, { useCallback } from 'react';
import { View } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { useCollectionStore } from '../store/useCollectionStore';
import { sectionMap, getStickersBySection } from '../data/sections';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';

interface SectionHeaderProps {
  sectionId: string;
  totalCount: number;
}

const SectionHeader = ({ sectionId, totalCount }: SectionHeaderProps) => {
  const { t: i18n_t } = useTranslation();

  const ownedCount = useCollectionStore(
    useCallback(
      (s) => {
        const stickers = getStickersBySection(sectionId);
        return stickers.filter((item) => (s.collection[item.code] ?? 0) > 0).length;
      },
      [sectionId]
    )
  );

  const section = sectionMap.get(sectionId);

  return (
    <View
      style={{ paddingHorizontal: HORIZONTAL_PADDING }}
      className="mt-1 flex-row items-center justify-between border-t border-border bg-bg pb-1 pt-1.5">
      <View className="flex-row items-center gap-2">
        <Text className="text-[20px]">{section?.icon}</Text>
        <Text className="text-[13px] font-bold uppercase text-text-secondary">
          {section
            ? i18n_t(
                sectionId === 'special' || sectionId === 'stadiums'
                  ? `sections.${sectionId}`
                  : `teams.${sectionId}`
              )
            : ''}
        </Text>
      </View>
      <View className="rounded-md border border-border bg-surface px-2 py-0.5">
        <Text className="text-[11px] font-extrabold text-primary">
          {ownedCount} / {totalCount}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(SectionHeader);
