"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { apiFetchJson } from "@/lib/api";
import type { Order, User } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

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
    <div className="container-x py-10">
      <h1 className="text-2xl font-semibold">Account</h1>

      {loading ? <div className="mt-6 text-sm text-zinc-600">Loading…</div> : null}
      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <div className="mt-2">
            <button className="text-sm underline" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card>
            <CardHeader>
              <div className="text-sm font-semibold">Profile</div>
            </CardHeader>
            <CardBody>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Name</div>
                  <div className="font-medium">{me?.name}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Email</div>
                  <div className="font-medium">{me?.email}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Role</div>
                  <div className="font-medium">{me?.role}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Verified</div>
                  <div className="font-medium">{me?.isEmailVerified ? "Yes" : "No"}</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold">My orders</div>
            </CardHeader>
            <CardBody>
              {orders.length ? (
                <div className="grid gap-3">
                  {orders.map((o) => (
                    <div key={o._id} className="rounded-lg border border-zinc-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">Order</div>
                        <div className="text-xs text-zinc-600">{new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="mt-2 text-sm text-zinc-700">Status: {o.status}</div>
                      <div className="mt-2 text-sm text-zinc-700">
                        Total: <span className="font-semibold">{formatMoney(o.total, "INR")}</span>
                      </div>
                      <div className="mt-2 text-xs text-zinc-500 line-clamp-2">
                        {o.items.map((it) => `${it.name}×${it.quantity}`).join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-zinc-600">No orders yet.</div>
              )}
            </CardBody>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
