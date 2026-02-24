"use client";

import * as React from "react";
import { apiFetchJson } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";

export function ReviewForm({ productId, onCreated }: { productId: string; onCreated?: () => void }) {
  const { accessToken, user } = useAuth();
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!user) {
    return <div className="text-sm text-zinc-600">Log in to leave a review.</div>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetchJson("/api/reviews", {
        method: "POST",
        token: accessToken ?? undefined,
        body: JSON.stringify({ productId, rating, title, comment }),
      });
      setTitle("");
      setComment("");
      onCreated?.();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 grid gap-3">
      <label className="text-sm">
        <div className="mb-1 text-zinc-600">Rating</div>
        <select
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div className="mb-1 text-zinc-600">Title</div>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional" />
      </label>
      <label className="text-sm">
        <div className="mb-1 text-zinc-600">Comment</div>
        <textarea
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional"
        />
      </label>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div>
        <Button disabled={loading}>{loading ? "Submitting…" : "Submit review"}</Button>
      </div>
    </form>
  );
}
