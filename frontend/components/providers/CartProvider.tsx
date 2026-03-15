"use client";

import * as React from "react";
import type { Product } from "@/lib/types";
import { useAuth } from "@/components/providers/AuthProvider";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  currency?: string;
  image?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const LS_KEY_PREFIX = "ApkaMushroom_cart_v1";

function getUserCartKey(userId: string) {
  return `${LS_KEY_PREFIX}_${userId}`;
}

function loadCart(userId: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getUserCartKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCart(userId: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getUserCartKey(userId), JSON.stringify(items));
}

function clearCart(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getUserCartKey(userId));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const [items, setItems] = React.useState<CartItem[]>([]);

  React.useEffect(() => {
    if (!ready) return;
    if (!user) {
      setItems([]);
      return;
    }
    setItems(loadCart(user.id));
  }, [ready, user]);

  React.useEffect(() => {
    if (!ready || !user) return;
    saveCart(user.id, items);
  }, [items, ready, user]);

  const add = React.useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.productId === product._id);
      if (existing) {
        return prev.map((x) => (x.productId === product._id ? { ...x, quantity: x.quantity + quantity } : x));
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.images?.[0],
          quantity,
        },
      ];
    });
  }, []);

  const remove = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const setQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((x) => (x.productId === productId ? { ...x, quantity } : x))
        .filter((x) => x.quantity > 0)
    );
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
    if (user) clearCart(user.id);
  }, [user]);

  const count = items.reduce((sum, x) => sum + x.quantity, 0);
  const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);

  const value: CartContextValue = { items, count, subtotal, add, remove, setQuantity, clear };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
