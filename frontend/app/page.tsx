import Link from "next/link";
import Image from "next/image";
import { apiFetchJson } from "@/lib/api";
import type { Category, Product, Banner } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import mush from "../public/mush.jpeg";

const trustFeatures = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Lab Tested & Certified",
    desc: "Every batch is independently tested for purity and potency",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Fast Delivery",
    desc: "Get your order delivered quickly across India",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "100% Organic",
    desc: "Sustainably sourced and free from harmful additives",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    title: "Premium Quality",
    desc: "Handpicked mushrooms of the highest grade",
  },
];

export default async function HomePage() {
  const [{ items: featured }, { items: categories }, { items: banners }] = await Promise.all([
    apiFetchJson<{ items: Product[] }>("/api/products/featured", { cache: "no-store" }),
    apiFetchJson<{ items: Category[] }>("/api/categories", { cache: "no-store" }),
    apiFetchJson<{ items: Banner[] }>("/api/banners", { cache: "no-store" }),
  ]);

  return (
    <div>
      {/* ── Hero ── */}
      <section>
        <div className="relative h-[100vh] min-h-[480px] w-full overflow-hidden bg-zinc-100">
          {banners.length > 0 ? (
            <HeroCarousel banners={banners} />
          ) : (
            <Image
              src={mush}
              alt="Mushrooms hero"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

          {/* Hero content */}
          <div className="container-x absolute inset-0 flex items-center">
            <div className="max-w-lg px-2 sm:px-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-medium text-amber-300 mb-5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                100% Organic Mushrooms
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Embrace the{" "}
                <span className="text-amber-400">Superfood</span>{" "}
                Revolution
              </h1>
              <p className="mt-4 text-base text-zinc-300 sm:text-lg max-w-sm">
                Harness the Power of Nature&apos;s Finest Fungi — premium quality direct to your door.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-zinc-900 no-underline hover:bg-amber-300 transition-colors shadow-lg"
                >
                  Shop Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/#our-story"
                  className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white no-underline hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust features strip ── */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="container-x py-10">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {trustFeatures.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:text-left sm:gap-4">
                <div className="shrink-0 grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{f.title}</div>
                  <div className="mt-0.5 text-xs text-zinc-500 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Handpicked for you</p>
            <h2 className="text-2xl font-bold text-zinc-900">Featured Products</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 no-underline transition-colors shrink-0"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-zinc-50 border-t border-zinc-100">
        <div className="container-x py-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Browse by category</p>
            <h2 className="text-2xl font-bold text-zinc-900">Shop Categories</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c._id} href={`/products?category=${encodeURIComponent(c.slug)}`} className="no-underline group">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 group-hover:text-amber-700 transition-colors">{c.name}</div>
                      <div className="mt-0.5 text-xs text-zinc-500 line-clamp-1">{c.description || "Browse products"}</div>
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-zinc-900 text-white">
        <div className="container-x py-14 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to start your wellness journey?</h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
            Discover our full range of premium mushroom products and find what works best for you.
          </p>
          <div className="mt-7">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-zinc-900 no-underline hover:bg-amber-300 transition-colors shadow-lg"
            >
              Explore All Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
