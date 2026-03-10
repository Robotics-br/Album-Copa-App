import React from 'react';
import { View, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import AnimatedPressable from './ui/AnimatedPressable';
import SummaryCard from './SummaryCard';
import TeamTabs from './TeamTabs';
import FilterBar from './FilterBar';

interface MainHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MainHeader = ({ searchQuery, setSearchQuery }: MainHeaderProps) => {
  const t = useTheme();

  return (
    <View style={{ backgroundColor: t.bg, paddingBottom: 8 }}>
      <SummaryCard />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 12,
          marginVertical: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: t.border,
          backgroundColor: t.surface,
          paddingHorizontal: 12,
        }}>
        <Search size={16} color={t.textSecondary} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Nome do jogador ou código"
          placeholderTextColor={t.textSecondary}
          returnKeyType="search"
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 8,
            color: t.text,
            fontSize: 13,
          }}
        />
        {searchQuery.length > 0 && (
          <AnimatedPressable
            onPress={() => setSearchQuery('')}
            scaleDown={0.8}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: t.surfaceLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <X size={14} color={t.textSecondary} />
          </AnimatedPressable>
        )}
      </View>
      <TeamTabs />
      <FilterBar />
    </View>
  );
};

export default React.memo(MainHeader);
