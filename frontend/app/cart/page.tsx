"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { apiFetchJson } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function CartPage() {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const currency = items[0]?.currency ?? "INR";

  const [couponCode, setCouponCode] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [couponMsg, setCouponMsg] = React.useState<string | null>(null);
  const [loadingCoupon, setLoadingCoupon] = React.useState(false);
  const [couponApplied, setCouponApplied] = React.useState(false);

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    setLoadingCoupon(true);
    setCouponMsg(null);
    try {
      const res = await apiFetchJson<{ discount: number; coupon: { code: string } }>("/api/coupons/apply", {
        method: "POST",
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      setDiscount(res.discount);
      setCouponMsg(`Coupon "${res.coupon.code}" applied!`);
      setCouponApplied(true);
    } catch (err) {
      setDiscount(0);
      setCouponApplied(false);
      setCouponMsg(err instanceof Error ? err.message : "Invalid coupon");
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <div className="container-x py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Shopping Cart</h1>
          {items.length > 0 ? (
            <p className="mt-0.5 text-sm text-zinc-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          ) : null}
        </div>
        {items.length ? (
          <button
            className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors"
            onClick={clear}
          >
            Clear all
          </button>
        ) : null}
      </div>

      {/* Empty state */}
      {!items.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 py-20 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-zinc-300 mb-4" aria-hidden="true">
            <path d="M6 7h15l-2 10H7L6 7Zm0 0-.8-3H2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          </svg>
          <div className="text-base font-semibold text-zinc-700">Your cart is empty</div>
          <div className="mt-1 text-sm text-zinc-400">Add some products to get started</div>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white no-underline hover:bg-zinc-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div className="grid gap-3">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                {/* Image */}
                <div className="h-22 w-26 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-zinc-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${it.productId}`} className="no-underline">
                        <div className="text-sm font-semibold text-zinc-900 hover:text-amber-700 transition-colors">{it.name}</div>
                      </Link>
                      <div className="mt-1 text-sm text-zinc-500">{formatMoney(it.price, it.currency)} each</div>
                    </div>
                    <button
                      className="text-xs text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                      onClick={() => remove(it.productId)}
                      aria-label={`Remove ${it.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-0 rounded-xl border border-zinc-200 overflow-hidden">
                      <button
                        className="h-8 w-8 grid place-items-center text-zinc-600 hover:bg-zinc-50 transition-colors text-lg font-light"
                        onClick={() => setQuantity(it.productId, it.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <div className="w-10 text-center text-sm font-semibold border-x border-zinc-200 h-8 flex items-center justify-center">
                        {it.quantity}
                      </div>
                      <button
                        className="h-8 w-8 grid place-items-center text-zinc-600 hover:bg-zinc-50 transition-colors text-lg font-light"
                        onClick={() => setQuantity(it.productId, it.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{formatMoney(it.price * it.quantity, it.currency)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div className="text-sm font-bold text-zinc-900">Order Summary</div>
              </CardHeader>
              <CardBody>
                <div className="grid gap-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-500">Subtotal</div>
                    <div className="font-medium">{formatMoney(subtotal, currency)}</div>
                  </div>
                  {discount > 0 ? (
                    <div className="flex items-center justify-between text-emerald-600">
                      <div>Discount</div>
                      <div className="font-medium">-{formatMoney(discount, currency)}</div>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-zinc-500">
                    <div>Shipping</div>
                    <div className="text-emerald-600 font-medium">
                      {subtotal >= 499 ? "Free" : "Calculated at checkout"}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-zinc-100 pt-3">
                    <div className="font-bold text-zinc-900">Total</div>
                    <div className="font-bold text-zinc-900 text-lg">{formatMoney(total, currency)}</div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <div className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Have a coupon?</div>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="uppercase"
                      disabled={couponApplied}
                    />
                    <Button
                      variant="secondary"
                      onClick={applyCoupon}
                      disabled={!couponCode || loadingCoupon || couponApplied}
                      className="shrink-0"
                    >
                      {loadingCoupon ? "…" : "Apply"}
                    </Button>
                  </div>
                  {couponMsg ? (
                    <div className={`mt-2 text-xs font-medium ${couponApplied ? "text-emerald-600" : "text-red-500"}`}>
                      {couponApplied ? "✓ " : "✕ "}{couponMsg}
                    </div>
                  ) : null}
                </div>

                {/* Checkout button */}
                <div className="mt-5">
                  <Link href="/checkout" className="no-underline block">
                    <Button className="w-full py-3 text-sm font-semibold rounded-xl">
                      Proceed to Checkout
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure payment via Razorpay
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Continue shopping */}
            <Link href="/products" className="no-underline text-center text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
