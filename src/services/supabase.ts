import { createClient } from '@supabase/supabase-js';
import type { StorageService } from './storage';
import type { UserCollection, AppSettings, BackupData } from '../types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Implementação futura do StorageService usando Supabase.
 * Por enquanto apenas stub — troque a implementação em getStorageService()
 * quando estiver pronto para usar.
 */
export const supabaseStorage: StorageService = {
  async loadCollection(): Promise<UserCollection> {
    // TODO: implementar query no Supabase
    return {};
  },

  async saveCollection(_collection: UserCollection): Promise<void> {
    // TODO: upsert no Supabase
  },

  async loadSettings(): Promise<AppSettings | null> {
    // TODO: query settings do usuário
    return null;
  },

  async saveSettings(_settings: AppSettings): Promise<void> {
    // TODO: upsert settings
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
      version: 1,
    };
  },

  async importBackup(data: BackupData): Promise<void> {
    if (data.collection) await this.saveCollection(data.collection);
    if (data.settings) await this.saveSettings(data.settings);
  },

  async clear(): Promise<void> {
    // TODO: limpar dados do usuário
  },
};
