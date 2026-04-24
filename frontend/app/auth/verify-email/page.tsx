"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function VerifyEmailContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const preset = sp.get("email") || "";

  const { verifyEmail } = useAuth();

  const [email, setEmail] = React.useState(preset);
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);

    try {
      await verifyEmail(email, code);
      setOk(true);
      setTimeout(() => router.push("/auth/login"), 500);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-zinc-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-amber-400 text-zinc-900 text-base font-bold shadow-md mb-4">
            AM
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Verify your email</h1>
          <p className="mt-1 text-sm text-zinc-500">Check your inbox for the OTP code</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-6">
            {ok ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-zinc-900">Email verified!</div>
                <div className="text-xs text-zinc-400 mt-1">Redirecting you to login…</div>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="verify-email">
                    Email address
                  </label>
                  <Input
                    id="verify-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="verify-otp">
                    OTP Code
                  </label>
                  <Input
                    id="verify-otp"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    className="text-center tracking-widest text-lg font-semibold"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                  />
                </div>

                {error ? (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                ) : null}

                <Button disabled={loading} className="w-full py-2.5 mt-1 rounded-xl text-sm font-semibold">
                  {loading ? "Verifying…" : "Verify email"}
                </Button>
              </form>
            )}
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 text-center text-sm text-zinc-500">
            Back to{" "}
            <Link href="/auth/login" className="font-semibold text-zinc-900 no-underline hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-zinc-50 py-12 px-4">Loading...</div>}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
