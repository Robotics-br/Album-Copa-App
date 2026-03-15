import React from 'react';
import { View } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { getTeamById } from '../data/teams';
import type { Match } from '../data/matches';
import { useTranslation } from 'react-i18next';

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

export default function MatchCard({ match }: { match: Match }) {
  const { t: i18n_t } = useTranslation();
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);
  if (!home || !away) return null;

  return (
    <View className="gap-1.5 rounded-xl border border-border bg-surface p-3.5">
      <View className="flex-row flex-wrap items-center gap-2">
        <Text className="text-[15px] font-bold text-text">
          {home.flag} {i18n_t(`teams.${match.homeTeamId}`)}
        </Text>
        <Text className="text-[13px] font-semibold text-text-secondary">×</Text>
        <Text className="text-[15px] font-bold text-text">
          {away.flag} {i18n_t(`teams.${match.awayTeamId}`)}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-primary text-[13px] font-semibold italic">
          {i18n_t('matchCard.day', { date: formatDate(match.date) })}
        </Text>
        <Text className="text-primary text-[13px] font-semibold">
          {i18n_t('matchCard.at', { time: match.time })}
        </Text>
      </View>
      {match.venue && <Text className="text-[11px] text-text-secondary">{match.venue}</Text>}
    </View>
  );
}
