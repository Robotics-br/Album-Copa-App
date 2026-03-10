import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserCollection } from '../types';

interface CollectionState {
  collection: UserCollection;
  toggleSticker: (code: string) => void;
  setQuantity: (code: string, qty: number) => void;
  getQuantity: (code: string) => number;
  reset: () => void;
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

      reset: () => set({ collection: {} }),
    }),
    {
      name: '@copa2026/collection',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
