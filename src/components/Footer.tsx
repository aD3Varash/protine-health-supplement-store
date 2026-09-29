import Link from "next/link";
import { Marquee } from "./ui";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Protein", href: "/shop?category=protein" },
      { label: "Creatine", href: "/shop?category=creatine" },
      { label: "Supplements", href: "/shop?category=supplements" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our standard", href: "/#standard" },
      { label: "Reviews", href: "/#reviews" },
      { label: "Our story", href: "/#story" },
      { label: "Newsletter", href: "/#newsletter" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "mailto:hello@protine.com" },
      { label: "Care team", href: "mailto:care@protine.com" },
      { label: "Empty-bottle returns", href: "mailto:care@protine.com?subject=30-day%20return" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-pine-deep text-bone">
      {/* giant wordmark marquee */}
      <Marquee speed={46} className="border-b border-bone/10 py-6">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center">
            <span className="text-stroke-light px-8 font-display text-7xl font-black tracking-tight sm:text-8xl">
              PROTINE
            </span>
            <span className="size-3 rounded-full bg-lime" />
          </span>
        ))}
      </Marquee>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-display text-3xl font-black tracking-tight">
              PROTINE<span className="text-lime">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/60">
              Performance nutrition for people who lift, run, and live hard — and everyone
              else who just wants to feel sharp.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/40">
              Bred in Utah · Batch-tested
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime/80">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-bone/70 underline-offset-4 transition-colors hover:text-bone hover:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/10 pt-8 text-[11px] leading-relaxed text-bone/40 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p>© 2026 ProTine Labs, Inc. All rights reserved.</p>
            <p className="mt-2">
              *These statements have not been evaluated by the Food and Drug Administration.
              This product is not intended to diagnose, treat, cure, or prevent any disease.
              Consult your physician before beginning any supplement program.
            </p>
            <p className="mt-2 font-mono uppercase tracking-[0.14em]">
              Demo storefront — no real orders or charges.
            </p>
          </div>
          <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
            VISA · MC · AMEX · PAYPAL
          </p>
        </div>
      </div>
    </footer>
  );
}
