import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../src/theme/ThemeProvider';
import { teams } from '../../src/data/teams';
import { matches, getUniqueDates, getMatchesByTeam, getMatchesByDate } from '../../src/data/matches';
import MatchCard from '../../src/components/MatchCard';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: t.gold, textTransform: 'uppercase' }}>
          Todos os jogos
        </Text>
        <Text style={{ fontSize: 13, color: t.textSecondary }}>Copa do Mundo FIFA 2026</Text>
      </View>

      <View style={{ paddingHorizontal: 12, gap: 10, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {filterTabs.map(({ key, label }) => {
            const active = filterKind === key;
            return (
              <Pressable
                key={key}
                onPress={() => setFilterKind(key)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: active ? t.gold : t.surfaceLight,
                  borderWidth: 1,
                  borderColor: active ? t.gold : t.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#0F1923' : t.textSecondary }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filterKind === 'team' && (
          <View style={{ borderRadius: 12, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface, overflow: 'hidden' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 8, gap: 6 }}>
              {teams.map((team) => {
                const active = teamId === team.id;
                return (
                  <Pressable
                    key={team.id}
                    onPress={() => setTeamId(team.id)}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: active ? t.gold : t.surfaceLight,
                      borderWidth: 1,
                      borderColor: active ? t.gold : t.border,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '600', color: active ? '#0F1923' : t.text }}>
                      {team.flag} {team.code}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {filterKind === 'day' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {uniqueDates.map((date) => {
              const active = selectedDate === date;
              return (
                <Pressable
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                    backgroundColor: active ? t.gold : t.surfaceLight,
                    borderWidth: 1,
                    borderColor: active ? t.gold : t.border,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: active ? '#0F1923' : t.text }}>
                    {formatDateOption(date)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        {filteredMatches.length === 0 ? (
          <Text style={{ textAlign: 'center', padding: 24, color: t.textSecondary }}>
            Nenhum jogo encontrado
          </Text>
        ) : (
          <FlashList
            data={filteredMatches}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => <MatchCard match={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
