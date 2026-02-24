"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [needsVerify, setNeedsVerify] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsVerify(false);

    try {
      await login(email, password);
      router.push(next);
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerify(true);
      }
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Log in</div>
            <div className="text-sm text-zinc-600">Use your account email + password.</div>
          </CardHeader>
          <CardBody>
            <form onSubmit={submit} className="grid gap-3">
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Password</div>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
              </label>

              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              {needsVerify ? (
                <div className="text-sm text-zinc-700">
                  Verify your email using OTP. {" "}
                  <Link href={`/auth/verify-email?email=${encodeURIComponent(email)}`} className="text-zinc-900">
                    Verify now
                  </Link>
                </div>
              ) : null}

              <Button disabled={loading}>{loading ? "Logging in…" : "Log in"}</Button>
            </form>

            <div className="mt-4 text-sm text-zinc-600">
              No account? {" "}
              <Link href="/auth/signup" className="text-zinc-900">
                Sign up
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
