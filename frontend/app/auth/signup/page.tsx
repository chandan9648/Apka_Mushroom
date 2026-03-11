"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(name, email, password);
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
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
          <h1 className="text-xl font-bold text-zinc-900">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-500">Join Apka Mushroom today</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-6">
            <form onSubmit={submit} className="grid gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="name">
                  Full name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="email">
                  Email address
                </label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
                <div className="mt-1.5 text-xs text-zinc-400">At least 8 characters</div>
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
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-zinc-900 no-underline hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-zinc-500 hover:text-zinc-700">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="text-zinc-500 hover:text-zinc-700">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
