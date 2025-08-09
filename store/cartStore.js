// store/cartStore.js
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (items) => set((state) => ({
    cartItems: [...state.cartItems, ...items],
  })),
  getCartCount: () => {
    const state = useCartStore.getState();
    return state.cartItems.length;
  },
  clearCart: () => set((state) => ({
    cartItems: [],
  })),
  }));
