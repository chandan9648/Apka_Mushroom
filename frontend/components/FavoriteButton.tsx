"use client";

import { useFavorites } from "@/components/providers/FavoritesProvider";
import type { Product } from "@/lib/types";

export function FavoriteButton({ product, className }: { product: Product; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product._id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
      }}
      className={`grid place-items-center rounded-full transition-all duration-300 hover-lift ${
        favorite ? "bg-amber-100 text-red-500 shadow-sm" : "bg-white text-zinc-400 hover:text-red-500 border border-zinc-200"
      } ${className ?? "h-10 w-10"}`}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={favorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={favorite ? "scale-110 transition-transform" : "transition-transform"}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
