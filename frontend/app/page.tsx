import Link from "next/link";
import { apiFetchJson } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardBody } from "@/components/ui/Card";

export default async function HomePage() {
	const [{ items: featured }, { items: categories }] = await Promise.all([
		apiFetchJson<{ items: Product[] }>("/api/products/featured", { cache: "no-store" }),
		apiFetchJson<{ items: Category[] }>("/api/categories", { cache: "no-store" }),
	]);

	return (
		<div>
			<section className="border-b border-zinc-200 bg-zinc-50">
				<div className="container-x py-10">
					<div className="max-w-2xl">
						<h1 className="text-3xl font-semibold tracking-tight">Fresh mushrooms, delivered.</h1>
						<p className="mt-3 text-zinc-600">
							Browse featured products, add to cart, and checkout via Razorpay using the existing API.
						</p>
						<div className="mt-6 flex gap-3">
							<Link href="/products" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white no-underline">
								Shop products
							</Link>
							<Link href="/cart" className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 no-underline">
								View cart
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="container-x py-10">
				<div className="flex items-end justify-between gap-4">
					<h2 className="text-lg font-semibold">Featured</h2>
					<Link href="/products" className="text-sm text-zinc-600 hover:text-zinc-900">
						View all
					</Link>
				</div>
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{featured.map((p) => (
						<ProductCard key={p._id} product={p} />
					))}
				</div>
			</section>

			<section className="container-x pb-12">
				<h2 className="text-lg font-semibold">Categories</h2>
				<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((c) => (
						<Link key={c._id} href={`/products?category=${encodeURIComponent(c.slug)}`} className="no-underline">
							<Card className="hover:bg-zinc-50">
								<CardBody>
									<div className="text-sm font-semibold">{c.name}</div>
									<div className="mt-1 text-sm text-zinc-600 line-clamp-2">{c.description || "Browse products"}</div>
								</CardBody>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
