import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Modal,
  RefreshControl,
  Animated as RNAnimated,
} from 'react-native';
import { AppText as Text } from '../../src/components/ui/AppText';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { ChevronDown, ChevronUp, X, WifiOff } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { Stadium } from '../../src/data/stadiums';

import ScreenHeader from '../../src/components/ScreenHeader';
import { teams } from '../../src/data/teams';
import { Match, getUniqueDates, getMatchesByTeam, getMatchesByDate } from '../../src/data/matches';
import { getStadiumsByCountry } from '../../src/data/stadiums';

import MatchCard from '../../src/components/MatchCard';
import StadiumCard from '../../src/components/StadiumCard';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';

import { fetchWorldCupMatches } from '../../src/services/matchService';

type FilterKind = 'all' | 'team' | 'day';
type GlobalTab = 'games' | 'stadiums';

function formatDateOption(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const [, m, d] = parts;
  return `${d}/${m}`;
}

const LoadingView = () => {
  const { t: i18n_t } = useTranslation();
  const theme = useTheme();

  const pulseAnim = React.useRef(new RNAnimated.Value(1)).current;
  const rotateAnim = React.useRef(new RNAnimated.Value(0)).current;

  React.useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 items-center justify-center p-10">
      <RNAnimated.View
        style={{
          transform: [{ scale: pulseAnim }, { rotate: rotation }],
          backgroundColor: theme.primary + '20',
          padding: 24,
          borderRadius: 40,
        }}
        className="mb-8 items-center justify-center">
        <Image
          source={require('../../assets/images/app-logo.png')}
          style={{ width: 80, height: 80 }}
          contentFit="contain"
        />
      </RNAnimated.View>
      <Text className="mb-2 text-center text-[18px] font-bold text-text">
        {i18n_t('games.loading')}
      </Text>
      <Text className="text-center text-[14px] text-text-secondary opacity-70">
        {i18n_t('common.loading')}
      </Text>
    </View>
  );
};

const ErrorView = ({ onRetry }: { onRetry: () => void }) => {
  const { t: i18n_t } = useTranslation();
  const t = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-10">
      <View
        className="mb-6 items-center justify-center rounded-full p-6"
        style={{ backgroundColor: t.primary + '15' }}>
        <WifiOff size={48} color={t.primary} />
      </View>
      <Text className="mb-6 text-center text-[18px] font-bold text-text">
        {i18n_t('games.error.title')}
      </Text>
      <AnimatedPressable
        onPress={onRetry}
        className="rounded-xl px-10 py-3.5"
        style={{ backgroundColor: t.primary }}>
        <Text className="text-[15px] font-bold" style={{ color: t.onPrimary }}>
          {i18n_t('games.error.retry')}
        </Text>
      </AnimatedPressable>
    </View>
  );
};

