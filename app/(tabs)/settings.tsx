import React from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { AppText as Text } from '../../src/components/ui/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Eye, Trash2, Zap, ZapOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import Toggle from '../../src/components/ui/Toggle';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import type { ThemeStyle } from '../../src/types';
import ScreenHeader from '../../src/components/ScreenHeader';
import LanguageSelector from '../../src/components/LanguageSelector';

const styleOptions: { id: ThemeStyle; labelKey: string }[] = [
  { id: 'original-dark', labelKey: 'settings.themes.original-dark' },
  { id: 'original-light', labelKey: 'settings.themes.original-light' },
  { id: 'neon', labelKey: 'settings.themes.neon' },
  { id: 'pink', labelKey: 'settings.themes.pink' },
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
    animationsEnabled,
    setStyle,
    toggleSeniorMode,
    toggleSound,
    setLanguage,
    toggleAnimations,
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
      <ScreenHeader titleKey="settings.title" />

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
                    borderColor: active ? theme.primary : theme.border,
                    backgroundColor: active ? `${theme.primary}25` : theme.surface,
                  }}>
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: active ? theme.primary : theme.text }}>
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
          <LanguageSelector currentLanguage={language} onSelect={setLanguage} />
        </View>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Text className="p-3 text-[12px] font-semibold uppercase tracking-widest text-text-secondary">
            {t('settings.accessibility')}
          </Text>

          <View className="flex-row items-center justify-between border-t border-border px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              <Eye size={20} color={theme.text} />
              <View className="mr-3 flex-1">
                <Text className="text-[15px] font-medium text-text">
                  {t('settings.seniorMode')}
                </Text>
                <Text className="text-[11px] text-text-secondary">
                  {t('settings.seniorModeDesc')}
                </Text>
              </View>
            </View>
            <View className="shrink-0">
              <Toggle value={seniorMode} onValueChange={toggleSeniorMode} />
            </View>
          </View>

          <View className="flex-row items-center justify-between border-t border-border px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              {soundEnabled ? (
                <Volume2 size={20} color={theme.text} />
              ) : (
                <VolumeX size={20} color={theme.text} />
              )}
              <View className="mr-3 flex-1">
                <Text className="text-[15px] font-medium text-text">{t('settings.sound')}</Text>
                <Text className="text-[11px] text-text-secondary">{t('settings.soundDesc')}</Text>
              </View>
            </View>
            <View className="shrink-0">
              <Toggle value={soundEnabled} onValueChange={toggleSound} />
            </View>
          </View>
          <View className="flex-row items-center justify-between border-t border-border px-4 py-3.5">
            <View className="flex-1 flex-row items-center gap-3">
              {animationsEnabled ? (
                <Zap size={20} color={theme.text} />
              ) : (
                <ZapOff size={20} color={theme.text} />
              )}
              <View className="mr-3 flex-1">
                <Text className="text-[15px] font-medium text-text">
                  {t('settings.animations')}
                </Text>
                <Text className="text-[11px] text-text-secondary">
                  {t('settings.animationsDesc')}
                </Text>
              </View>
            </View>
            <View className="shrink-0">
              <Toggle value={animationsEnabled} onValueChange={toggleAnimations} />
            </View>
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-red-500/30 bg-surface">
          <Pressable
            onPress={handleReset}
            className="flex-row items-center gap-3 p-4 active:opacity-50">
            <View className="flex-1 flex-row items-center gap-3">
              <Trash2 size={20} color="#E53935" />
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-[#E53935]">
                  {t('settings.deleteAll')}
                </Text>
                <Text className="text-[11px] text-text-secondary">
                  {t('settings.deleteAllDesc')}
                </Text>
              </View>
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
