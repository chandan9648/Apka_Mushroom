import Link from "next/link";
import { apiFetchJson } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ReviewForm } from "@/components/ReviewForm";

type Props = {
  params: Promise<{ slug: string }>;
};

type Review = {
  _id: string;
  rating: number;
  title?: string;
  comment?: string;
  user?: { name: string };
  createdAt: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={n <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={n <= rating ? "text-amber-400" : "text-zinc-300"}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { product } = await apiFetchJson<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`,
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
  const inStock = product.stock > 0;
  const avgRating = reviews.items.length
    ? Math.round(reviews.items.reduce((s, r) => s + r.rating, 0) / reviews.items.length)
    : null;

  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="container-x py-10">
      {/* Breadcrumb */}
      <nav className="mb-7 flex items-center gap-1.5 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/products" className="hover:text-zinc-900 transition-colors">
          Products
        </Link>
        {categoryName && categorySlug ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <Link href={`/products?category=${encodeURIComponent(categorySlug)}`} className="hover:text-zinc-900 transition-colors">
              {categoryName}
            </Link>
          </>
        ) : null}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-zinc-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Product top section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm">
          <div className="aspect-[4/3]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-zinc-400">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Category badge */}
          {categoryName ? (
            <Link
              href={categorySlug ? `/products?category=${encodeURIComponent(categorySlug)}` : "/products"}
              className="no-underline inline-block mb-3"
            >
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-xs font-semibold text-amber-700">
                {categoryName}
              </span>
            </Link>
          ) : null}

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{product.name}</h1>

          {/* Rating summary */}
          {avgRating !== null ? (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={avgRating} />
              <span className="text-xs text-zinc-500">{reviews.items.length} review{reviews.items.length !== 1 ? "s" : ""}</span>
            </div>
          ) : null}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-2xl font-bold text-zinc-900">{formatMoney(product.price, currency)}</div>
            {product.compareAtPrice ? (
              <>
                <div className="text-sm text-zinc-400 line-through">{formatMoney(product.compareAtPrice, currency)}</div>
                {discountPct ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                    -{discountPct}%
                  </span>
                ) : null}
              </>
            ) : null}
          </div>

          {/* Stock status */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-zinc-400"}`} />
            <span className={`text-xs font-medium ${inStock ? "text-emerald-600" : "text-zinc-500"}`}>
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 no-underline hover:bg-zinc-50 hover:border-zinc-300 shadow-sm transition-colors"
            >
              View cart
            </Link>
          </div>

          {/* Description */}
          {product.description ? (
            <div className="mt-8 border-t border-zinc-100 pt-6">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">Description</h2>
              <p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>
          ) : null}

          {/* Benefits */}
          {product.benefits?.length ? (
            <div className="mt-6 border-t border-zinc-100 pt-6">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">Benefits</h2>
              <ul className="grid gap-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <span className="mt-0.5 shrink-0 text-amber-500">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Nutrition */}
          {product.nutrition ? (
            <div className="mt-6 border-t border-zinc-100 pt-6">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">Nutrition Info</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.nutrition)
                  .filter(([, v]) => typeof v === "number")
                  .map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                      <div className="capitalize text-zinc-500 text-xs">{k}</div>
                      <div className="font-semibold text-zinc-900 text-sm">{String(v)}</div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Reviews + Recommendations */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-zinc-900">
                Customer Reviews
              </div>
              {reviews.items.length > 0 ? (
                <div className="flex items-center gap-1.5">
                  <StarRating rating={avgRating ?? 0} />
                  <span className="text-xs text-zinc-500">{reviews.items.length} review{reviews.items.length !== 1 ? "s" : ""}</span>
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardBody>
            {reviews.items.length ? (
              <div className="grid gap-3">
                {reviews.items.map((r) => (
                  <div key={r._id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                          {r.user?.name ? r.user.name[0].toUpperCase() : "?"}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900">{r.user?.name || "Anonymous"}</div>
                          <div className="text-xs text-zinc-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    {r.title ? (
                      <div className="mt-2.5 text-sm font-semibold text-zinc-800">{r.title}</div>
                    ) : null}
                    {r.comment ? (
                      <div className="mt-1.5 text-sm text-zinc-600 leading-relaxed">{r.comment}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">★</div>
                <div className="text-sm font-medium text-zinc-600">No reviews yet</div>
                <div className="text-xs text-zinc-400 mt-1">Be the first to review this product</div>
              </div>
            )}

            <div className="mt-6 border-t border-zinc-100 pt-5">
              <div className="text-sm font-bold text-zinc-900 mb-1">Leave a review</div>
              <ReviewForm productId={product._id} />
            </div>
          </CardBody>
        </Card>

        {/* Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-bold text-zinc-900">You may also like</div>
            <Link href="/products" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 no-underline transition-colors">
              Browse all →
            </Link>
          </div>
          {recs.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recs.items.map((x) => (
                <ProductCard key={x._id} product={x} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 py-12 text-center text-sm text-zinc-400">
              No recommendations yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
