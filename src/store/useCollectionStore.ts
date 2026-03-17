import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserCollection } from '../types';
import { sections, getStickersBySection } from '../data/sections';

interface CollectionState {
  collection: UserCollection;
  toggleSticker: (code: string) => void;
  setQuantity: (code: string, qty: number) => void;
  getQuantity: (code: string) => number;
  getDuplicatesList: () => string[];
  getMissingList: () => string[];
  reset: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: {},

      toggleSticker: (code: string) => {
        const current = get().collection[code] ?? 0;
        const next = current === 0 ? 1 : 0;
        set((state) => ({
          collection: { ...state.collection, [code]: next },
        }));
      },

      setQuantity: (code: string, qty: number) => {
        const val = Math.max(0, qty);
        set((state) => ({
          collection: { ...state.collection, [code]: val },
        }));
      },

      getQuantity: (code: string) => get().collection[code] ?? 0,

      getDuplicatesList: () => {
        const { collection } = get();
        return Object.entries(collection)
          .filter(([_, qty]) => qty > 1)
          .map(([code]) => code);
      },

      getMissingList: () => {
        const { collection } = get();
        const allStickers = sections.flatMap((s) => getStickersBySection(s.id));
        return allStickers.filter((s) => (collection[s.code] ?? 0) === 0).map((s) => s.code);
      },

      reset: () => set({ collection: {} }),
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: '@copa2026/collection',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
