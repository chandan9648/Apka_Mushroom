"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { add } = useCart();
  const image = product.images?.[0];
  const isAdmin = user?.role === "admin";
  const inStock = product.stock > 0;

  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="no-underline relative overflow-hidden">
        <div className="aspect-[4/3] w-full bg-zinc-50 overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discountPct ? (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{discountPct}%
            </span>
          ) : null}
          {!inStock ? (
            <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              Sold Out
            </span>
          ) : null}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.slug}`} className="no-underline flex-1">
          <div className="line-clamp-2 text-sm font-semibold text-zinc-900 leading-snug group-hover:text-amber-700 transition-colors">
            {product.name}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-base font-bold text-zinc-900">{formatMoney(product.price, product.currency)}</div>
            {product.compareAtPrice ? (
              <div className="text-xs text-zinc-400 line-through">
                {formatMoney(product.compareAtPrice, product.currency)}
              </div>
            ) : null}
          </div>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className={`text-xs font-medium ${inStock ? "text-emerald-600" : "text-zinc-400"}`}>
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </div>
          {!isAdmin ? (
            !user ? (
              <Link
                href={`/auth/login?next=${encodeURIComponent(`/products/${product.slug}`)}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 text-white no-underline hover:bg-zinc-700 transition-colors font-medium"
              >
                Add 
              </Link>
            ) : (
              <Button
                onClick={() => add(product, 1)}
                disabled={!inStock}
                className="text-xs px-3 py-1.5 rounded-lg gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 7h15l-2 10H7L6 7Zm0 0-.8-3H2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                </svg>
                Add
              </Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
