export interface Team {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export interface Sticker {
  code: string;
  albumIndex: number;
  name: string;
  section: string;
  isShiny: boolean;
}

export interface UserCollection {
  [stickerCode: string]: number;
}

export type ThemeStyle =
  | 'original-dark'
  | 'original-light'
  | 'minecraft'
  | 'fortnite'
  | 'mario'
  | 'gta'
  | 'freefire'
  | 'genshin'
  | 'roblox'
  | 'lego';

export interface AppSettings {
  seniorMode: boolean;
  soundEnabled: boolean;
  favoriteTeam: string | null;
  theme: 'light' | 'dark';
  style: ThemeStyle;
}

export type StickerFilter = 'all' | 'missing' | 'owned' | 'duplicates';

export interface BackupData {
  collection: UserCollection;
  settings: AppSettings;
  version: number;
}
