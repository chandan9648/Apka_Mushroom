"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { apiFetchJson } from "@/lib/api";
import { loadRazorpay } from "@/lib/razorpay";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, accessToken, ready } = useAuth();
  const { items, subtotal, clear } = useCart();

  const currency = items[0]?.currency ?? "INR";

  const [couponCode, setCouponCode] = React.useState("");
  const [address, setAddress] = React.useState<Address>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`);
    }
  }, [user, ready, router]);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!accessToken) throw new Error("Not authenticated");
      if (!items.length) throw new Error("Cart is empty");

      const createRes = await apiFetchJson<{
        order: { _id: string };
        razorpay: { keyId: string; orderId: string; amount: number; currency: string };
      }>("/api/orders", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({
          items: items.map((x) => ({ productId: x.productId, quantity: x.quantity })),
          address,
          couponCode: couponCode || undefined,
        }),
      });

      await loadRazorpay();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RazorpayCtor = (window as any).Razorpay as undefined | (new (opts: any) => { open: () => void });
      if (!RazorpayCtor) throw new Error("Razorpay not available");

      const rzp = new RazorpayCtor({
        key: createRes.razorpay.keyId,
        amount: createRes.razorpay.amount,
        currency: createRes.razorpay.currency,
        name: "ApkaMushroom",
        description: "Order payment",
        order_id: createRes.razorpay.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await apiFetchJson("/api/orders/verify-razorpay", {
              method: "POST",
              token: accessToken,
              body: JSON.stringify({
                orderId: createRes.order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            clear();
            router.push("/account");
          } catch (err) {
            setError(authErrorMessage(err));
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: address.phone,
        },
      });

      rzp.open();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Shipping address</div>
          </CardHeader>
          <CardBody>
            <form onSubmit={placeOrder} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <div className="mb-1 text-zinc-600">Full name</div>
                  <Input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required />
                </label>
                <label className="text-sm">
                  <div className="mb-1 text-zinc-600">Phone</div>
                  <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                </label>
              </div>

              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Address line 1</div>
                <Input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Address line 2</div>
                <Input value={address.line2 || ""} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <div className="mb-1 text-zinc-600">City</div>
                  <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                </label>
                <label className="text-sm">
                  <div className="mb-1 text-zinc-600">State</div>
                  <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <div className="mb-1 text-zinc-600">Postal code</div>
                  <Input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required />
                </label>
                <label className="text-sm">
                  <div className="mb-1 text-zinc-600">Country</div>
                  <Input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
                </label>
              </div>

              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Coupon (optional)</div>
                <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="CODE" />
              </label>

              {error ? <div className="text-sm text-red-600">{error}</div> : null}

              <Button disabled={loading}>{loading ? "Opening payment…" : "Pay with Razorpay"}</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Order summary</div>
          </CardHeader>
          <CardBody>
            <div className="grid gap-2 text-sm">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between gap-3">
                  <div className="text-zinc-600 line-clamp-1">
                    {it.name} × {it.quantity}
                  </div>
                  <div>{formatMoney(it.price * it.quantity, it.currency)}</div>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2">
                <div className="font-semibold">Subtotal</div>
                <div className="font-semibold">{formatMoney(subtotal, currency)}</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
