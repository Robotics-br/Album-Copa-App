import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserCollection } from '../types';

interface CollectionState {
  collection: UserCollection;
  toggleSticker: (id: number) => void;
  setQuantity: (id: number, qty: number) => void;
  getQuantity: (id: number) => number;
  reset: () => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: {},

      toggleSticker: (id: number) => {
        const current = get().collection[id] ?? 0;
        const next = current === 0 ? 1 : 0;
        set((state) => ({
          collection: { ...state.collection, [id]: next },
        }));
      },

      setQuantity: (id: number, qty: number) => {
        const val = Math.max(0, qty);
        set((state) => ({
          collection: { ...state.collection, [id]: val },
        }));
      },

      getQuantity: (id: number) => get().collection[id] ?? 0,

      reset: () => set({ collection: {} }),
    }),
    {
      name: '@copa2026/collection',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
