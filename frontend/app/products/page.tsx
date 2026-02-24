import { apiFetchJson } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

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
    <div className="container-x py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          {category ? <div className="mt-1 text-sm text-zinc-600">Category: {category}</div> : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {res.items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-sm">
        <a
          className={`no-underline ${hasPrev ? "text-zinc-900 hover:underline" : "text-zinc-400 pointer-events-none"}`}
          href={buildHref(currentPage - 1)}
        >
          ← Previous
        </a>
        <div className="text-zinc-600">
          Page {currentPage} of {res.meta.pages}
        </div>
        <a
          className={`no-underline ${hasNext ? "text-zinc-900 hover:underline" : "text-zinc-400 pointer-events-none"}`}
          href={buildHref(currentPage + 1)}
        >
          Next →
        </a>
      </div>
    </div>
  );
}
