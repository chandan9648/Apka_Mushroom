"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { apiFetchJson, ApiError } from "@/lib/api";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type AdminStats = { users: number; products: number; orders: number };

function formatCount(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-100 ${className}`} />;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="overflow-hidden">
      <CardBody>
        <div className="text-xs font-medium text-zinc-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{formatCount(value)}</div>
      </CardBody>
    </Card>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, accessToken, ready, logout } = useAuth();

  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadUrl, setUploadUrl] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent("/admin")}`);
      return;
    }

    if (user.role !== "admin") {
      setLoading(false);
      setError("Admin access required");
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!accessToken) throw new Error("Not authenticated");
        const res = await apiFetchJson<AdminStats>("/api/admin/stats", { token: accessToken, cache: "no-store" });
        setStats(res);
      } catch (err) {
        setError(authErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [ready, user, accessToken, router]);

  const onUpload = async () => {
    setUploadError(null);
    setUploadUrl(null);

    try {
      if (!accessToken) throw new Error("Not authenticated");
      if (!file) throw new Error("Please choose a file");

      setUploading(true);
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      const contentType = res.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const body = isJson ? ((await res.json()) as unknown) : await res.text();

      if (!res.ok) {
        const payload = (typeof body === "object" && body != null ? (body as { message?: string }) : undefined) ?? undefined;
        throw new ApiError(payload?.message || `Upload failed (${res.status})`, res.status);
      }

      const data = body as { url: string };
      setUploadUrl(data.url);
    } catch (err) {
      setUploadError(authErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-zinc-50">
      <div className="container-x py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium text-zinc-500">Dashboard</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">Admin</h1>
            <div className="mt-1 text-sm text-zinc-600">
              {user ? (
                <span>
                  Signed in as <span className="font-medium text-zinc-900">{user.email}</span>
                </span>
              ) : (
                <span>Manage store data and uploads</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardBody>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-10 w-28" />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-3 h-10 w-28" />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-10 w-28" />
                  </CardBody>
                </Card>
              </div>
            </div>

            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="text-sm font-semibold text-zinc-900">Upload image</div>
                <div className="mt-1 text-xs text-zinc-500">Upload a product or marketing image</div>
              </CardHeader>
              <CardBody>
                <div className="grid gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </CardBody>
            </Card>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Overview</div>
                <div className="mt-1 text-xs text-zinc-500">High-level store metrics</div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <StatCard label="Users" value={stats?.users ?? 0} />
                <StatCard label="Products" value={stats?.products ?? 0} />
                <StatCard label="Orders" value={stats?.orders ?? 0} />
              </div>
            </div>

            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="text-sm font-semibold text-zinc-900">Upload image</div>
                <div className="mt-1 text-xs text-zinc-500">PNG/JPG/WebP recommended</div>
              </CardHeader>
              <CardBody>
                <div className="grid gap-3">
                  <div className="grid gap-1">
                    <label htmlFor="admin-upload" className="text-sm font-medium text-zinc-900">
                      Choose file
                    </label>
                    <Input
                      id="admin-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="text-xs text-zinc-500">
                      {file ? (
                        <span>
                          Selected: <span className="font-medium text-zinc-900">{file.name}</span>
                        </span>
                      ) : (
                        <span>No file selected</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button onClick={onUpload} disabled={!file || uploading}>
                      {uploading ? "Uploading…" : "Upload"}
                    </Button>
                    {uploading ? <div className="text-xs text-zinc-500">Please wait…</div> : null}
                  </div>

                  {uploadError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                      {uploadError}
                    </div>
                  ) : null}

                  {uploadUrl ? (
                    <div className="rounded-xl border border-zinc-200 bg-white p-3">
                      <div className="text-xs font-medium text-zinc-500">Uploaded URL</div>
                      <div className="mt-1 text-xs text-zinc-700 break-all">{uploadUrl}</div>
                      <img
                        src={uploadUrl}
                        alt={file ? `Uploaded ${file.name}` : "Uploaded"}
                        className="mt-3 w-full rounded-lg border border-zinc-200 bg-white"
                      />
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
