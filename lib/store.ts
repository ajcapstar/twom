import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './types';

// This is what an item in the cart looks like
export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id && (size ? item.size === size : true)
        );

        if (existingItem) {
          // If matching item + size is already in the cart, increase quantity
          set({
            items: currentItems.map((item) =>
              item.id === product.id && (size ? item.size === size : true)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Otherwise, add it as a new item with size
          set({
            items: [
              ...currentItems,
              { ...product, quantity: 1, ...(size ? { size } : {}) },
            ],
          });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.id === id && (size !== undefined ? item.size === size : true))
          ),
        });
      },

      updateQuantity: (id, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && (size !== undefined ? item.size === size : true)
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'twom-cart-storage', // This is the key it saves to in Local Storage
    }
  )
);