import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeStyle } from '../types';

interface SettingsState {
  style: ThemeStyle;
  seniorMode: boolean;
  soundEnabled: boolean;
  favoriteTeam: string | null;
  language: string | null;

  setStyle: (style: ThemeStyle) => void;
  toggleSeniorMode: () => void;
  toggleSound: () => void;
  setFavoriteTeam: (teamId: string | null) => void;
  setLanguage: (lang: string) => void;
  resetSettings: () => void;
}

const defaults = {
  style: 'original-dark' as ThemeStyle,
  seniorMode: false,
  soundEnabled: true,
  favoriteTeam: null,
  language: null,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,

      setStyle: (style) => set({ style }),
      toggleSeniorMode: () => set((s) => ({ seniorMode: !s.seniorMode })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setFavoriteTeam: (teamId) => set({ favoriteTeam: teamId }),
      setLanguage: (lang) => set({ language: lang }),
      resetSettings: () => set(defaults),
    }),
    {
      name: '@copa2026/settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
