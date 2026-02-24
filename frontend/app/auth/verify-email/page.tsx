"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function VerifyEmailPage() {
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
    <div className="container-x py-10">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Verify email</div>
            <div className="text-sm text-zinc-600">Enter the OTP code from the backend console.</div>
          </CardHeader>
          <CardBody>
            <form onSubmit={submit} className="grid gap-3">
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">OTP code</div>
                <Input value={code} onChange={(e) => setCode(e.target.value)} required />
              </label>

              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              {ok ? <div className="text-sm text-green-700">Verified. Redirecting…</div> : null}

              <Button disabled={loading}>{loading ? "Verifying…" : "Verify"}</Button>
            </form>

            <div className="mt-4 text-sm text-zinc-600">
              Back to {" "}
              <Link href="/auth/login" className="text-zinc-900">
                login
              </Link>
              .
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
