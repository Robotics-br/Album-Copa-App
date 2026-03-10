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

  // Subscribes only to stickers of THIS section for nuclear performance
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
      style={{
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: t.border,
        paddingTop: 6,
        paddingHorizontal: 12,
        paddingBottom: 4,
        backgroundColor: t.bg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 20 }}>{team?.flag}</Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: t.textSecondary,
            textTransform: 'uppercase',
          }}>
          {team?.name}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: t.surfaceLight,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: t.border,
        }}>
        <Text style={{ fontSize: 11, fontWeight: '800', color: t.gold }}>
          {ownedCount} / {totalCount}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(TeamHeader);
