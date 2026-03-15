import React, { useCallback } from 'react';
import { View } from 'react-native';
import { AppText as Text } from './ui/AppText';
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
      className="mr-1.5 min-w-[56px] items-center rounded-xl border-2 px-3 py-2"
      style={{
        borderColor: active ? t.primary : t.border,
        backgroundColor: active ? `${t.primary}18` : t.surfaceLight,
      }}>
      <Text className="text-[22px]">{item.flag}</Text>
      <Text
        style={{ color: active ? t.primary : t.textSecondary }}
        className="text-[10px] font-semibold">
        {item.code}
      </Text>
    </AnimatedPressable>
  );
}

const MemoizedTeamTab = React.memo(TeamTab);

export default function TeamTabs() {
  const renderItem = useCallback(({ item }: { item: Team }) => <MemoizedTeamTab item={item} />, []);

  return (
    <View className="h-18">
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
