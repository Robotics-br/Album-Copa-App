import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { teams, stickers, totalStickers, getStickersByTeam } from '../../src/data/teams';
import ProgressBar from '../../src/components/ui/ProgressBar';

export default function GeneralScreen() {
  const t = useTheme();
  const collection = useCollectionStore((s) => s.collection);

  const ownedCount = useMemo(
    () => stickers.filter((s) => (collection[s.id] ?? 0) > 0).length,
    [collection],
  );
  const pct = Math.round((ownedCount / totalStickers) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: t.gold, textTransform: 'uppercase' }}>
          VISÃO GERAL
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <Text style={{ fontSize: 13, color: t.textSecondary, marginBottom: 8 }}>
            <Text style={{ color: t.gold, fontSize: 18, fontWeight: '800' }}>{ownedCount}</Text> / {totalStickers} figurinhas ({pct}%)
          </Text>
          <ProgressBar percent={pct} />
        </View>

        {teams.map((team) => {
          const teamStickers = getStickersByTeam(team.id);
          const teamOwned = teamStickers.filter((s) => (collection[s.id] ?? 0) > 0).length;

          return (
            <View key={team.id} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 }}>
                <Text style={{ fontSize: 20 }}>{team.flag}</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: t.text, flex: 1 }}>{team.name}</Text>
                <Text style={{ fontSize: 13, color: t.textSecondary, fontWeight: '500' }}>
                  {teamOwned}/{teamStickers.length}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {teamStickers.map((sticker) => {
                  const qty = collection[sticker.id] ?? 0;
                  const owned = qty > 0;
                  return (
                    <View
                      key={sticker.id}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: owned ? t.owned : t.surfaceLight,
                        borderWidth: 1,
                        borderColor: owned ? t.owned : t.border,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: owned ? '#fff' : t.textSecondary }}>
                        {sticker.id}
                      </Text>
                      {qty > 1 && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            backgroundColor: t.duplicate,
                            paddingHorizontal: 4,
                            borderRadius: 999,
                          }}
                        >
                          <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>×{qty}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
