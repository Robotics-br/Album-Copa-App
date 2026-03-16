import { create } from 'zustand';
import type { StickerFilter } from '../types';

interface AlbumFiltersState {
  stickerFilter: StickerFilter;
  currentSection: string | null;
  searchQuery: string;

  setFilter: (filter: StickerFilter) => void;
  setSection: (sectionId: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useAlbumFiltersStore = create<AlbumFiltersState>()((set) => ({
  stickerFilter: 'all',
  currentSection: null,
  searchQuery: '',

  setFilter: (filter) => set({ stickerFilter: filter }),
  setSection: (sectionId) => set({ currentSection: sectionId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ stickerFilter: 'all', currentSection: null, searchQuery: '' }),
}));
