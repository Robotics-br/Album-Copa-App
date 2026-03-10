import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { teams, stickers, totalStickers, getStickersByTeam } from '../../src/data/teams';
import ProgressRing from '../../src/components/ui/ProgressRing';
import ProgressBar from '../../src/components/ui/ProgressBar';

export default function StatsScreen() {
  const t = useTheme();
  const collection = useCollectionStore((s) => s.collection);

  const stats = useMemo(() => {
    const owned = stickers.filter((s) => (collection[s.code] ?? 0) > 0).length;
    const totalDuplicates = Object.values(collection).reduce(
      (sum, q) => sum + Math.max(0, q - 1),
      0
    );
    const pct = Math.round((owned / totalStickers) * 100);

    const teamStats = teams.map((team) => {
      const teamStickers = getStickersByTeam(team.id);
      const teamOwned = teamStickers.filter((s) => (collection[s.code] ?? 0) > 0).length;
      const teamPct = Math.round((teamOwned / teamStickers.length) * 100);
      return { team, owned: teamOwned, total: teamStickers.length, pct: teamPct };
    });

    teamStats.sort((a, b) => b.pct - a.pct);

    return { owned, totalDuplicates, pct, teamStats };
  }, [collection]);

  return (
    <SafeAreaView className="bg-bg flex-1" edges={['top']}>
      <View className="px-3 py-2">
        <Text className="text-[14px] font-bold uppercase text-gold">MEU PROGRESSO</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="items-center py-4">
          <ProgressRing percent={stats.pct} />
        </View>

        <View className="flex-row gap-2.5">
          {[
            { label: 'Figurinhas', value: stats.owned },
            { label: 'Faltam', value: totalStickers - stats.owned },
            { label: 'Repetidas', value: stats.totalDuplicates },
          ].map(({ label, value }) => (
            <View
              key={label}
              className="border-border flex-1 items-center rounded-xl border bg-surface p-4">
              <Text className="text-[24px] font-extrabold text-gold">{value}</Text>
              <Text className="text-text-secondary mt-0.5 text-[11px]">{label}</Text>
            </View>
          ))}
        </View>

        <View className="border-border rounded-2xl border bg-surface p-4">
          <Text className="text-text mb-4 text-[15px] font-semibold">Progresso por Seleção</Text>
          {stats.teamStats.map(({ team, owned, total, pct }) => (
            <View key={team.id} className="mb-3.5">
              <View className="mb-1.5 flex-row items-center gap-2">
                <Text className="text-[18px]">{team.flag}</Text>
                <Text className="text-text flex-1 text-[13px] font-medium">{team.name}</Text>
                <Text className="text-text-secondary text-[11px] font-semibold">
                  {owned}/{total}
                </Text>
              </View>
              <ProgressBar percent={pct} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
