"use client";

import Link from "next/link";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { ProductCard } from "@/components/ProductCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container-x py-14 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">Your Favorites</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-20 px-4 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-500 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">No favorites yet</h2>
          <p className="mt-2 text-sm text-zinc-500 mb-6 max-w-sm">
            You haven&apos;t added any products to your favorites. Explore our catalog and discover nature&apos;s finest fungi!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white no-underline hover:bg-zinc-700 transition-colors shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
