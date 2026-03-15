import type { ThemeStyle } from '../types';

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
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

    owned: '#00B14F',
    duplicate: '#FFCC00',

    primary: '#FFCC00',
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

    owned: '#00B14F',
    duplicate: '#FFCC00',

    primary: '#304ffe',
    onPrimary: '#ffffff',
    accent: '#D70104',
    statusBar: 'dark',
  },
  minecraft: {
    bg: '#87a557',
    surface: '#c4b896',
    text: '#2d2a26',
    textSecondary: '#5c5346',
    border: '#8b7355',
    primary: '#7cb342',
    onPrimary: '#0F1923',
    owned: '#558b2f',
    duplicate: '#ff8f00',
    accent: '#f57c00',
    statusBar: 'dark',
  },
  fortnite: {
    bg: '#1e1b4b',
    surface: '#312e81',
    text: '#e0e7ff',
    textSecondary: '#a5b4fc',
    border: '#4f46e5',
    primary: '#c4b5fd',
    onPrimary: '#0F1923',
    owned: '#34d399',
    duplicate: '#f472b6',
    accent: '#f472b6',
    statusBar: 'light',
  },
  mario: {
    bg: '#fef3c7',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#92400e',
    border: '#f59e0b',
    primary: '#dc2626',
    onPrimary: '#0F1923',
    owned: '#16a34a',
    duplicate: '#2563eb',
    accent: '#dc2626',
    statusBar: 'dark',
  },
  gta: {
    bg: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#475569',
    primary: '#ec4899',
    onPrimary: '#0F1923',
    owned: '#06b6d4',
    duplicate: '#ec4899',
    accent: '#ec4899',
    statusBar: 'light',
  },
  freefire: {
    bg: '#1c1917',
    surface: '#292524',
    text: '#fafaf9',
    textSecondary: '#a8a29e',
    border: '#57534e',
    primary: '#ea580c',
    onPrimary: '#0F1923',
    owned: '#22c55e',
    duplicate: '#f97316',
    accent: '#f97316',
    statusBar: 'light',
  },
  genshin: {
    bg: '#1e1b4b',
    surface: '#312e81',
    text: '#e0e7ff',
    textSecondary: '#a5b4fc',
    border: '#6366f1',
    primary: '#c084fc',
    onPrimary: '#0F1923',
    owned: '#2dd4bf',
    duplicate: '#f0abfc',
    accent: '#c084fc',
    statusBar: 'light',
  },
  roblox: {
    bg: '#ecfdf5',
    surface: '#ffffff',
    text: '#064e3b',
    textSecondary: '#047857',
    border: '#10b981',
    primary: '#059669',
    onPrimary: '#0F1923',
    owned: '#10b981',
    duplicate: '#f59e0b',
    accent: '#059669',
    statusBar: 'dark',
  },
  lego: {
    bg: '#fef3c7',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#b45309',
    border: '#f59e0b',
    primary: '#dc2626',
    onPrimary: '#0F1923',
    owned: '#16a34a',
    duplicate: '#2563eb',
    accent: '#dc2626',
    statusBar: 'dark',
  },
};
