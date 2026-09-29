"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { assetUrl } from "@/lib/assets";
import { FREE_SHIPPING_THRESHOLD, money } from "@/lib/format";
import { IconArrow, IconBag, IconCheck, IconX, QtyStepper } from "./ui";

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, close, setQty, remove } = useCart();
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`fixed inset-0 z-[80] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* overlay */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-bone shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Your cart{" "}
            <span className="font-mono text-sm font-normal text-ink-2">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid size-10 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-bone"
            aria-label="Close cart"
          >
            <IconX className="size-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-bone-2">
              <IconBag className="size-7 text-ink-2" />
            </span>
            <p className="font-display text-2xl font-semibold">Your cart is empty</p>
            <p className="text-sm text-ink-2">
              Your macros are waiting. Start with the bestsellers.
            </p>
            <Link
              href="/shop"
              onClick={close}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-bone transition-colors hover:bg-pine"
            >
              Shop bestsellers <IconArrow className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* free shipping meter */}
            <div className="border-b border-ink/10 px-6 py-4">
              {remaining > 0 ? (
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
                  You&apos;re <span className="text-ink">{money(remaining)}</span> away from
                  free shipping
                </p>
              ) : (
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-pine">
                  <IconCheck className="size-3.5" /> Free shipping unlocked
                </p>
              )}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-lime-deep transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* items */}
            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={close}
                    className="block size-20 shrink-0 overflow-hidden rounded-lg bg-bone-2"
                  >
                    <img
                      src={assetUrl(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={close}
                        className="font-display text-[15px] font-semibold leading-snug hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="mt-0.5 text-ink-2 transition-colors hover:text-clay"
                        aria-label={`Remove ${item.name}`}
                      >
                        <IconX className="size-4" />
                      </button>
                    </div>
                    {item.flavor && item.flavor !== "Unflavored" && (
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">
                        {item.flavor}
                      </p>
                    )}
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-2">{item.size}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper small qty={item.qty} onChange={(q) => setQty(item.key, q)} />
                      <span className="font-mono text-sm">{money(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* footer */}
            <div className="border-t border-ink/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">
                  Subtotal
                </span>
                <span className="font-display text-2xl font-semibold">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-2">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine"
              >
                Checkout
                <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 underline underline-offset-4 hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
