import '../global.css';
import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { useEffect } from 'react';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { getLocales } from 'expo-localization';
import '../src/i18n';
import { useTranslation } from 'react-i18next';
function InnerLayout() {
  const t = useTheme();
  const { language } = useSettingsStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      let lng = language;
      if (!lng) {
        const deviceLanguage = getLocales()[0]?.languageCode ?? 'pt';
        lng = ['pt', 'en', 'es', 'de', 'it', 'fr'].includes(deviceLanguage) ? deviceLanguage : 'pt';
      }
      i18n.changeLanguage(lng);
    };

    handleLanguageChange();
  }, [language, i18n]);

  return (
    <>
      <StatusBar style={t.statusBar === 'light' ? 'light' : 'dark'} />
      <Slot />
    </>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <InnerLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
