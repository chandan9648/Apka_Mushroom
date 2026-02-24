"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <Button onClick={() => add(product, 1)} disabled={product.stock <= 0}>
      {product.stock > 0 ? "Add to cart" : "Out of stock"}
    </Button>
  );
}
