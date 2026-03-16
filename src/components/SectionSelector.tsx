import React, { useState, useMemo } from 'react';
import { View, Modal, TextInput, TouchableOpacity, Pressable, Platform } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { selectionTap } from '../utils/haptics';
import { sections } from '../data/sections';
import { useAlbumFiltersStore } from '@/store/useAlbumFiltersStore';
import AnimatedPressable from './ui/AnimatedPressable';
import { useTranslation } from 'react-i18next';
import { HORIZONTAL_PADDING } from '../utils/consts';

export default function SectionSelector() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { t: i18n_t } = useTranslation();
  const { currentSection, setSection } = useAlbumFiltersStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === currentSection);
  }, [currentSection]);

  const filteredSections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return sections;
    return sections.filter((s) => {
      const name = i18n_t(
        s.id === 'special' || s.id === 'stadiums' ? `sections.${s.id}` : `teams.${s.id}`
      );
      return name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
    });
  }, [searchQuery, i18n_t]);

  const handleSelectSection = (sectionId: string | null) => {
    selectionTap();
    setSection(sectionId);
    setModalVisible(false);
    setSearchQuery('');
  };

  const clearFilter = (e: any) => {
    e.stopPropagation();
    selectionTap();
    setSection(null);
  };

  const getName = (id: string) => {
    return i18n_t(id === 'special' || id === 'stadiums' ? `sections.${id}` : `teams.${id}`);
  };

  return (
    <View className="mb-2">
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
        <AnimatedPressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between rounded-xl border border-border bg-surface px-4 py-2">
          <View className="flex-1 flex-row items-center">
            <Text className="mr-3 text-[20px]">
              {selectedSection ? selectedSection.icon : '🌎'}
            </Text>
            <View className="flex-1">
              <Text className="text-[12px] font-medium uppercase tracking-tight text-text-secondary">
                {i18n_t('components.sectionSelector.label')}
              </Text>
              <Text className="text-[15px] font-bold text-text">
                {selectedSection ? getName(selectedSection.id) : i18n_t('filters.all')}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            {currentSection && (
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
            style={{
              paddingBottom: Platform.OS === 'ios' ? Math.max(20, insets.bottom) : insets.bottom,
            }}>
            <View className="border-b border-border bg-surface px-6 pb-5 pt-6">
              <View className="mb-5 flex-row items-center justify-between">
                <Text className="text-[22px] font-bold text-text">
                  {i18n_t('components.sectionSelector.modalTitle')}
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
                  placeholder={i18n_t('components.sectionSelector.search')}
                  placeholderTextColor={t.textSecondary}
                  className="flex-1 px-3 py-4 text-[16px]"
                  style={{ color: t.text }}
                  autoFocus={false}
                />
                {searchQuery.length > 0 && (
                  <AnimatedPressable onPressIn={selectionTap} onPress={() => setSearchQuery('')}>
                    <X size={20} color={t.textSecondary} />
                  </AnimatedPressable>
                )}
              </View>
            </View>
            <View className="flex-1">
              <FlashList
                data={filteredSections}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                ListHeaderComponent={() => (
                  <TouchableOpacity
                    onPress={() => handleSelectSection(null)}
                    className="flex-row items-center border-b border-border bg-surface px-6 py-5">
                    <View className="mr-5 h-11 w-11 items-center justify-center rounded-full border border-border bg-surface">
                      <Text className="text-[22px]">🌎</Text>
                    </View>
                    <Text
                      className={`flex-1 text-[17px] ${!currentSection ? 'font-bold text-primary' : 'font-medium text-text'}`}>
                      {i18n_t('components.sectionSelector.allSections')}
                    </Text>
                    {!currentSection && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </TouchableOpacity>
                )}
                renderItem={({ item }) => {
                  const isActive = currentSection === item.id;
                  const name = getName(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectSection(item.id)}
                      className="flex-row items-center border-b border-border px-6 py-5"
                      style={{ backgroundColor: isActive ? `${t.primary}10` : t.surface }}>
                      <Text className="mr-5 text-[32px]">{item.icon}</Text>
                      <View className="flex-1">
                        <Text
                          className={`text-[17px] ${isActive ? 'font-bold text-primary' : 'font-medium text-text'}`}>
                          {name}
                        </Text>
                        <Text className="mt-0.5 text-[12px] uppercase tracking-wider text-text-secondary">
                          {item.code}
                        </Text>
                      </View>
                      {isActive && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
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
