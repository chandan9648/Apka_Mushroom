"use client";

import * as React from "react";
import { apiFetchJson } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${n} out of 5`}
          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={n <= (hovered || value) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={n <= (hovered || value) ? "text-amber-400" : "text-zinc-300"}
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-xs text-zinc-500">{value}/5</span>
    </div>
  );
}

export function ReviewForm({ productId, onCreated }: { productId: string; onCreated?: () => void }) {
  const { accessToken, user } = useAuth();
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  if (!user) {
    return (
      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
        <a href="/auth/login" className="font-semibold text-zinc-900 underline">Log in</a>
        {" "}to leave a review.
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium">
        ✓ Your review has been submitted. Thank you!
      </div>
    );
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
      setSuccess(true);
      onCreated?.();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4">
      <div>
        <div className="text-xs font-semibold text-zinc-700 mb-2">Your rating</div>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="review-title">
          Title <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your review"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="review-comment">
          Review <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-offset-1 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors resize-none"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others what you think about this product…"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      ) : null}

      <div>
        <Button disabled={loading} variant="secondary">
          {loading ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
