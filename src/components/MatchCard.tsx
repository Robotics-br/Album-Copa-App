import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getTeamById } from '../data/teams';
import type { Match } from '../data/matches';

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

export default function MatchCard({ match }: { match: Match }) {
  const t = useTheme();
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);
  if (!home || !away) return null;

  return (
    <View
      style={{
        backgroundColor: t.surface,
        borderWidth: 1,
        borderColor: t.border,
        borderRadius: 12,
        padding: 14,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>
          {home.flag} {home.name}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: t.textSecondary }}>×</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>
          {away.flag} {away.name}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: t.gold, fontStyle: 'italic' }}>
          dia {formatDate(match.date)}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: t.gold }}>às {match.time}</Text>
      </View>
      {match.venue && (
        <Text style={{ fontSize: 11, color: t.textSecondary }}>{match.venue}</Text>
      )}
    </View>
  );
}
