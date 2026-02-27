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
				<div className="container-x py-8">
					<div className="grid grid-cols-1 overflow-hidden border border-black/10 bg-white lg:grid-cols-2">
						<div className="relative bg-zinc-100">
							<div className="aspect-[4/3] w-full lg:aspect-auto lg:h-full">
								{heroImage ? (
									
									<img src={heroImage} alt="Featured mushrooms" className="h-full w-full object-cover" />
								) : (
									<Image
										src={mush}
										alt="Mushrooms hero"
										className="h-full w-full "
										priority
										sizes="(min-width: 1024px) 50vw, 100vw"
									/>
								)}
							</div>
						</div>

						<div className="bg-zinc-900">
							<div className="flex h-full flex-col justify-center px-6 py-10 sm:px-10">
								<div className="max-w-xl">
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
