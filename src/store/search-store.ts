import { create } from "zustand";
import { Product } from "@/interfaces";

interface SearchState {
    searchTerm: string;
    searchResults: Product[];
    isSearching: boolean;
    showSearchInput: boolean;
    totalResults: number;
    currentPage: number;
    totalPages: number;

    // Actions
    setSearchTerm: (term: string) => void;
    setSearchResults: (results: Product[], total: number, page: number, totalPages: number) => void;
    setIsSearching: (isSearching: boolean) => void;
    toggleSearchInput: () => void;
    setShowSearchInput: (show: boolean) => void;
    clearSearch: () => void;
    setCurrentPage: (page: number) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchTerm: "",
    searchResults: [],
    isSearching: false,
    showSearchInput: false,
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,

    setSearchTerm: (term: string) => set({ searchTerm: term }),

    setSearchResults: (results: Product[], total: number, page: number, totalPages: number) =>
        set({
            searchResults: results,
            totalResults: total,
            currentPage: page,
            totalPages: totalPages,
        }),

    setIsSearching: (isSearching: boolean) => set({ isSearching }),

    toggleSearchInput: () => set((state) => ({ showSearchInput: !state.showSearchInput })),

    setShowSearchInput: (show: boolean) => set({ showSearchInput: show }),

    clearSearch: () =>
        set({
            searchTerm: "",
            searchResults: [],
            isSearching: false,
            totalResults: 0,
            currentPage: 1,
            totalPages: 0,
            showSearchInput: false,
        }),

    setCurrentPage: (page: number) => set({ currentPage: page }),
}));
