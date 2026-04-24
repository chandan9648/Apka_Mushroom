"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

type FavoritesContextType = {
  favorites: Product[];
  count: number;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("rb_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites from local storage", e);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Product[]) => {
    setFavorites(newFavorites);
    localStorage.setItem("rb_favorites", JSON.stringify(newFavorites));
  };

  const addFavorite = (product: Product) => {
    const existing = favorites.find((p) => p._id === product._id);
    if (!existing) {
      saveFavorites([...favorites, product]);
    }
  };

  const removeFavorite = (productId: string) => {
    saveFavorites(favorites.filter((p) => p._id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p._id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product._id)) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: isMounted ? favorites : [],
        count: isMounted ? favorites.length : 0,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
