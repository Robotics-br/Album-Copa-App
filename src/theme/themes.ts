import type { ThemeStyle } from '../types';

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  missingStickerBg: string;
  missingStickerBorder: string;
  primary: string;
  onPrimary: string;
  owned: string;
  duplicate: string;
  accent: string;
  statusBar: 'light' | 'dark';
}

export const themeMap: Record<ThemeStyle, ThemeColors> = {
  'original-dark': {
    bg: '#000000',
    surface: '#111111',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#2C2C2E',
    missingStickerBg: '#2C2C2E',
    missingStickerBorder: '#ffffff',
    owned: '#00C752',
    duplicate: '#FFCC00',
    primary: '#ffffff',
    onPrimary: '#0F1923',
    accent: '#D70104',
    statusBar: 'light',
  },
  'original-light': {
    bg: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#71717A',
    border: '#E4E4E7',
    missingStickerBg: '#E4E4E7',
    missingStickerBorder: '#304ffe',
    owned: '#00B14F',
    duplicate: '#FFCC00',
    primary: '#304ffe',
    onPrimary: '#ffffff',
    accent: '#D70104',
    statusBar: 'dark',
  },
  neon: {
    bg: '#1e1b4b',
    surface: '#312e81',
    text: '#e0e7ff',
    textSecondary: '#a5b4fc',
    border: '#4f46e5',
    missingStickerBg: '#4f46e5',
    missingStickerBorder: '#c4b5fd',
    primary: '#c4b5fd',
    onPrimary: '#0F1923',
    owned: '#34d399',
    duplicate: '#f472b6',
    accent: '#f472b6',
    statusBar: 'light',
  },
  pink: {
    bg: '#FFF5F9',
    surface: '#ffffff',
    text: '#4A0E2C',
    textSecondary: '#A36681',
    border: '#F9D6E5',
    missingStickerBg: '#F9D6E5',
    missingStickerBorder: '#E0218A',
    primary: '#E0218A',
    onPrimary: '#FFFFFF',
    owned: '#00B14F',
    duplicate: '#E0218A',
    accent: '#E0218A',
    statusBar: 'dark',
  },
};
