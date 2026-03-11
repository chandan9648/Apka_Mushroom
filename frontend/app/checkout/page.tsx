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

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
        {label}
        {required ? <span className="text-red-400 ml-0.5">*</span> : <span className="ml-1 text-zinc-400 font-normal">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

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
    <div className="container-x py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Checkout</h1>
        <p className="mt-0.5 text-sm text-zinc-500">Fill in your delivery details to complete your order</p>
      </div>

      {/* Steps indicator */}
      <div className="mb-6 flex items-center gap-2 text-xs font-medium">
        <span className="flex items-center gap-1.5 text-zinc-400 line-through">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white text-[9px] font-bold">✓</span>
          Cart
        </span>
        <span className="text-zinc-300">—</span>
        <span className="flex items-center gap-1.5 text-zinc-900">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-white text-[9px] font-bold">2</span>
          Delivery
        </span>
        <span className="text-zinc-300">—</span>
        <span className="flex items-center gap-1.5 text-zinc-400">
          <span className="grid h-5 w-5 place-items-center rounded-full border border-zinc-300 text-zinc-400 text-[9px] font-bold">3</span>
          Payment
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Shipping form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500" aria-hidden="true">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <circle cx="12" cy="11" r="3" />
              </svg>
              <div className="text-sm font-bold text-zinc-900">Delivery Address</div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={placeOrder} className="grid gap-4" id="checkout-form">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full name" required>
                  <Input
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                </FormField>
                <FormField label="Phone number" required>
                  <Input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    autoComplete="tel"
                    type="tel"
                  />
                </FormField>
              </div>

              <FormField label="Address line 1" required>
                <Input
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="House no., Street, Area"
                  required
                  autoComplete="address-line1"
                />
              </FormField>

              <FormField label="Address line 2">
                <Input
                  value={address.line2 || ""}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  placeholder="Landmark, Floor, etc."
                  autoComplete="address-line2"
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="City" required>
                  <Input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Mumbai"
                    required
                    autoComplete="address-level2"
                  />
                </FormField>
                <FormField label="State" required>
                  <Input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Maharashtra"
                    required
                    autoComplete="address-level1"
                  />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Postal code" required>
                  <Input
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="400001"
                    required
                    autoComplete="postal-code"
                  />
                </FormField>
                <FormField label="Country" required>
                  <Input
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    required
                    autoComplete="country"
                  />
                </FormField>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <FormField label="Coupon code">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="uppercase"
                  />
                </FormField>
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              ) : null}

              <Button
                disabled={loading}
                className="w-full py-3 text-sm font-semibold rounded-xl mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Opening payment…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Pay with Razorpay
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secured by Razorpay
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Order summary */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <div className="text-sm font-bold text-zinc-900">Order Summary</div>
            </CardHeader>
            <CardBody>
              <div className="grid gap-3 text-sm">
                {items.map((it) => (
                  <div key={it.productId} className="flex items-start justify-between gap-3">
                    <div className="text-zinc-600 line-clamp-1 flex-1">
                      {it.name}
                      <span className="text-zinc-400"> ×{it.quantity}</span>
                    </div>
                    <div className="font-medium text-zinc-900 shrink-0">{formatMoney(it.price * it.quantity, it.currency)}</div>
                  </div>
                ))}

                <div className="mt-1 border-t border-zinc-100 pt-3 flex items-center justify-between">
                  <div className="font-bold text-zinc-900">Total</div>
                  <div className="font-bold text-lg text-zinc-900">{formatMoney(subtotal, currency)}</div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Trust signals */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4">
            <div className="grid gap-2.5">
              {[
                { icon: "🔒", text: "Secure 256-bit SSL encryption" },
                { icon: "↩", text: "Easy returns within 7 days" },
                { icon: "🚚", text: "Fast delivery across India" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2.5 text-xs text-zinc-500">
                  <span>{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
