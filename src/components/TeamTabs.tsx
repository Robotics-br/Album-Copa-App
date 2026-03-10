import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigationStore } from '../store/useNavigationStore';
import { selectionTap } from '../utils/haptics';
import { teams } from '../data/teams';

export default function TeamTabs() {
  const t = useTheme();
  const { currentTeam, setTeam } = useNavigationStore();

  return (
    <View style={{ height: 64 }}>
      <FlashList
        data={teams}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const active = currentTeam === item.id;
          return (
            <Pressable
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
                borderColor: active ? t.gold : 'transparent',
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
            </Pressable>
          );
        }}
      />
    </View>
  );
}
