import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Eye, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import Toggle from '../../src/components/ui/Toggle';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import type { ThemeStyle } from '../../src/types';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';

const styleOptions: { id: ThemeStyle; labelKey: string }[] = [
  { id: 'original-dark', labelKey: 'settings.themes.original-dark' },
  { id: 'original-light', labelKey: 'settings.themes.original-light' },
  { id: 'minecraft', labelKey: 'settings.themes.minecraft' },
  { id: 'fortnite', labelKey: 'settings.themes.fortnite' },
  { id: 'mario', labelKey: 'settings.themes.mario' },
  { id: 'gta', labelKey: 'settings.themes.gta' },
  { id: 'freefire', labelKey: 'settings.themes.freefire' },
  { id: 'genshin', labelKey: 'settings.themes.genshin' },
  { id: 'roblox', labelKey: 'settings.themes.roblox' },
  { id: 'lego', labelKey: 'settings.themes.lego' },
];

const languageOptions = [
  { id: null, labelKey: 'settings.languages.system' },
  { id: 'pt', labelKey: 'settings.languages.pt' },
  { id: 'en', labelKey: 'settings.languages.en' },
  { id: 'es', labelKey: 'settings.languages.es' },
  { id: 'de', labelKey: 'settings.languages.de' },
  { id: 'it', labelKey: 'settings.languages.it' },
  { id: 'fr', labelKey: 'settings.languages.fr' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    style,
    seniorMode,
    soundEnabled,
    language,
    setStyle,
    toggleSeniorMode,
    toggleSound,
    setLanguage,
  } = useSettingsStore();
  const resetCollection = useCollectionStore((s) => s.reset);

  const handleReset = () => {
    Alert.alert(t('settings.deleteAll'), t('settings.deleteAllAlertDesc'), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.delete'),
        style: 'destructive',
        onPress: () => resetCollection(),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="py-2">
        <Text className="text-[14px] font-bold uppercase text-gold">{t('settings.title')}</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Text className="p-3 pb-0 text-[12px] font-semibold uppercase tracking-widest text-text-secondary">
            {t('settings.visualStyle')}
          </Text>
          <Text className="px-3 pb-3 pt-1 text-[11px] text-text-secondary">
            {t('settings.themesSubtitle')}
          </Text>
          <View className="flex-row flex-wrap gap-2 px-4 pb-4">
            {styleOptions.map(({ id, labelKey }) => {
              const active = style === id;
              return (
                <AnimatedPressable
                  key={id}
                  onPress={() => setStyle(id)}
                  className="w-[47%] items-center rounded-xl border-2 px-2 py-2.5"
                  style={{
                    borderColor: active ? theme.gold : theme.border,
                    backgroundColor: active ? `${theme.gold}25` : theme.surfaceLight,
                  }}>
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: active ? theme.gold : theme.text }}>
                    {t(labelKey)}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Text className="p-3 text-[12px] font-semibold uppercase tracking-widest text-text-secondary">
            {t('settings.language')}
          </Text>
          <Text className="px-3 pb-3 pt-0 text-[11px] text-text-secondary">
            {t('settings.languageDesc')}
          </Text>
          <View className="flex-row flex-wrap gap-2 px-4 pb-4">
            {languageOptions.map(({ id, labelKey }) => {
              const active = language === id;
              return (
                <AnimatedPressable
                  key={id || 'system'}
                  onPress={() => setLanguage(id as string)}
                  className="w-[31%] items-center rounded-xl border-2 px-2 py-2.5"
                  style={{
                    borderColor: active ? theme.gold : theme.border,
                    backgroundColor: active ? `${theme.gold}25` : theme.surfaceLight,
                  }}>
                  <Text
                    className="text-center text-[12px] font-semibold"
                    style={{ color: active ? theme.gold : theme.text }}>
                    {t(labelKey)}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Text className="p-3 text-[12px] font-semibold uppercase tracking-widest text-text-secondary">
            {t('settings.accessibility')}
          </Text>

          <View className="flex-row items-center justify-between border-t border-border px-4 py-3.5">
            <View className="flex-row items-center gap-3">
              <Eye size={20} color={theme.text} />
              <View>
                <Text className="text-[15px] font-medium text-text">
                  {t('settings.seniorMode')}
                </Text>
                <Text className="text-[11px] text-text-secondary">
                  {t('settings.seniorModeDesc')}
                </Text>
              </View>
            </View>
            <Toggle value={seniorMode} onValueChange={toggleSeniorMode} />
          </View>

          <View className="flex-row items-center justify-between border-t border-border px-4 py-3.5">
            <View className="flex-row items-center gap-3">
              {soundEnabled ? (
                <Volume2 size={20} color={theme.text} />
              ) : (
                <VolumeX size={20} color={theme.text} />
              )}
              <View>
                <Text className="text-[15px] font-medium text-text">{t('settings.sound')}</Text>
                <Text className="text-[11px] text-text-secondary">{t('settings.soundDesc')}</Text>
              </View>
            </View>
            <Toggle value={soundEnabled} onValueChange={toggleSound} />
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-red-500/30 bg-surface">
          <Pressable
            onPress={handleReset}
            className="flex-row items-center gap-3 p-4 active:opacity-50">
            <Trash2 size={20} color="#E53935" />
            <View>
              <Text className="text-[15px] font-medium text-[#E53935]">
                {t('settings.deleteAll')}
              </Text>
              <Text className="text-[11px] text-text-secondary">{t('settings.deleteAllDesc')}</Text>
            </View>
          </Pressable>
        </View>

        <View className="items-center py-6">
          <Text className="text-[13px] text-text-secondary">{t('settings.footerTitle')}</Text>
          <Text className="mt-1 text-[11px] text-text-secondary opacity-70">
            {t('settings.footerSubtitle')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
