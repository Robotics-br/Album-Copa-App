import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../src/theme/ThemeProvider';
import { teams } from '../../src/data/teams';
import {
  matches,
  getUniqueDates,
  getMatchesByTeam,
  getMatchesByDate,
} from '../../src/data/matches';
import MatchCard from '../../src/components/MatchCard';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';

type FilterKind = 'all' | 'team' | 'day';

function formatDateOption(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

export default function GamesScreen() {
  const t = useTheme();
  const [filterKind, setFilterKind] = useState<FilterKind>('all');
  const [teamId, setTeamId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const uniqueDates = useMemo(() => getUniqueDates(matches), []);

  const filteredMatches = useMemo(() => {
    if (filterKind === 'team' && teamId) return getMatchesByTeam(matches, teamId);
    if (filterKind === 'day' && selectedDate) return getMatchesByDate(matches, selectedDate);
    return matches;
  }, [filterKind, teamId, selectedDate]);

  const filterTabs: { key: FilterKind; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'team', label: 'Seleção' },
    { key: 'day', label: 'Dia' },
  ];

  return (
    <SafeAreaView className="bg-bg flex-1" edges={['top']}>
      <View className="px-3 py-2">
        <Text className="text-[18px] font-bold uppercase text-gold">Todos os jogos</Text>
        <Text className="text-text-secondary text-[13px]">Copa do Mundo FIFA 2026</Text>
      </View>

      <View className="mb-2 gap-2.5 px-3">
        <View className="flex-row gap-1.5">
          {filterTabs.map(({ key, label }) => {
            const active = filterKind === key;
            return (
              <AnimatedPressable
                key={key}
                onPress={() => setFilterKind(key)}
                className="flex-1 items-center rounded-xl border py-2.5"
                style={{
                  backgroundColor: active ? t.gold : t.surfaceLight,
                  borderColor: active ? t.gold : t.border,
                }}>
                <Text
                  className="text-[13px] font-semibold"
                  style={{ color: active ? '#0F1923' : t.textSecondary }}>
                  {label}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        {filterKind === 'team' && (
          <View className="border-border overflow-hidden rounded-xl border bg-surface">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 8, gap: 6 }}>
              {teams.map((team) => {
                const active = teamId === team.id;
                return (
                  <AnimatedPressable
                    key={team.id}
                    onPress={() => setTeamId(team.id)}
                    className="rounded-lg border px-3 py-1.5"
                    style={{
                      backgroundColor: active ? t.gold : t.surfaceLight,
                      borderColor: active ? t.gold : t.border,
                    }}>
                    <Text
                      className="text-[12px] font-semibold"
                      style={{ color: active ? '#0F1923' : t.text }}>
                      {team.flag} {team.code}
                    </Text>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {filterKind === 'day' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}>
            {uniqueDates.map((date) => {
              const active = selectedDate === date;
              return (
                <AnimatedPressable
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  className="rounded-lg border px-3.5 py-2"
                  style={{
                    backgroundColor: active ? t.gold : t.surfaceLight,
                    borderColor: active ? t.gold : t.border,
                  }}>
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: active ? '#0F1923' : t.text }}>
                    {formatDateOption(date)}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View className="flex-1 px-3">
        {filteredMatches.length === 0 ? (
          <Text className="text-text-secondary p-6 text-center">Nenhum jogo encontrado</Text>
        ) : (
          <FlashList
            data={filteredMatches}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item }) => <MatchCard match={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
