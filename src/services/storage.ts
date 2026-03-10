import type { UserCollection, AppSettings, BackupData } from '../types';

export interface StorageService {
  loadCollection(): Promise<UserCollection>;
  saveCollection(collection: UserCollection): Promise<void>;
  loadSettings(): Promise<AppSettings | null>;
  saveSettings(settings: AppSettings): Promise<void>;
  exportBackup(): Promise<BackupData>;
  importBackup(data: BackupData): Promise<void>;
  clear(): Promise<void>;
}
