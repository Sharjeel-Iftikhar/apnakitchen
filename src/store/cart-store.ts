"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

const MAX_QTY = 20;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  /** Apply fresh server prices (after the client changes a price in the CMS). */
  setPrices: (prices: Record<string, number>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const items = existing
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) }
                  : i,
              )
            : [...state.items, { ...item, quantity }];
          return { items, isOpen: true };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setPrices: (prices) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId in prices ? { ...i, price: prices[i.productId] } : i)),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i,
                ),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "apnakitchen-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // don't persist drawer open state
    },
  ),
);

// Derived selectors
export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
