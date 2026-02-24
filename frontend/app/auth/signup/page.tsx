"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

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
    <div className="container-x py-10">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Create account</div>
            <div className="text-sm text-zinc-600">OTP is logged to the backend console in dev.</div>
          </CardHeader>
          <CardBody>
            <form onSubmit={submit} className="grid gap-3">
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Name</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-zinc-600">Password</div>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required />
              </label>

              {error ? <div className="text-sm text-red-600">{error}</div> : null}

              <Button disabled={loading}>{loading ? "Creating…" : "Sign up"}</Button>
            </form>

            <div className="mt-4 text-sm text-zinc-600">
              Already have an account? {" "}
              <Link href="/auth/login" className="text-zinc-900">
                Log in
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
