import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { teamMap, getStickersByTeam } from '../data/teams';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';

interface TeamHeaderProps {
  sectionId: string;
  totalCount: number;
}

const TeamHeader = ({ sectionId, totalCount }: TeamHeaderProps) => {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();

  const ownedCount = useCollectionStore(
    useCallback(
      (s) => {
        const teamStickers = getStickersByTeam(sectionId);
        return teamStickers.filter((item) => (s.collection[item.code] ?? 0) > 0).length;
      },
      [sectionId]
    )
  );

  const team = teamMap.get(sectionId);

  return (
    <View 
      style={{ paddingHorizontal: HORIZONTAL_PADDING }}
      className="mt-1 flex-row items-center justify-between border-t border-border bg-bg pb-1 pt-1.5"
    >
      <View className="flex-row items-center gap-2">
        <Text className="text-[20px]">{team?.flag}</Text>
        <Text className="text-[13px] font-bold uppercase text-text-secondary">
          {team ? i18n_t(`teams.${team.id}`) : ''}
        </Text>
      </View>
      <View className="rounded-md border border-border bg-surface-light px-2 py-0.5">
        <Text className="text-[11px] font-extrabold text-gold">
          {ownedCount} / {totalCount}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(TeamHeader);
