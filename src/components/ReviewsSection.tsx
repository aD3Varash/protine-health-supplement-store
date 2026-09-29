"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCount, formatDate } from "@/lib/format";
import { getLocalReviews, saveLocalReview } from "@/lib/demo-store";
import type { Product, Review } from "@/lib/types";
import { IconCheck, Stars } from "./ui";

type FormState = { author: string; rating: number; title: string; body: string };
const EMPTY: FormState = { author: "", rating: 0, title: "", body: "" };

export default function ReviewsSection({
  product,
  initialReviews,
}: {
  product: Product;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  useEffect(() => {
    const saved = getLocalReviews(product.id) as Review[];
    if (saved.length) {
      setReviews((current) => {
        const known = new Set(current.map((review) => review.id));
        return [...saved.filter((review) => !known.has(review.id)), ...current];
      });
    }
  }, [product.id]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    for (const r of reviews) counts[r.rating]++;
    const total = reviews.length || 1;
    return counts.map((c) => ({ count: c, pct: Math.round((c / total) * 100) }));
  }, [reviews]);

  const canSubmit = form.rating > 0 && form.author.trim().length > 1 && form.body.trim().length > 4;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status === "saving") return;
    setStatus("saving");
    const created: Review = {
      id: Date.now(),
      author: form.author.trim(),
      rating: form.rating,
      title: form.title.trim() || "Verified experience",
      body: form.body.trim(),
      verified: false,
      createdAt: new Date().toISOString(),
    };
    saveLocalReview(product.id, created);
    setReviews((prev) => [created, ...prev]);
    setForm(EMPTY);
    setStatus("done");
    window.setTimeout(() => setStatus("idle"), 4000);
  };

  const displayRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating;

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
            Receipts from real humans
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
            <span className="italic text-pine"> and counting</span>
          </h2>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-end gap-4">
            <span className="font-display text-7xl font-semibold leading-none tracking-tight">
              {displayRating.toFixed(1)}
            </span>
            <div className="pb-1.5">
              <Stars value={displayRating} starClass="size-4" />
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
                {formatCount(product.ratingCount)} total ratings
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-3 font-mono text-xs">{s}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-ink transition-[width] duration-700"
                    style={{ width: `${distribution[s].pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11px] text-ink-2">
                  {distribution[s].count}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-2">
            Bars reflect the {reviews.length} most recent verified and community reviews shown
            below.
          </p>
        </div>

        {/* list + form */}
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="flex flex-col rounded-xl border border-ink/10 bg-bone p-5 transition-shadow duration-300 hover:shadow-[0_12px_30px_-18px_rgba(25,27,20,0.35)]"
              >
                <div className="flex items-center justify-between">
                  <Stars value={r.rating} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[15px] font-semibold leading-snug">
                  “{r.title}”
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{r.body}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em]">
                    {r.author}
                  </span>
                  {r.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-pine/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-pine">
                      <IconCheck className="size-3" /> Verified buyer
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* form */}
          <form
            onSubmit={submit}
            className="mt-10 rounded-2xl border border-ink/15 bg-bone-2/60 p-6 sm:p-8"
          >
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              Rate this product
            </h3>
            <p className="mt-1 text-sm text-ink-2">
              Used it for two weeks? Six months? Your take moves the average.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
                Your rating
              </span>
              <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    onMouseEnter={() => setHoverRating(n)}
                    className={`transition-transform duration-150 hover:scale-110 ${
                      (hoverRating || form.rating) >= n ? "text-ink" : "text-ink/20"
                    }`}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                      <path d="M10 1.7l2.45 4.96 5.47.79-3.96 3.86.94 5.44L10 14.18l-4.9 2.57.94-5.44L2.08 7.45l5.47-.79L10 1.7z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Your name"
                className="rounded-lg border border-ink/20 bg-bone px-4 py-3 text-sm placeholder:text-ink-2/70"
              />
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Headline (optional)"
                className="rounded-lg border border-ink/20 bg-bone px-4 py-3 text-sm placeholder:text-ink-2/70"
              />
            </div>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="What happened after you took it? The honest details help."
              rows={4}
              className="mt-4 w-full resize-none rounded-lg border border-ink/20 bg-bone px-4 py-3 text-sm placeholder:text-ink-2/70"
            />

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={!canSubmit || status === "saving"}
                className="rounded-full bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-bone transition-all enabled:hover:bg-pine disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "saving" ? "Posting…" : "Submit review"}
              </button>
              {status === "done" && (
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-pine">
                  <IconCheck className="size-4" /> Thanks — your review is live.
                </p>
              )}
              {status === "error" && (
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-clay">
                  Something went wrong — try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
