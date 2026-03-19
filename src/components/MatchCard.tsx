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

  const showScore =
    match.isFinished && match.homeScore !== undefined && match.awayScore !== undefined;

  return (
    <View className="gap-1.5 rounded-xl border border-border bg-surface p-3.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <Text className="text-[14px]">{home.flag}</Text>
          <Text
            className="flex-1 text-[14px] font-bold text-text"
            numberOfLines={1}
            ellipsizeMode="tail">
            {i18n_t(`teams.${match.homeTeamId}`)}
          </Text>
        </View>

        <View className="mx-3 flex-row items-center gap-2.5">
          {showScore ? (
            <View className="bg-primary/10 flex-row items-center gap-2 rounded-lg px-2.5 py-0.5">
              <Text className="text-[17px] font-black text-primary">{match.homeScore}</Text>
              <Text className="text-[11px] font-bold text-text-secondary opacity-50">X</Text>
              <Text className="text-[17px] font-black text-primary">{match.awayScore}</Text>
            </View>
          ) : (
            <Text className="text-[13px] font-semibold text-text-secondary">×</Text>
          )}
        </View>

        <View className="flex-1 flex-row items-center justify-end gap-2">
          <Text
            className="flex-1 text-right text-[14px] font-bold text-text"
            numberOfLines={1}
            ellipsizeMode="tail">
            {i18n_t(`teams.${match.awayTeamId}`)}
          </Text>
          <Text className="text-[14px]">{away.flag}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center gap-2.5">
          <Text className="text-[12px] font-semibold italic text-primary">
            {i18n_t('matchCard.day', { date: formatDate(match.date) })}
          </Text>
          <Text className="text-[12px] font-semibold text-primary">
            {i18n_t('matchCard.at', { time: match.time })}
          </Text>
        </View>
        {match.group && (
          <Text className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
            {i18n_t(`matchCard.phases.${match.group}`, { defaultValue: match.group })}
          </Text>
        )}
      </View>
      {match.venue && (
        <Text className="mt-1 text-[11px] text-text-secondary opacity-70">{match.venue}</Text>
      )}
    </View>
  );
}
