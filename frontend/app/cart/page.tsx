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
      setCouponMsg(`Applied ${res.coupon.code}`);
    } catch (err) {
      setDiscount(0);
      setCouponMsg(err instanceof Error ? err.message : "Invalid coupon");
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <div className="container-x py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Cart</h1>
        {items.length ? (
          <button className="text-sm text-zinc-600 hover:text-zinc-900" onClick={clear}>
            Clear
          </button>
        ) : null}
      </div>

      {!items.length ? (
        <div className="mt-8">
          <Card>
            <CardBody>
              <div className="text-sm text-zinc-600">Your cart is empty.</div>
              <div className="mt-4">
                <Link href="/products" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white no-underline">
                  Browse products
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3">
            {items.map((it) => (
              <Card key={it.productId}>
                <CardBody>
                  <div className="flex gap-4">
                    <div className="h-20 w-24 overflow-hidden rounded-lg bg-zinc-50">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-zinc-500">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{it.name}</div>
                          <div className="mt-1 text-sm text-zinc-600">{formatMoney(it.price, it.currency)}</div>
                        </div>
                        <button className="text-sm text-zinc-600 hover:text-zinc-900" onClick={() => remove(it.productId)}>
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="h-9 w-9 rounded-lg border border-zinc-200 hover:bg-zinc-50"
                            onClick={() => setQuantity(it.productId, it.quantity - 1)}
                          >
                            −
                          </button>
                          <div className="w-10 text-center text-sm">{it.quantity}</div>
                          <button
                            className="h-9 w-9 rounded-lg border border-zinc-200 hover:bg-zinc-50"
                            onClick={() => setQuantity(it.productId, it.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-medium">{formatMoney(it.price * it.quantity, it.currency)}</div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold">Summary</div>
            </CardHeader>
            <CardBody>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Subtotal</div>
                  <div>{formatMoney(subtotal, currency)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Discount</div>
                  <div>-{formatMoney(discount, currency)}</div>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2">
                  <div className="font-semibold">Total</div>
                  <div className="font-semibold">{formatMoney(total, currency)}</div>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <div className="text-sm font-semibold">Coupon</div>
                <div className="flex gap-2">
                  <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Code" />
                  <Button variant="secondary" onClick={applyCoupon} disabled={!couponCode || loadingCoupon}>
                    Apply
                  </Button>
                </div>
                {couponMsg ? <div className="text-xs text-zinc-600">{couponMsg}</div> : null}
              </div>

              <div className="mt-6">
                <Link href="/checkout" className="no-underline">
                  <Button className="w-full">Checkout</Button>
                </Link>
                <div className="mt-2 text-xs text-zinc-500">Payment handled via Razorpay.</div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
