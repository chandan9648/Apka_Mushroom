import Link from "next/link";
import Image from "next/image";
import { apiFetchJson } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardBody } from "@/components/ui/Card";
// import heroFallback from "../public/mushroom.jpg";
import mush from "../public/mush.jpeg";

export default async function HomePage() {
	const [{ items: featured }, { items: categories }] = await Promise.all([
		apiFetchJson<{ items: Product[] }>("/api/products/featured", { cache: "no-store" }),
		apiFetchJson<{ items: Category[] }>("/api/categories", { cache: "no-store" }),
	]);

	const heroImage = featured?.[0]?.images?.[0] ?? null;

	return (
		<div>
			<section className="border-b border-zinc-200 bg-amber-50">
				<div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden border border-black/10 bg-zinc-100">
					{heroImage ? (
						<img
							src={heroImage}
							alt="Featured mushrooms"
							className="absolute inset-0 h-full w-full "
						/>
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
					<div className="absolute inset-0 bg-black/45" />

					<div className="container-x absolute inset-0">
						<div className="flex h-full items-start px-6 pt-10 sm:px-10 sm:pt-14">
							<div className="max-w-xl rounded-2xl bg-zinc-900/70 p-6 sm:p-8">
								<h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
									Embrace the
									<br />
									Superfood
									<br />
									Revolution
								</h1>
								<p className="mt-4 text-sm text-zinc-200 sm:text-base">
									Harness the Power of Nature&apos;s Finest Fungi
								</p>
								<div className="mt-6">
									<Link
										href="/products"
										className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-white px-8 py-3 text-sm font-semibold text-zinc-900 no-underline hover:bg-zinc-100"
									>
										Shop Now
									</Link>
								</div>
							</div>
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
