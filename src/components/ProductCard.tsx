"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { assetUrl } from "@/lib/assets";
import { formatCount, money } from "@/lib/format";
import { CATEGORY_LABEL, type Product } from "@/lib/types";
import { IconBag, Stars } from "./ui";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;
  const onSale = product.compareAt != null && product.compareAt > product.price;

  const badge =
    onSale ? (
      <span className="rounded-full bg-clay px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone">
        Sale
      </span>
    ) : product.badge ? (
      <span
        className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
          product.badge === "New" ? "bg-lime text-ink" : "bg-ink text-bone"
        }`}
      >
        {product.badge}
      </span>
    ) : null;

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bone-2">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <img
            src={assetUrl(product.images[0])}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
          {product.images[1] && (
            <img
              src={assetUrl(product.images[1])}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badge}
          {soldOut && (
            <span className="rounded-full bg-bone/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
              Sold out
            </span>
          )}
        </div>

        {/* quick add */}
        <div
          className={`absolute inset-x-3 bottom-3 transition-all duration-400 ease-out lg:translate-y-[140%] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
            soldOut ? "lg:pointer-events-none" : ""
          }`}
        >
          {soldOut ? (
            <span className="flex w-full items-center justify-center rounded-full bg-bone/95 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
              Back in stock soon
            </span>
          ) : (
            <button
              type="button"
              onClick={() => add(product)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone shadow-lg shadow-ink/20 transition-colors hover:bg-pine"
            >
              <IconBag className="size-4" /> Add {product.defaultSize} · {money(product.price)}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
            {CATEGORY_LABEL[product.category] ?? product.category}
            {product.flavor && product.flavor !== "Unflavored" ? ` · ${product.flavor}` : ""}
          </p>
          <Link
            href={`/product/${product.slug}`}
            className="mt-1 block font-display text-lg font-semibold leading-snug tracking-tight decoration-lime-deep decoration-2 underline-offset-4 group-hover:underline"
          >
            {product.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="font-mono text-[11px] text-ink-2">
              {formatCount(product.ratingCount)}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm">{money(product.price)}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2">{product.defaultSize}</p>
          {product.compareAt != null && (
            <p className="font-mono text-[11px] text-ink-2 line-through">
              {money(product.compareAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
