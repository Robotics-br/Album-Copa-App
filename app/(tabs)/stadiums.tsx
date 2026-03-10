import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { getStadiumsByCountry } from '../../src/data/stadiums';
import StadiumCard from '../../src/components/StadiumCard';
import { useTranslation } from 'react-i18next';

export default function StadiumsScreen() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const groups = useMemo(() => getStadiumsByCountry(), []);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(groups).map((k) => [k, true]))
  );

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalCount = Object.values(groups).flat().length;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-3 py-2">
        <Text className="text-[18px] font-bold uppercase text-gold">
          {i18n_t('stadiums.title')}
        </Text>
        <Text className="text-[13px] text-text-secondary">
          {i18n_t('stadiums.subtitle', { totalCount, countryCount: Object.keys(groups).length })}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 12 }}>
        {Object.entries(groups).map(([country, stadiumList]) => (
          <View
            key={country}
            className="overflow-hidden rounded-2xl border border-border bg-surface">
            <Pressable
              onPress={() => toggleGroup(country)}
              className="flex-row items-center justify-between p-3.5">
              <Text className="text-[15px] font-bold text-text">{country}</Text>
              <View className="flex-row items-center gap-2">
                <View className="rounded-full border border-border bg-surface-light px-2.5 py-0.5">
                  <Text className="text-[11px] font-bold text-gold">{stadiumList.length}</Text>
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
