import { create } from 'zustand'

interface CartState {
  items: any[]
  addToCart: (item: any) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>((set) => ({
  items: [],
  addToCart: (item) => set((state) => ({ items: [...state.items, item] })),
  removeFromCart: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  clearCart: () => set({ items: [] }),
}))
