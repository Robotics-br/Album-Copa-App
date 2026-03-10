export interface Team {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export interface Sticker {
  id: number;
  code: string;
  name: string;
  teamId: string;
  type: 'badge' | 'team_photo' | 'player';
  position?: 'GOL' | 'DEF' | 'MEI' | 'ATA';
}

export interface UserCollection {
  [stickerId: number]: number;
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
