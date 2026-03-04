"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const { add } = useCart();

  if (user?.role === "admin") return null;

  return (
    <Button onClick={() => add(product, 1)} disabled={product.stock <= 0}>
      {product.stock > 0 ? "Add to cart" : "Out of stock"}
    </Button>
  );
}
