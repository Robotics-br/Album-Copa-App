import React from 'react';
import { View, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import AnimatedPressable from './ui/AnimatedPressable';
import SummaryCard from './SummaryCard';
import TeamSelector from './TeamSelector';
import FilterBar from './FilterBar';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';

interface MainHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MainHeader = ({ searchQuery, setSearchQuery }: MainHeaderProps) => {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();

  return (
    <View className="bg-bg pb-2">
      <SummaryCard />
      <View
        style={{ marginHorizontal: HORIZONTAL_PADDING }}
        className="my-2.5 flex-row items-center rounded-xl border border-border bg-surface px-3">
        <Search size={16} color={t.textSecondary} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={i18n_t('components.mainHeader.search')}
          placeholderTextColor={t.textSecondary}
          returnKeyType="search"
          style={{ color: t.text }}
          className="flex-1 px-2 py-2.5 text-[13px]"
        />
        {searchQuery.length > 0 && (
          <AnimatedPressable
            onPress={() => setSearchQuery('')}
            scaleDown={0.8}
            className="h-6 w-6 items-center justify-center rounded-full bg-surface-light">
            <X size={14} color={t.textSecondary} />
          </AnimatedPressable>
        )}
      </View>
      <TeamSelector />
      <FilterBar />
    </View>
  );
};

export default React.memo(MainHeader);
