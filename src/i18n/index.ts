import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import it from './locales/it.json';
import fr from './locales/fr.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
  fr: { translation: fr },
};

const deviceLanguage = getLocales()[0]?.languageCode ?? 'pt';

i18n.use(initReactI18next).init({
  resources,
  lng: ['pt', 'en', 'es', 'de', 'it', 'fr'].includes(deviceLanguage) ? deviceLanguage : 'pt', // fallback to pt if system language is not supported
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4', // Needed for React Native
});

export default i18n;
