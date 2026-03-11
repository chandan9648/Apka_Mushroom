"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { apiFetchJson } from "@/lib/api";
import type { Order, User } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, accessToken, ready, logout } = useAuth();

  const [me, setMe] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent("/account")}`);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!accessToken) throw new Error("Not authenticated");
        const [meRes, ordersRes] = await Promise.all([
          apiFetchJson<{ user: User }>("/api/auth/me", { token: accessToken, cache: "no-store" }),
          apiFetchJson<{ items: Order[] }>("/api/orders/my", { token: accessToken, cache: "no-store" }),
        ]);
        setMe(meRes.user);
        setOrders(ordersRes.items);
      } catch (err) {
        setError(authErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [ready, user, accessToken, router]);

  return (
    <div className="container-x py-12">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Account</h1>
          {me ? <p className="mt-0.5 text-sm text-zinc-500">Welcome back, {me.name}</p> : null}
        </div>
        <button
          onClick={logout}
          className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-zinc-400">
          <svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading your account…
        </div>
      ) : null}

      {/* Error state */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <div className="font-medium">{error}</div>
          <button className="mt-2 text-xs underline text-red-600" onClick={logout}>
            Log out and try again
          </button>
        </div>
      ) : null}

      {/* Content */}
      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Profile card */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardBody>
                {/* Avatar */}
                <div className="flex flex-col items-center text-center pb-5 border-b border-zinc-100">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-400 text-zinc-900 text-xl font-bold shadow-sm mb-3">
                    {me?.name ? me.name[0].toUpperCase() : "?"}
                  </div>
                  <div className="text-base font-bold text-zinc-900">{me?.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{me?.email}</div>
                  {me?.isEmailVerified ? (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </div>
                  ) : (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                      Not verified
                    </div>
                  )}
                </div>

                {/* Profile details */}
                <div className="mt-5 grid gap-3 text-sm">
                  {[
                    { label: "Full name", value: me?.name },
                    { label: "Email", value: me?.email },
                    { label: "Role", value: me?.role && me.role.charAt(0).toUpperCase() + me.role.slice(1) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-3">
                      <div className="text-xs text-zinc-400 font-medium">{item.label}</div>
                      <div className="text-xs font-semibold text-zinc-800 text-right">{item.value ?? "—"}</div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Stats */}
            <Card>
              <CardBody>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-zinc-900">{orders.length}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Total Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-900">
                      {orders.filter(o => o.status === "delivered").length}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">Delivered</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-zinc-900">My Orders</div>
                <div className="text-xs text-zinc-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</div>
              </div>
            </CardHeader>
            <CardBody>
              {orders.length ? (
                <div className="grid gap-3">
                  {orders.map((o, idx) => (
                    <div key={o._id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-zinc-900">
                            Order #{String(orders.length - idx).padStart(3, "0")}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusColors[o.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                            {o.status}
                          </span>
                          <span className="text-sm font-bold text-zinc-900">{formatMoney(o.total, "INR")}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-zinc-500 line-clamp-1">
                        {o.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-zinc-300 mb-3" aria-hidden="true">
                    <path d="M6 7h15l-2 10H7L6 7Zm0 0-.8-3H2" />
                    <circle cx="9" cy="21" r="1" /><circle cx="17" cy="21" r="1" />
                  </svg>
                  <div className="text-sm font-semibold text-zinc-600">No orders yet</div>
                  <div className="text-xs text-zinc-400 mt-1">Start shopping to see your orders here</div>
                  <a
                    href="/products"
                    className="mt-5 inline-flex rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white no-underline hover:bg-zinc-700 transition-colors"
                  >
                    Browse Products
                  </a>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
