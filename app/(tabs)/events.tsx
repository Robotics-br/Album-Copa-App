import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

// Data
import { teams } from '../../src/data/teams';
import {
  matches,
  getUniqueDates,
  getMatchesByTeam,
  getMatchesByDate,
} from '../../src/data/matches';
import { getStadiumsByCountry } from '../../src/data/stadiums';

// Components
import MatchCard from '../../src/components/MatchCard';
import StadiumCard from '../../src/components/StadiumCard';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';

type FilterKind = 'all' | 'team' | 'day';
type GlobalTab = 'games' | 'stadiums';

function formatDateOption(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

export default function EventsScreen() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<GlobalTab>('games');

  // Games State
  const [filterKind, setFilterKind] = useState<FilterKind>('all');
  const [teamId, setTeamId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Stadiums State
  const stadiumGroups = useMemo(() => getStadiumsByCountry(), []);
  const [expandedStadiums, setExpandedStadiums] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(stadiumGroups).map((k) => [k, true]))
  );

  const toggleStadiumGroup = (key: string) => {
    setExpandedStadiums((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Memos
  const uniqueDates = useMemo(() => getUniqueDates(matches), []);
  const filteredMatches = useMemo(() => {
    if (filterKind === 'team' && teamId) return getMatchesByTeam(matches, teamId);
    if (filterKind === 'day' && selectedDate) return getMatchesByDate(matches, selectedDate);
    return matches;
  }, [filterKind, teamId, selectedDate]);

  const filterTabs: { key: FilterKind; label: string }[] = [
    { key: 'all', label: i18n_t('games.filters.all') },
    { key: 'team', label: i18n_t('games.filters.team') },
    { key: 'day', label: i18n_t('games.filters.day') },
  ];

  const renderGames = () => (
    <>
      <View 
        style={{ paddingHorizontal: HORIZONTAL_PADDING }}
        className="mb-2 gap-2.5"
      >
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
          <View className="overflow-hidden rounded-xl border border-border bg-surface">
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

      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="flex-1">
        {filteredMatches.length === 0 ? (
          <Text className="p-6 text-center text-text-secondary">{i18n_t('games.empty')}</Text>
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
    </>
  );

  const renderStadiums = () => (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 12, gap: 12 }}>
      {Object.entries(stadiumGroups).map(([country, stadiumList]) => (
        <View key={country} className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Pressable
            onPress={() => toggleStadiumGroup(country)}
            className="flex-row items-center justify-between p-3.5">
            <Text className="text-[15px] font-bold text-text">{country}</Text>
            <View className="flex-row items-center gap-2">
              <View className="rounded-full border border-border bg-surface-light px-2.5 py-0.5">
                <Text className="text-[11px] font-bold text-gold">{stadiumList.length}</Text>
              </View>
              {expandedStadiums[country] ? (
                <ChevronUp size={18} color={t.textSecondary} />
              ) : (
                <ChevronDown size={18} color={t.textSecondary} />
              )}
            </View>
          </Pressable>

          {expandedStadiums[country] &&
            stadiumList.map((stadium) => <StadiumCard key={stadium.name} stadium={stadium} />)}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="py-2">
        <Text className="text-[18px] font-bold uppercase text-gold">{i18n_t('events.title')}</Text>
        <Text className="text-[13px] text-text-secondary">{i18n_t('events.subtitle')}</Text>
      </View>

      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="mb-3">
        <View className="flex-row items-center rounded-xl border border-border bg-surface-light p-1">
          <AnimatedPressable
            onPress={() => setActiveTab('games')}
            className="flex-1 items-center justify-center rounded-lg py-2"
            style={{ backgroundColor: activeTab === 'games' ? t.gold : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'games' ? '#0F1923' : t.textSecondary }}>
              {i18n_t('events.tabs.games')}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => setActiveTab('stadiums')}
            className="flex-1 items-center justify-center rounded-lg py-2"
            style={{ backgroundColor: activeTab === 'stadiums' ? t.gold : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'stadiums' ? '#0F1923' : t.textSecondary }}>
              {i18n_t('events.tabs.stadiums')}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      {activeTab === 'games' ? renderGames() : renderStadiums()}
    </View>
  );
}
