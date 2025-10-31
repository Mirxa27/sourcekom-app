import { create } from 'zustand'

interface FavoritesState {
  favorites: string[]
  addFavorite: (resourceId: string) => void
  removeFavorite: (resourceId: string) => void
  setFavorites: (resourceIds: string[]) => void
}

export const useFavorites = create<FavoritesState>((set) => ({
  favorites: [],
  addFavorite: (resourceId) =>
    set((state) => ({ favorites: [...state.favorites, resourceId] })),
  removeFavorite: (resourceId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== resourceId),
    })),
  setFavorites: (resourceIds) => set({ favorites: resourceIds }),
}))
