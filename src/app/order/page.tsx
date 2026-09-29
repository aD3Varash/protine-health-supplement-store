"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/lib/format";
import { getDemoOrder, type DemoOrder } from "@/lib/demo-store";
import { assetUrl } from "@/lib/assets";
import { IconArrow, IconCheck, Reveal } from "@/components/ui";

export default function OrderPage() {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const id = new URLSearchParams(window.location.search).get("ref");
    if (active) {
      setOrder(id ? getDemoOrder(id) : null);
      setReady(true);
    }
    return () => { active = false; };
  }, []);

  if (!ready) return <div className="mx-auto max-w-2xl px-4 py-24" aria-label="Loading order" />;

  if (!order) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Order not found</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-2">
          Demo orders are saved in this browser. Place an order here to see its details.
        </p>
        <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone hover:bg-pine">
          Back to the shop <IconArrow className="size-4" />
        </Link>
      </div>
    );
  }

  const placed = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <span className="grid size-20 place-items-center rounded-full bg-lime">
            <IconCheck className="size-9 text-ink" />
          </span>
        </Reveal>
        <h1 className="mt-7 font-display text-5xl font-semibold tracking-tight">
          Order confirmed<span className="text-lime-deep">.</span>
        </h1>
        <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-2">
          Order {order.id} · placed {placed}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
          A demo confirmation is ready for <span className="text-ink">{order.email}</span>. Your local checkout has been completed — no payment was charged.
        </p>
      </div>

      <Reveal delay={120}>
        <div className="mt-12 overflow-hidden rounded-2xl border border-ink/10">
          <ul className="divide-y divide-ink/10">
            {order.items.map((item) => (
              <li key={item.key} className="flex items-center gap-4 bg-bone p-4">
                <img src={assetUrl(item.image)} alt={item.name} className="size-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[15px] font-semibold">{item.name}</p>
                  <p className="font-mono text-[11px] text-ink-2">{item.size} · Qty {item.qty}</p>
                </div>
                <span className="font-mono text-sm">{money(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 bg-bone-2/70 p-5 text-sm">
            <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="font-mono">{money(order.subtotal)}</span></div>
            <div className="flex justify-between text-ink-2"><span>Shipping</span><span className="font-mono">{order.shipping === 0 ? "Free" : money(order.shipping)}</span></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 font-display text-xl font-semibold"><span>Total</span><span>{money(order.total)}</span></div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">Shipping to</p>
            <p className="mt-3 text-sm font-medium">{order.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{order.line1}<br />{order.city}{order.state ? `, ${order.state}` : ""} {order.zip}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">Payment · demo only</p>
            <p className="mt-3 text-sm font-medium">Test card ending in {order.paymentLast4}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">No card details were stored. No payment was taken.</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 rounded-2xl border border-ink/10 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">What happens next</p>
        <ol className="mt-3 grid gap-2.5 text-sm text-ink-2 sm:grid-cols-3">
          <li><span className="mr-2 font-mono text-[11px] text-pine">1.</span>Packed and quality-checked within 24h</li>
          <li><span className="mr-2 font-mono text-[11px] text-pine">2.</span>Ships with tracking in 2–5 business days</li>
          <li><span className="mr-2 font-mono text-[11px] text-pine">3.</span>30-day empty-bottle returns, always</li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop" className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine">
          Back to the shop <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
