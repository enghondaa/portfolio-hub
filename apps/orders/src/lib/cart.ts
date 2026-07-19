"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  imageKey: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: () => number;
}

/**
 * Cart lives in the browser (localStorage via Zustand persist), not on the
 * server: an anonymous shopper has no session until checkout, and there is
 * nothing here worth a round trip. Prices shown from the cart are for display
 * only — the server reprices every line from the catalogue when the order is
 * placed, so a tampered localStorage cannot change what is charged.
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId ? { ...l, qty: Math.min(99, l.qty + qty) } : l
              ),
            };
          }
          return { lines: [...state.lines, { ...line, qty }] };
        }),
      setQty: (productId, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.productId === productId ? { ...l, qty: Math.max(0, Math.min(99, qty)) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (productId) => set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
    }),
    { name: "kahwa-cart" }
  )
);
