import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import he from './locales/he.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import ja from './locales/ja.json';
import hi from './locales/hi.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
  fr: { translation: fr },
  he: { translation: he },
  zh: { translation: zh },
  ar: { translation: ar },
  ja: { translation: ja },
  hi: { translation: hi },
};

const deviceLanguage = getLocales()[0]?.languageCode ?? 'pt';
const supportedLanguages = ['pt', 'en', 'es', 'de', 'it', 'fr', 'he', 'zh', 'ar', 'ja', 'hi'];

i18n.use(initReactI18next).init({
  resources,
  lng: supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'pt', // fallback to pt if system language is not supported
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4', // Needed for React Native
});

export default i18n;
