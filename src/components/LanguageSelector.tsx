import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Languages, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import AnimatedPressable from './ui/AnimatedPressable';

interface LanguageSelectorProps {
  currentLanguage: string | null;
  onSelect: (lang: string | null) => void;
}

const languages = [
  { id: null, labelKey: 'settings.languages.system' },
  { id: 'pt', labelKey: 'settings.languages.pt' },
  { id: 'en', labelKey: 'settings.languages.en' },
  { id: 'es', labelKey: 'settings.languages.es' },
  { id: 'de', labelKey: 'settings.languages.de' },
  { id: 'it', labelKey: 'settings.languages.it' },
  { id: 'fr', labelKey: 'settings.languages.fr' },
  { id: 'he', labelKey: 'settings.languages.he' },
  { id: 'zh', labelKey: 'settings.languages.zh' },
  { id: 'ar', labelKey: 'settings.languages.ar' },
  { id: 'ja', labelKey: 'settings.languages.ja' },
  { id: 'hi', labelKey: 'settings.languages.hi' },
];

export default function LanguageSelector({ currentLanguage, onSelect }: LanguageSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const selectedLang = languages.find((l) => l.id === currentLanguage) || languages[0];

  return (
    <>
      <AnimatedPressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between border-t border-border px-4 py-3.5">
        <View className="flex-row items-center gap-3">
          <Languages size={20} color={theme.text} />
          <View>
            <Text className="text-[15px] font-medium text-text">{t('settings.language')}</Text>
            <Text className="text-[11px] text-text-secondary">{t(selectedLang.labelKey)}</Text>
          </View>
        </View>
        <ChevronRight size={18} color={theme.textSecondary} />
      </AnimatedPressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setModalVisible(false)}>
          <View
            className="overflow-hidden rounded-t-[32px]"
            style={{ backgroundColor: theme.bg, maxHeight: '85%' }}>
            <View className="items-center border-b border-border py-4">
              <View className="bg-border/50 mb-4 h-1.5 w-12 rounded-full" />
              <Text className="text-[16px] font-bold uppercase tracking-widest text-text">
                {t('settings.language')}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="p-4">
              <View className="gap-2" style={{ paddingBottom: Math.max(insets.bottom, 20) + 20 }}>
                {languages.map((lang) => {
                  const active = currentLanguage === lang.id;
                  return (
                    <AnimatedPressable
                      key={lang.id || 'system'}
                      onPress={() => {
                        onSelect(lang.id);
                        setModalVisible(false);
                      }}
                      className="flex-row items-center justify-between rounded-2xl px-5 py-4"
                      style={{
                        backgroundColor: active ? `${theme.gold}20` : theme.surfaceLight,
                        borderWidth: 1.5,
                        borderColor: active ? theme.gold : 'transparent',
                      }}>
                      <View className="flex-row items-center gap-3">
                        <Text
                          className="text-[15px] font-semibold"
                          style={{ color: active ? theme.gold : theme.text }}>
                          {t(lang.labelKey)}
                        </Text>
                      </View>
                      {active && <Check size={20} color={theme.gold} strokeWidth={3} />}
                    </AnimatedPressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
