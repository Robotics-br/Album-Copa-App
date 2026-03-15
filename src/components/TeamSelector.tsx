import React, { useState, useMemo } from 'react';
import { View, Modal, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { selectionTap } from '../utils/haptics';
import { teams } from '../data/teams';
import { useAlbumFiltersStore } from '@/store/useAlbumFiltersStore';
import AnimatedPressable from './ui/AnimatedPressable';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';

export default function TeamSelector() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { t: i18n_t } = useTranslation();
  const { currentTeam, setTeam } = useAlbumFiltersStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTeam = useMemo(() => {
    return teams.find((team) => team.id === currentTeam);
  }, [currentTeam]);

  const filteredTeams = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return teams;
    return teams.filter(
      (team) => team.name.toLowerCase().includes(query) || team.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectTeam = (teamId: string | null) => {
    selectionTap();
    setTeam(teamId);
    setModalVisible(false);
    setSearchQuery('');
  };

  const clearFilter = (e: any) => {
    e.stopPropagation();
    selectionTap();
    setTeam(null);
  };

  return (
    <View className="mb-2">
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
        <AnimatedPressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <View className="flex-1 flex-row items-center">
            <Text className="mr-3 text-[20px]">{selectedTeam ? selectedTeam.flag : '🌎'}</Text>
            <View className="flex-1">
              <Text className="text-[12px] font-medium uppercase tracking-tight text-text-secondary">
                {i18n_t('components.teamSelector.label')}
              </Text>
              <Text className="text-[15px] font-bold text-text">
                {selectedTeam ? selectedTeam.name : i18n_t('filters.all')}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            {currentTeam && (
              <TouchableOpacity
                onPress={clearFilter}
                className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-surface">
                <X size={16} color={t.textSecondary} />
              </TouchableOpacity>
            )}
            <ChevronRight size={20} color={t.textSecondary} className="shrink-0" />
          </View>
        </AnimatedPressable>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setModalVisible(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="h-[70%] overflow-hidden rounded-t-[32px] border-t border-border bg-bg"
            style={{ paddingBottom: Math.max(20, insets.bottom) }}>
            <View className="border-b border-border bg-surface px-6 pb-5 pt-6">
              <View className="mb-5 flex-row items-center justify-between">
                <Text className="text-[22px] font-bold text-text">
                  {i18n_t('components.teamSelector.modalTitle')}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
                  <X size={24} color={t.text} />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center rounded-2xl border border-border bg-bg px-4">
                <Search size={20} color={t.textSecondary} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={i18n_t('components.mainHeader.search')}
                  placeholderTextColor={t.textSecondary}
                  className="flex-1 px-3 py-4 text-[16px]"
                  style={{ color: t.text }}
                  autoFocus={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={20} color={t.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View className="flex-1">
              <FlashList
                data={filteredTeams}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                ListHeaderComponent={() => (
                  <TouchableOpacity
                    onPress={() => handleSelectTeam(null)}
                    className="bg-surface/30 flex-row items-center border-b border-border px-6 py-5">
                    <View className="mr-5 h-11 w-11 items-center justify-center rounded-full border border-border bg-surface">
                      <Text className="text-[22px]">🌎</Text>
                    </View>
                    <Text
                      className={`flex-1 text-[17px] ${!currentTeam ? 'text-primary font-bold' : 'font-medium text-text'}`}>
                      {i18n_t('components.teamSelector.allTeams')}
                    </Text>
                    {!currentTeam && <View className="bg-primary h-2.5 w-2.5 rounded-full" />}
                  </TouchableOpacity>
                )}
                renderItem={({ item }) => {
                  const isActive = currentTeam === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectTeam(item.id)}
                      className="flex-row items-center border-b border-border px-6 py-5"
                      style={{ backgroundColor: isActive ? `${t.primary}10` : 'transparent' }}>
                      <Text className="mr-5 text-[32px]">{item.flag}</Text>
                      <View className="flex-1">
                        <Text
                          className={`text-[17px] ${isActive ? 'text-primary font-bold' : 'font-medium text-text'}`}>
                          {item.name}
                        </Text>
                        <Text className="mt-0.5 text-[12px] uppercase tracking-wider text-text-secondary">
                          {item.code}
                        </Text>
                      </View>
                      {isActive && <View className="bg-primary h-2.5 w-2.5 rounded-full" />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
