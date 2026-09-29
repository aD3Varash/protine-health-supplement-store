"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import type { Product, ProductSize } from "@/lib/types";
import { IconBag, QtyStepper } from "./ui";

function sizeAmount(label: string) {
  const match = label.match(/([\d.]+)\s*(kg|g|softgels|gummies|sticks)/i);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  return unit === "kg" ? amount * 1000 : amount;
}

export default function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.find((size) => size.label === product.defaultSize) ?? product.sizes[0],
  );
  const { add } = useCart();
  const router = useRouter();
  const soldOut = product.stock <= 0;
  const defaultAmount = sizeAmount(product.defaultSize) ?? 1;
  const selectedAmount = sizeAmount(selectedSize.label) ?? defaultAmount;
  const servings = Math.max(1, Math.floor(product.servings * selectedAmount / defaultAmount));

  return (
    <div>
      <label htmlFor="product-size" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
        Choose size
      </label>
      <select
        id="product-size"
        value={selectedSize.label}
        onChange={(event) => {
          const size = product.sizes.find((option) => option.label === event.target.value);
          if (size) setSelectedSize(size);
        }}
        className="mb-4 w-full rounded-lg border border-ink/20 bg-bone px-4 py-3 text-sm"
      >
        {product.sizes.map((size) => (
          <option key={size.label} value={size.label}>
            {size.label} — {money(size.price)}
          </option>
        ))}
      </select>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-display text-3xl font-semibold tracking-tight">{money(selectedSize.price)}</span>
        {selectedSize.compareAt && (
          <span className="font-mono text-sm text-ink-2 line-through">{money(selectedSize.compareAt)}</span>
        )}
      </div>
      <p className="-mt-2 mb-4 font-mono text-[10px] uppercase tracking-[0.13em] text-ink-2">
        {servings} servings · {product.servingText} per serving
      </p>
      <div className="flex gap-3">
        <QtyStepper
          qty={qty}
          onChange={(q) => setQty(Math.max(1, Math.min(99, q)))}
        />
        <button
          type="button"
          disabled={soldOut}
          onClick={() => add(product, qty, true, selectedSize)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors enabled:hover:bg-pine disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconBag className="size-4" />
          {soldOut ? "Sold out — back soon" : `Add to cart · ${money(selectedSize.price * qty)}`}
        </button>
      </div>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => {
          add(product, qty, false, selectedSize);
          router.push("/checkout");
        }}
        className="mt-3 w-full rounded-full border border-ink/25 py-4 font-mono text-xs uppercase tracking-[0.16em] transition-colors enabled:hover:border-ink enabled:hover:bg-ink enabled:hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
      >
        Buy it now
      </button>
    </div>
  );
}
