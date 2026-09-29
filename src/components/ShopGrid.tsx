"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import ProductCard from "./ProductCard";
import { IconChevron, IconSearch, Reveal } from "./ui";

type PriceBand = "all" | "lt30" | "30to45" | "gt45";
type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const PRICE_BANDS: { key: PriceBand; label: string }[] = [
  { key: "all", label: "Any price" },
  { key: "lt30", label: "Under ₹3,000" },
  { key: "30to45", label: "₹3,000 – ₹4,500" },
  { key: "gt45", label: "Over ₹4,500" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Our picks" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export default function ShopGrid({
  products,
}: {
  products: Product[];
}) {
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState<PriceBand>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested && CATEGORIES.some((item) => item.slug === requested)) setCategory(requested);
  }, []);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (price === "lt30") list = list.filter((p) => p.price < 3000);
    if (price === "30to45") list = list.filter((p) => p.price >= 3000 && p.price <= 4500);
    if (price === "gt45") list = list.filter((p) => p.price > 4500);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name, p.tagline, p.flavor, p.category]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) || b.ratingCount - a.ratingCount,
        );
    }
    return list;
  }, [products, category, price, sort, inStockOnly, q]);

  const reset = () => {
    setCategory("all");
    setPrice("all");
    setSort("featured");
    setInStockOnly(false);
    setQ("");
  };

  const pill = (active: boolean) =>
    `rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
      active
        ? "border-ink bg-ink text-bone"
        : "border-ink/15 text-ink-2 hover:border-ink hover:text-ink"
    }`;

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={pill(category === "all")} onClick={() => setCategory("all")}>
            All products
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={pill(category === c.slug)}
              onClick={() => setCategory(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <label className="relative block">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search supplements"
              className="w-52 border-b border-ink/20 bg-transparent py-2 pl-11 pr-2 text-sm placeholder:text-ink-2/70 focus:border-ink"
              aria-label="Search supplements"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none border-b border-ink/20 bg-transparent py-2 pr-8 font-mono text-[11px] uppercase tracking-[0.12em] focus:border-ink"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <IconChevron className="pointer-events-none absolute right-1 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-ink/10 py-3">
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                price === b.key ? "text-ink underline underline-offset-4" : "text-ink-2 hover:text-ink"
              }`}
              onClick={() => setPrice(b.key)}
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            className={`ml-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
              inStockOnly ? "text-ink" : "text-ink-2 hover:text-ink"
            }`}
            aria-pressed={inStockOnly}
          >
            <span
              className={`grid size-4 place-items-center rounded-full border ${
                inStockOnly ? "border-ink bg-ink" : "border-ink/30"
              }`}
            >
              {inStockOnly && (
                <span className="size-1.5 rounded-full bg-lime" />
              )}
            </span>
            In stock only
          </button>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="font-display text-3xl font-semibold">Nothing matches those filters.</p>
          <p className="max-w-sm text-sm text-ink-2">
            Try widening the price band or clearing the search — everything is one click away.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-bone transition-colors hover:bg-pine"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 70} y={22}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
