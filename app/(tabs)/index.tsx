import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useNavigationStore } from '../../src/store/useNavigationStore';
import { teams, stickers as allStickers, getTeamById, getStickerById } from '../../src/data/teams';
import SummaryCard from '../../src/components/SummaryCard';
import FilterBar from '../../src/components/FilterBar';
import TeamTabs from '../../src/components/TeamTabs';
import StickerGrid from '../../src/components/StickerGrid';
import StickerModal from '../../src/components/StickerModal';
import type { Sticker } from '../../src/types';

export default function AlbumScreen() {
  const t = useTheme();
  const { getQuantity } = useCollectionStore();
  const { stickerFilter, currentTeam, setTeam } = useNavigationStore();
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) return;
    const num = parseInt(q, 10);
    if (!Number.isNaN(num) && num >= 1) {
      const sticker = getStickerById(num);
      if (sticker) setTeam(sticker.teamId);
    } else {
      const lower = q.toLowerCase();
      const team = teams.find(
        (t) => t.name.toLowerCase().startsWith(lower) || t.code.toLowerCase().startsWith(lower),
      );
      if (team) setTeam(team.id);
    }
  }, [searchQuery, setTeam]);

  const filtered = useMemo(() => {
    switch (stickerFilter) {
      case 'missing':
        return allStickers.filter((s) => getQuantity(s.id) === 0);
      case 'owned':
        return allStickers.filter((s) => getQuantity(s.id) >= 1);
      case 'duplicates':
        return allStickers.filter((s) => getQuantity(s.id) > 1);
      default:
        return allStickers;
    }
  }, [stickerFilter, getQuantity]);

  const groupedByTeam = useMemo(() => {
    const byTeam = new Map<string, Sticker[]>();
    for (const s of filtered) {
      const list = byTeam.get(s.teamId) ?? [];
      list.push(s);
      byTeam.set(s.teamId, list);
    }
    return teams
      .filter((t) => byTeam.get(t.id)?.length)
      .map((t) => ({ teamId: t.id, stickers: byTeam.get(t.id)! }));
  }, [filtered]);

  const selectedTeamStickers = useMemo(() => {
    if (!currentTeam) return null;
    return filtered.filter((s) => s.teamId === currentTeam);
  }, [filtered, currentTeam]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: t.gold, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          MINHA COPA 2026
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <SummaryCard />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
          <Search size={18} color={t.gold} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Nº ou nome da seleção"
            placeholderTextColor={t.textSecondary}
            returnKeyType="search"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: t.border,
              backgroundColor: t.surface,
              color: t.text,
              fontSize: 13,
            }}
          />
          <Pressable
            onPress={handleSearch}
            style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: t.gold }}
          >
            <Text style={{ fontWeight: '700', fontSize: 13, color: '#0F1923' }}>Buscar</Text>
          </Pressable>
        </View>

        <TeamTabs />
        <FilterBar />

        {currentTeam && selectedTeamStickers ? (
          selectedTeamStickers.length === 0 ? (
            <Text style={{ textAlign: 'center', padding: 48, color: t.textSecondary, fontSize: 13 }}>
              Nenhuma figurinha nesta categoria
            </Text>
          ) : (
            <StickerGrid stickers={selectedTeamStickers} onLongPress={setSelectedSticker} />
          )
        ) : filtered.length === 0 ? (
          <Text style={{ textAlign: 'center', padding: 48, color: t.textSecondary, fontSize: 13 }}>
            Nenhuma figurinha nesta categoria
          </Text>
        ) : (
          groupedByTeam.map(({ teamId, stickers }) => {
            const team = getTeamById(teamId);
            const ownedInTeam = stickers.filter((s) => getQuantity(s.id) > 0).length;
            return (
              <View key={teamId} style={{ marginTop: 4, borderTopWidth: 1, borderTopColor: t.border, paddingTop: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ fontSize: 15 }}>{team?.flag}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: t.text }}>{team?.name}</Text>
                  <Text style={{ marginLeft: 'auto', fontSize: 12, color: t.textSecondary }}>
                    {stickerFilter === 'all' ? `${ownedInTeam}/${stickers.length}` : stickers.length}
                  </Text>
                </View>
                <StickerGrid stickers={stickers} onLongPress={setSelectedSticker} />
              </View>
            );
          })
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
    </SafeAreaView>
  );
}
