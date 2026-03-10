import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { getStadiumsByCountry } from '../../src/data/stadiums';
import StadiumCard from '../../src/components/StadiumCard';

export default function StadiumsScreen() {
  const t = useTheme();
  const groups = useMemo(() => getStadiumsByCountry(), []);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(groups).map((k) => [k, true]))
  );

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalCount = Object.values(groups).flat().length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text
          style={{ fontSize: 18, fontWeight: '700', color: t.gold, textTransform: 'uppercase' }}>
          Estádios da Copa 2026
        </Text>
        <Text style={{ fontSize: 13, color: t.textSecondary }}>
          {totalCount} estádios em {Object.keys(groups).length} países
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 12 }}>
        {Object.entries(groups).map(([country, stadiumList]) => (
          <View
            key={country}
            style={{
              backgroundColor: t.surface,
              borderWidth: 1,
              borderColor: t.border,
              borderRadius: 16,
              overflow: 'hidden',
            }}>
            <Pressable
              onPress={() => toggleGroup(country)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 14,
              }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>{country}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    backgroundColor: t.surfaceLight,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: t.border,
                  }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: t.gold }}>
                    {stadiumList.length}
                  </Text>
                </View>
                {expanded[country] ? (
                  <ChevronUp size={18} color={t.textSecondary} />
                ) : (
                  <ChevronDown size={18} color={t.textSecondary} />
                )}
              </View>
            </Pressable>

            {expanded[country] &&
              stadiumList.map((stadium) => <StadiumCard key={stadium.name} stadium={stadium} />)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