export default function EventsScreen() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();

  const [activeTab, setActiveTab] = useState<GlobalTab>('games');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  const [filterKind, setFilterKind] = useState<FilterKind>('all');
  const [teamId, setTeamId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [apiMatches, setApiMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async (isRefetch = false) => {
    if (isRefetch) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const data = await fetchWorldCupMatches();
      if (data && data.length > 0) {
        setApiMatches(data);
      }
    } catch (err) {
      console.warn('Could not load matches from API', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadMatches();
  }, []);

  const onRefresh = React.useCallback(() => {
    loadMatches(true);
  }, []);

  const stadiumGroups = useMemo(() => getStadiumsByCountry(), []);
  const [expandedStadiums, setExpandedStadiums] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(stadiumGroups).map((k) => [k, false]))
  );

  const toggleStadiumGroup = (key: string) => {
    setExpandedStadiums((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const uniqueDates = useMemo(() => getUniqueDates(apiMatches), [apiMatches]);
  const filteredMatches = useMemo(() => {
    if (filterKind === 'team' && teamId) return getMatchesByTeam(apiMatches, teamId);
    if (filterKind === 'day' && selectedDate) return getMatchesByDate(apiMatches, selectedDate);
    return apiMatches;
  }, [filterKind, teamId, selectedDate, apiMatches]);

  const filterTabs: { key: FilterKind; label: string }[] = [
    { key: 'all', label: i18n_t('games.filters.all') },
    { key: 'team', label: i18n_t('games.filters.team') },
    { key: 'day', label: i18n_t('games.filters.day') },
  ];

  const renderGames = () => (
    <>
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="mb-3 mt-3 gap-2.5">
        <View className="flex-row gap-1.5">
          {filterTabs.map(({ key, label }) => {
            const active = filterKind === key;
            return (
              <AnimatedPressable
                key={key}
                onPress={() => setFilterKind(key)}
                className="flex-1 items-center rounded-xl border py-2.5"
                style={{
                  backgroundColor: active ? t.primary : t.surface,
                  borderColor: active ? t.primary : t.border,
                }}>
                <Text
                  className="text-[13px] font-semibold"
                  style={{ color: active ? t.onPrimary : t.textSecondary }}>
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
                    onPress={() => setTeamId(active ? '' : team.id)}
                    className="rounded-lg border px-3 py-1.5"
                    style={{
                      backgroundColor: active ? t.primary : t.surface,
                      borderColor: active ? t.primary : t.border,
                    }}>
                    <Text
                      className="text-[12px] font-semibold"
                      style={{ color: active ? t.onPrimary : t.textSecondary }}>
                      {team.flag} {i18n_t(`teams.${team.id}`)}
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
                  onPress={() => setSelectedDate(active ? '' : date)}
                  className="rounded-lg border px-3.5 py-2"
                  style={{
                    backgroundColor: active ? t.primary : t.surface,
                    borderColor: active ? t.primary : t.border,
                  }}>
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: active ? t.onPrimary : t.textSecondary }}>
                    {formatDateOption(date)}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View className="flex-1">
        {loading ? (
          <LoadingView />
        ) : error ? (
          <ErrorView onRetry={() => loadMatches()} />
        ) : filteredMatches.length === 0 ? (
          <Text className="p-6 text-center text-text-secondary">{i18n_t('games.empty')}</Text>
        ) : (
          <FlashList<Match>
            key={`${teamId}-${selectedDate}`}
            data={filteredMatches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MatchCard match={item} />}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerStyle={{
              paddingHorizontal: HORIZONTAL_PADDING,
              paddingBottom: 40,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={t.primary}
                colors={[t.primary]}
                progressBackgroundColor={t.surface}
              />
            }
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
              <View className="rounded-full border border-border bg-surface px-2.5 py-0.5">
                <Text className="text-[11px] font-bold text-primary">{stadiumList.length}</Text>
              </View>
              {expandedStadiums[country] ? (
                <ChevronUp size={18} color={t.textSecondary} />
              ) : (
                <ChevronDown size={18} color={t.textSecondary} />
              )}
            </View>
          </Pressable>

          {expandedStadiums[country] &&
            stadiumList.map((stadium) => (
              <StadiumCard
                key={stadium.id}
                stadium={stadium}
                onImagePress={(s) => setSelectedStadium(s)}
              />
            ))}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader titleKey="events.title" />

      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="mt-3">
        <View className="flex-row items-center rounded-xl border border-border bg-surface p-1">
          <AnimatedPressable
            onPress={() => setActiveTab('games')}
            className="flex-1 items-center justify-center rounded-lg py-2"
            style={{ backgroundColor: activeTab === 'games' ? t.primary : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'games' ? t.onPrimary : t.textSecondary }}>
              {i18n_t('events.tabs.games')}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => setActiveTab('stadiums')}
            className="flex-1 items-center justify-center rounded-lg py-2"
            style={{ backgroundColor: activeTab === 'stadiums' ? t.primary : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'stadiums' ? t.onPrimary : t.textSecondary }}>
              {i18n_t('events.tabs.stadiums')}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      {activeTab === 'games' ? renderGames() : renderStadiums()}

      <Modal
        visible={!!selectedStadium}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedStadium(null)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
          onPress={() => setSelectedStadium(null)}
          className="items-center justify-center p-4">
          {selectedStadium && (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              className="w-full shadow-2xl">
              <View className="absolute right-0 top-[-50] z-50">
                <X color="white" size={32} />
              </View>

              <View className="items-center overflow-hidden rounded-2xl bg-[#1A1A1A]">
                {selectedStadium && (
                  <Image
                    source={selectedStadium.image}
                    style={{ width: '100%', aspectRatio: 4 / 3 }}
                    contentFit="cover"
                    priority="high"
                    cachePolicy="disk"
                    transition={200}
                    recyclingKey={selectedStadium.id}
                  />
                )}
              </View>

              <View className="mt-4 items-center">
                <Text className="text-center text-[18px] font-bold text-white">
                  {i18n_t(`stadiums.data.${selectedStadium.id}.name`, {
                    defaultValue: selectedStadium.name,
                  })}
                </Text>
                <Text className="text-center text-[14px] text-gray-400">
                  {selectedStadium.city}, {selectedStadium.country}
                </Text>
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
