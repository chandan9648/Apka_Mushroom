import Link from "next/link";
import { apiFetchJson } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ReviewForm } from "@/components/ReviewForm";

type Props = {
  params: { slug: string };
};

type Review = {
  _id: string;
  rating: number;
  title?: string;
  comment?: string;
  user?: { name: string };
  createdAt: string;
};

export default async function ProductPage({ params }: Props) {
  const { product } = await apiFetchJson<{ product: Product }>(`/api/products/${encodeURIComponent(params.slug)}`,
  {
    cache: "no-store",
  });

  const [recs, reviews] = await Promise.all([
    apiFetchJson<{ items: Product[] }>(`/api/recommendations?productId=${encodeURIComponent(product._id)}`, {
      cache: "no-store",
    }),
    apiFetchJson<{ items: Review[] }>(`/api/reviews?productId=${encodeURIComponent(product._id)}`, { cache: "no-store" }),
  ]);

  const image = product.images?.[0];
  const currency = product.currency ?? "INR";
  const categoryName = typeof product.category === "string" ? "" : product.category?.name;
  const categorySlug = typeof product.category === "string" ? "" : product.category?.slug;

  return (
    <div className="container-x py-10">
      <div className="mb-6 text-sm text-zinc-600">
        <Link href="/products" className="hover:text-zinc-900">
          Products
        </Link>
        {categoryName && categorySlug ? (
          <>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${encodeURIComponent(categorySlug)}`} className="hover:text-zinc-900">
              {categoryName}
            </Link>
          </>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="aspect-[4/3] bg-zinc-50">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-zinc-500">No image</div>
            )}
          </div>
        </Card>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-xl font-semibold">{formatMoney(product.price, currency)}</div>
            {product.compareAtPrice ? (
              <div className="text-sm text-zinc-500 line-through">{formatMoney(product.compareAtPrice, currency)}</div>
            ) : null}
          </div>
          <div className="mt-2 text-sm text-zinc-600">Stock: {product.stock}</div>

          <div className="mt-6 flex gap-3">
            <AddToCartButton product={product} />
            <Link href="/cart" className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 no-underline hover:bg-zinc-50">
              Go to cart
            </Link>
          </div>

          {product.description ? (
            <div className="mt-8">
              <h2 className="text-sm font-semibold">Description</h2>
              <p className="mt-2 text-sm text-zinc-700 whitespace-pre-line">{product.description}</p>
            </div>
          ) : null}

          {product.benefits?.length ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold">Benefits</h2>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
                {product.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.nutrition ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold">Nutrition</h2>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-zinc-700">
                {Object.entries(product.nutrition)
                  .filter(([, v]) => typeof v === "number")
                  .map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                      <div className="capitalize text-zinc-600">{k}</div>
                      <div className="font-medium">{String(v)}</div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Reviews</div>
          </CardHeader>
          <CardBody>
            {reviews.items.length ? (
              <div className="grid gap-4">
                {reviews.items.map((r) => (
                  <div key={r._id} className="rounded-lg border border-zinc-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{r.title || "Review"}</div>
                      <div className="text-sm text-zinc-600">{r.rating}/5</div>
                    </div>
                    {r.comment ? <div className="mt-2 text-sm text-zinc-700">{r.comment}</div> : null}
                    <div className="mt-2 text-xs text-zinc-500">
                      {r.user?.name ? `${r.user.name} • ` : ""}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-zinc-600">No reviews yet.</div>
            )}

            <div className="mt-6">
              <div className="text-sm font-semibold">Leave a review</div>
              <ReviewForm productId={product._id} />
            </div>
          </CardBody>
        </Card>

        <div>
          <div className="flex items-end justify-between">
            <div className="text-sm font-semibold">You may also like</div>
            <Link href="/products" className="text-sm text-zinc-600 hover:text-zinc-900">
              Browse
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recs.items.map((x) => (
              <ProductCard key={x._id} product={x} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
