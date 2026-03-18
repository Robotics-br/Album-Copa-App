import type { ThemeStyle } from '../types';

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textSecondary: string;
  ownedStickerTextColor: string;
  border: string;
  missingStickerBg: string;
  missingStickerBorder: string;
  primary: string;
  onPrimary: string;
  headerBg: string;
  onHeader: string;
  owned: string;
  duplicate: string;
  onDuplicate: string;
  accent: string;
  tabBorderColor: string;
  tabsBg: string;
  tabsBgActive: string;
  tabsBgInactive: string;
  statusBar: 'light' | 'dark';
}

export const themeMap: Record<ThemeStyle, ThemeColors> = {
  'original-dark': {
    bg: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#A1A1A6',
    ownedStickerTextColor: '#FFFFFF',
    border: '#38383A',
    missingStickerBg: '#3A3A3C',
    missingStickerBorder: '#636366',
    owned: '#304ffe',
    duplicate: '#FFFFFF',
    onDuplicate: '#000000',
    primary: '#ffffff',
    onPrimary: '#0F1923',
    headerBg: '#070c3b',
    onHeader: '#ffffff',
    accent: '#FF453A',
    tabBorderColor: '#425796',
    tabsBg: '#070c3b',
    tabsBgActive: '#f2cd27',
    tabsBgInactive: '#cfccc2',
    statusBar: 'light',
  },
  'original-light': {
    bg: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#71717A',
    ownedStickerTextColor: '#000000',
    border: '#E4E4E7',
    missingStickerBg: '#cbd5e0',
    missingStickerBorder: '#304ffe',
    owned: '#304ffe',
    duplicate: '#FFFFFF',
    onDuplicate: '#000000',
    primary: '#304ffe',
    onPrimary: '#ffffff',
    headerBg: '#304ffe',
    onHeader: '#ffffff',
    accent: '#D70104',
    tabBorderColor: '#96a2ff',
    tabsBg: '#304ffe',
    tabsBgActive: '#f2cd27',
    tabsBgInactive: '#B8C0FF',
    statusBar: 'dark',
  },
  neon: {
    bg: '#090714',
    surface: '#1A1635',
    text: '#F8F8FF',
    textSecondary: '#A390E4',
    ownedStickerTextColor: '#FFFFFF',
    border: '#3D2C8D',
    missingStickerBg: '#2A2356',
    missingStickerBorder: '#5E4BBA',
    primary: '#FF007F',
    onPrimary: '#FFFFFF',
    headerBg: '#240046',
    onHeader: '#FFFFFF',
    owned: '#00E5FF',
    duplicate: '#FFE600',
    onDuplicate: '#000000',
    accent: '#FF007F',
    tabBorderColor: '#3D2C8D',
    tabsBg: '#240046',
    tabsBgActive: '#f2cd27',
    tabsBgInactive: '#8A72C1',
    statusBar: 'light',
  },
  pink: {
    bg: '#FFF5F9',
    surface: '#FFFFFF',
    text: '#3A0920',
    textSecondary: '#8A4F6A',
    ownedStickerTextColor: '#3A0920',
    border: '#F4C2D7',
    missingStickerBg: '#EBD4E0',
    missingStickerBorder: '#D1A3B8',
    primary: '#E0218A',
    onPrimary: '#FFFFFF',
    headerBg: '#E0218A',
    onHeader: '#FFFFFF',
    owned: '#E0218A',
    duplicate: '#FFFFFF',
    onDuplicate: '#E0218A',
    accent: '#00C3E3',
    tabBorderColor: '#c9ab22',
    tabsBg: '#E0218A',
    tabsBgActive: '#f2cd27',
    tabsBgInactive: '#F8C8DF',
    statusBar: 'light',
  },
};
