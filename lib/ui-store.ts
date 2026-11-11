import { create } from "zustand";
import { Product } from "./types";

interface UIStore {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  quickBuyProduct: Product | null;
  openQuickBuy: (product: Product) => void;
  closeQuickBuy: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  quickBuyProduct: null,
  openQuickBuy: (product) => set({ quickBuyProduct: product }),
  closeQuickBuy: () => set({ quickBuyProduct: null }),
}));
