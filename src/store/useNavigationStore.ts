import { create } from 'zustand';
import type { StickerFilter } from '../types';

interface NavigationState {
  stickerFilter: StickerFilter;
  currentTeam: string | null;
  searchQuery: string;

  setFilter: (filter: StickerFilter) => void;
  setTeam: (teamId: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  stickerFilter: 'all',
  currentTeam: null,
  searchQuery: '',

  setFilter: (filter) => set({ stickerFilter: filter, currentTeam: null }),
  setTeam: (teamId) => set({ currentTeam: teamId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ stickerFilter: 'all', currentTeam: null, searchQuery: '' }),
}));
