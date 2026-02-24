"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const image = product.images?.[0];

  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.slug}`} className="no-underline">
        <div className="aspect-[4/3] w-full bg-zinc-50">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-zinc-500">No image</div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="no-underline">
          <div className="line-clamp-1 text-sm font-semibold text-zinc-900">{product.name}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-sm font-medium">{formatMoney(product.price, product.currency)}</div>
            {product.compareAtPrice ? (
              <div className="text-xs text-zinc-500 line-through">
                {formatMoney(product.compareAtPrice, product.currency)}
              </div>
            ) : null}
          </div>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-xs text-zinc-500">Stock: {product.stock}</div>
          <Button onClick={() => add(product, 1)} disabled={product.stock <= 0}>
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
