import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserCollection, AppSettings, BackupData } from '../types';
import type { StorageService } from './storage';

const COLLECTION_KEY = '@copa2026/collection';
const SETTINGS_KEY = '@copa2026/settings';
const BACKUP_VERSION = 1;

export const localStorage: StorageService = {
  async loadCollection(): Promise<UserCollection> {
    try {
      const raw = await AsyncStorage.getItem(COLLECTION_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  async saveCollection(collection: UserCollection): Promise<void> {
    try {
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    } catch {
      /* ignore */
    }
  },

  async loadSettings(): Promise<AppSettings | null> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  },

  async exportBackup(): Promise<BackupData> {
    const collection = await this.loadCollection();
    const settings = await this.loadSettings();
    return {
      collection,
      settings: settings ?? {
        seniorMode: false,
        soundEnabled: true,
        favoriteTeam: null,
        theme: 'dark',
        style: 'original-dark',
      },
      version: BACKUP_VERSION,
    };
  },

  async importBackup(data: BackupData): Promise<void> {
    if (data.collection) await this.saveCollection(data.collection);
    if (data.settings) await this.saveSettings(data.settings);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(COLLECTION_KEY);
    await AsyncStorage.removeItem(SETTINGS_KEY);
  },
};
