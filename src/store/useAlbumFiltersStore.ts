import { create } from 'zustand';
import type { StickerFilter } from '../types';

interface AlbumFiltersState {
  stickerFilter: StickerFilter;
  currentTeam: string | null;
  searchQuery: string;

  setFilter: (filter: StickerFilter) => void;
  setTeam: (teamId: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useAlbumFiltersStore = create<AlbumFiltersState>()((set) => ({
  stickerFilter: 'all',
  currentTeam: null,
  searchQuery: '',

  setFilter: (filter) => set({ stickerFilter: filter }),
  setTeam: (teamId) => set({ currentTeam: teamId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ stickerFilter: 'all', currentTeam: null, searchQuery: '' }),
}));
