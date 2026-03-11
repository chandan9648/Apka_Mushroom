import { apiFetchJson } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = searchParams ?? {};
  const page = typeof sp.page === "string" ? sp.page : "1";
  const category = typeof sp.category === "string" ? sp.category : undefined;

  const qs = new URLSearchParams();
  qs.set("page", page);
  qs.set("limit", "12");
  if (category) qs.set("category", category);

  const res = await apiFetchJson<{ items: Product[]; meta: { page: number; pages: number } }>(
    `/api/products?${qs.toString()}`,
    { cache: "no-store" }
  );

  const currentPage = res.meta.page;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < res.meta.pages;

  const buildHref = (nextPage: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (k === "page") continue;
      if (typeof v === "string") p.set(k, v);
    }
    p.set("page", String(nextPage));
    return `/products?${p.toString()}`;
  };

  return (
    <div className="container-x py-12">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
            {category ? "Category" : "All Products"}
          </p>
          <h1 className="text-2xl font-bold text-zinc-900">
            {category ? category : "Shop"}
          </h1>
        </div>
        {category ? (
          <Link
            href="/products"
            className="text-sm text-zinc-500 hover:text-zinc-900 no-underline transition-colors"
          >
            Clear filter ×
          </Link>
        ) : null}
      </div>

      {/* Product grid */}
      {res.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {res.items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 py-20 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 mb-4" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <div className="text-sm font-semibold text-zinc-600">No products found</div>
          <div className="mt-1 text-xs text-zinc-400">Try a different category or check back later</div>
          <Link href="/products" className="mt-5 inline-flex rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white no-underline hover:bg-zinc-700 transition-colors">
            View all products
          </Link>
        </div>
      )}

      {/* Pagination */}
      {res.meta.pages > 1 ? (
        <div className="mt-10 flex items-center justify-between gap-4">
          <a
            href={hasPrev ? buildHref(currentPage - 1) : undefined}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium no-underline transition-colors ${
              hasPrev
                ? "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm"
                : "border-zinc-100 bg-zinc-50 text-zinc-300 pointer-events-none"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </a>

          <div className="text-sm text-zinc-500">
            Page <span className="font-semibold text-zinc-900">{currentPage}</span> of{" "}
            <span className="font-semibold text-zinc-900">{res.meta.pages}</span>
          </div>

          <a
            href={hasNext ? buildHref(currentPage + 1) : undefined}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium no-underline transition-colors ${
              hasNext
                ? "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm"
                : "border-zinc-100 bg-zinc-50 text-zinc-300 pointer-events-none"
            }`}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
      ) : null}
    </div>
  );
}
