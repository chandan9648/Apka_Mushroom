"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const { add } = useCart();

  if (user?.role === "admin") return null;

  const inStock = product.stock > 0;

  return (
    <Button
      onClick={() => add(product, 1)}
      disabled={!inStock}
      className="py-2.5 px-6 rounded-xl text-sm font-semibold gap-2"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 7h15l-2 10H7L6 7Zm0 0-.8-3H2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      {inStock ? "Add to cart" : "Out of stock"}
    </Button>
  );
}
