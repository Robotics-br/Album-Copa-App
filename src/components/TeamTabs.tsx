import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../theme/ThemeProvider';
import { selectionTap } from '../utils/haptics';
import { teams } from '../data/teams';
import { useAlbumFiltersStore } from '@/store/useAlbumFiltersStore';
import AnimatedPressable from './ui/AnimatedPressable';
import type { Team } from '../types';

function TeamTab({ item }: { item: Team }) {
  const t = useTheme();
  const { currentTeam, setTeam } = useAlbumFiltersStore();
  const active = currentTeam === item.id;

  return (
    <AnimatedPressable
      scaleDown={0.88}
      onPress={() => {
        selectionTap();
        setTeam(active ? null : item.id);
      }}
      style={{
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: active ? t.gold : t.border,
        backgroundColor: active ? `${t.gold}18` : t.surfaceLight,
        minWidth: 56,
      }}>
      <Text style={{ fontSize: 22 }}>{item.flag}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',
          color: active ? t.gold : t.textSecondary,
        }}>
        {item.code}
      </Text>
    </AnimatedPressable>
  );
}

const MemoizedTeamTab = React.memo(TeamTab);

export default function TeamTabs() {
  const renderItem = useCallback(({ item }: { item: Team }) => <MemoizedTeamTab item={item} />, []);

  return (
    <View style={{ height: 64 }}>
      <FlashList
        data={teams}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
