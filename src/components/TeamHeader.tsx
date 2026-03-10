import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { teamMap, getStickersByTeam } from '../data/teams';

interface TeamHeaderProps {
  sectionId: string;
  totalCount: number;
}

const TeamHeader = ({ sectionId, totalCount }: TeamHeaderProps) => {
  const t = useTheme();

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
    <View className="border-border bg-bg mt-1 flex-row items-center justify-between border-t px-3 pb-1 pt-1.5">
      <View className="flex-row items-center gap-2">
        <Text className="text-[20px]">{team?.flag}</Text>
        <Text className="text-text-secondary text-[13px] font-bold uppercase">{team?.name}</Text>
      </View>
      <View className="border-border rounded-md border bg-surface-light px-2 py-0.5">
        <Text className="text-[11px] font-extrabold text-gold">
          {ownedCount} / {totalCount}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(TeamHeader);
