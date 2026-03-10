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
    const owned = stickers.filter((s) => (collection[s.id] ?? 0) > 0).length;
    const totalDuplicates = Object.values(collection).reduce(
      (sum, q) => sum + Math.max(0, q - 1),
      0
    );
    const pct = Math.round((owned / totalStickers) * 100);

    const teamStats = teams.map((team) => {
      const teamStickers = getStickersByTeam(team.id);
      const teamOwned = teamStickers.filter((s) => (collection[s.id] ?? 0) > 0).length;
      const teamPct = Math.round((teamOwned / teamStickers.length) * 100);
      return { team, owned: teamOwned, total: teamStickers.length, pct: teamPct };
    });

    teamStats.sort((a, b) => b.pct - a.pct);

    return { owned, totalDuplicates, pct, teamStats };
  }, [collection]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '700', color: t.gold, textTransform: 'uppercase' }}>
          MEU PROGRESSO
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <ProgressRing percent={stats.pct} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Figurinhas', value: stats.owned },
            { label: 'Faltam', value: totalStickers - stats.owned },
            { label: 'Repetidas', value: stats.totalDuplicates },
          ].map(({ label, value }) => (
            <View
              key={label}
              style={{
                flex: 1,
                backgroundColor: t.surface,
                borderWidth: 1,
                borderColor: t.border,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: t.gold }}>{value}</Text>
              <Text style={{ fontSize: 11, color: t.textSecondary, marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 16,
            padding: 16,
          }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: t.text, marginBottom: 16 }}>
            Progresso por Seleção
          </Text>
          {stats.teamStats.map(({ team, owned, total, pct }) => (
            <View key={team.id} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Text style={{ fontSize: 18 }}>{team.flag}</Text>
                <Text style={{ fontSize: 13, fontWeight: '500', color: t.text, flex: 1 }}>
                  {team.name}
                </Text>
                <Text style={{ fontSize: 11, color: t.textSecondary, fontWeight: '600' }}>
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
