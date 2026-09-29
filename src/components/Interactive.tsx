"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { assetUrl } from "@/lib/assets";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";
import { IconArrow, IconBag, IconCheck, Stars } from "./ui";

/* floating product card over the hero image */
export function HeroQuickCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="pointer-events-auto flex w-[250px] items-center gap-3 rounded-2xl border border-ink/10 bg-bone p-3 shadow-[0_24px_60px_-24px_rgba(25,27,20,0.45)]">
      <img
        src={assetUrl(product.images[0])}
        alt={product.name}
        className="size-16 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[13px] font-semibold leading-tight">
          {product.name}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Stars value={product.rating} starClass="size-3" />
          <span className="font-mono text-[10px] text-ink-2">
            {product.ratingCount.toLocaleString()}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs">{money(product.price)}</p>
      </div>
      <button
        type="button"
        onClick={() => add(product)}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-bone transition-colors hover:bg-pine"
        aria-label={`Add ${product.name} to cart`}
      >
        <IconBag className="size-4" />
      </button>
    </div>
  );
}

/* bundle: add several products at once */
export function BundleAdd({
  items,
  note,
}: {
  items: Product[];
  note: string;
}) {
  const { add } = useCart();
  const total = items.reduce((s, p) => s + p.price, 0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex -space-x-3">
        {items.map((p) => (
          <img
            key={p.id}
            src={assetUrl(p.images[0])}
            alt={p.name}
            className="size-16 rounded-full border-2 border-bone object-cover sm:size-20"
          />
        ))}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{note}</p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-display text-3xl font-semibold tracking-tight">
          {money(total)}
        </span>
        <button
          type="button"
          onClick={() => items.forEach((p) => add(p))}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-bone transition-colors hover:bg-pine"
        >
          Add the stack
          <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

/* newsletter capture */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true);
      return;
    }
    setError(false);
    setDone(true);
  };

  if (done) {
    return (
      <p className="flex items-center gap-3 rounded-full border border-lime/40 bg-lime/10 px-6 py-4 font-mono text-[12px] uppercase tracking-[0.14em] text-lime">
        <IconCheck className="size-4" /> You&apos;re in — code PROTINE10 is on its way.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-xl" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@fastmail.com"
          className="flex-1 rounded-full border border-bone/25 bg-transparent px-6 py-4 text-sm text-bone placeholder:text-bone/40 focus:border-lime"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="rounded-full bg-lime px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-transform duration-200 hover:-translate-y-0.5"
        >
          Get 10% off
        </button>
      </div>
      <p className={`mt-3 font-mono text-[11px] tracking-[0.08em] ${error ? "text-clay" : "text-bone/50"}`}>
        {error
          ? "That email does not look right — one more try."
          : "Training tips + restock alerts. One email a week, unsubscribe anytime."}
      </p>
    </form>
  );
}
