import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { totalStickers, stickers } from '../data/teams';
import ProgressBar from './ui/ProgressBar';

export default function SummaryCard() {
  const t = useTheme();
  const collection = useCollectionStore((s) => s.collection);

  const ownedCount = stickers.filter((s) => (collection[s.id] ?? 0) > 0).length;
  const pct = Math.round((ownedCount / totalStickers) * 100);

  return (
    <View
      style={{
        backgroundColor: t.surface,
        borderWidth: 1,
        borderColor: t.border,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 12,
        marginTop: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: t.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          SEU ÁLBUM
        </Text>
        <View style={{ flex: 1 }}>
          <ProgressBar percent={pct} height={8} />
        </View>
        <Text style={{ fontSize: 15, fontWeight: '800', color: t.gold }}>{pct}%</Text>
        <Text style={{ fontSize: 11, fontWeight: '600', color: t.accent, fontStyle: 'italic' }}>
          {100 - pct}% faltando
        </Text>
      </View>
    </View>
  );
}
