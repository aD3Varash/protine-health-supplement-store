import Link from "next/link";
import { getBestsellers, getHomeReviews, getProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { assetUrl } from "@/lib/assets";
import { formatCount } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { HeroQuickCard, BundleAdd, NewsletterForm } from "@/components/Interactive";
import {
  CountUp,
  IconArrow,
  IconFlask,
  IconShield,
  IconSpark,
  Marquee,
  Reveal,
  Stars,
} from "@/components/ui";

const COLLECTION_IMAGES: Record<string, string> = {
  protein: "/images/whey.webp",
  creatine: "/images/creatine.webp",
  supplements: "/images/pre.webp",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Real doses",
    body: "Every active is printed on the label at the exact amount the research uses. If a dose is a whisper, it is not in the bottle.",
  },
  {
    n: "02",
    title: "Tested, not promised",
    body: "Independent labs test every batch for identity, potency, and heavy metals. Certificates of analysis are public — ask and we send them the same day.",
  },
  {
    n: "03",
    title: "Nothing to hide",
    body: "No proprietary blends, no dyes, no “natural flavor” black boxes. Every label can be read — and understood — in ten seconds.",
  },
];

export default async function HomePage() {
  const [bestsellers, allProducts, homeReviews] = await Promise.all([
    getBestsellers(4),
    getProducts(),
    getHomeReviews(),
  ]);
  const bySlug = Object.fromEntries(allProducts.map((p) => [p.slug, p]));
  const stack = [
    bySlug["whey-isolate-dark-cocoa"],
    bySlug["creatine-monohydrate"],
    bySlug["daily-multi"],
  ].filter(Boolean);
  const heroProduct = bySlug["whey-isolate-dark-cocoa"] ?? bestsellers[0];
  const countFor = (cat: string) => allProducts.filter((p) => p.category === cat).length;

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="relative z-10 flex flex-col justify-center lg:col-span-7 lg:pr-12">
            <p
              className="fade-in flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-2"
              style={{ "--fade-delay": "0.1s" } as React.CSSProperties}
            >
              <IconFlask className="size-4 text-pine" />
              Performance nutrition · every batch tested
            </p>

            <h1 className="mt-6 font-display text-[15vw] font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[84px]">
              <span className="mask-line">
                <span style={{ "--rise-delay": "0.15s" } as React.CSSProperties}>
                  Train loud.
                </span>
              </span>
              <span className="mask-line">
                <span
                  style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
                  className="font-medium italic text-pine"
                >
                  Recover quiet.
                </span>
              </span>
            </h1>

            <p
              className="fade-in mt-6 max-w-md text-lg leading-relaxed text-ink-2"
              style={{ "--fade-delay": "0.55s" } as React.CSSProperties}
            >
              Clean, honest supplements dosed at the clinical amount — for people who lift,
              run, and live hard, and everyone else who just wants to feel sharp.
            </p>

            <div
              className="fade-in mt-8 flex flex-wrap items-center gap-5"
              style={{ "--fade-delay": "0.7s" } as React.CSSProperties}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine"
              >
                Shop bestsellers
                <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#collections"
                className="font-mono text-xs uppercase tracking-[0.16em] underline underline-offset-8 decoration-ink/30 transition-colors hover:decoration-ink"
              >
                Explore collections
              </a>
            </div>

            <div
              className="fade-in mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
              style={{ "--fade-delay": "0.85s" } as React.CSSProperties}
            >
              {[
                { v: "4.9", l: "avg. from 9,200+ ratings" },
                { v: "55k+", l: "orders shipped" },
                { v: "0", l: "proprietary blends" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-2.5">
                  <span className="font-display text-2xl font-semibold">{s.v}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl bg-bone-2">
              <div className="aspect-[4/5]">
                <img
                  src={assetUrl("/images/hero.webp")}
                  alt="ProTine supplement lineup with a splash of powder"
                  className="kenburns h-full w-full object-cover"
                />
              </div>
            </div>

            {/* rotating test badge */}
            <div className="absolute -right-3 -top-5 grid size-28 place-items-center rounded-full bg-lime shadow-lg sm:-right-6">
              <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 size-full">
                <defs>
                  <path
                    id="pt-circ"
                    d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text
                  fill="#191b14"
                  fontSize="9.5"
                  letterSpacing="2.6"
                  style={{ fontFamily: "var(--font-plex, monospace)" }}
                >
                  <textPath href="#pt-circ">THIRD-PARTY TESTED · SMALL BATCH ·</textPath>
                </text>
              </svg>
              <IconFlask className="size-7 text-ink" />
            </div>

            {/* floating quick-add card */}
            {heroProduct && (
              <div
                className="fade-in absolute -bottom-8 -left-3 hidden sm:block lg:-left-12"
                style={{ "--fade-delay": "1s" } as React.CSSProperties}
              >
                <HeroQuickCard product={heroProduct} />
              </div>
            )}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="text-stroke pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap font-display text-[20vw] font-black leading-none"
        >
          PROTINE
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <Marquee speed={34} className="border-y border-ink/10 bg-lime py-3">
        {["Whey Isolate", "Creatine", "Pre-Workout", "Omega-3", "Magnesium", "Collagen", "Electrolytes", "Daily Multi"].map(
          (t) => (
            <span key={t} className="flex items-center">
              <span className="px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                {t}
              </span>
              <IconSpark className="size-3 text-ink/60" />
            </span>
          ),
        )}
      </Marquee>

      {/* ================= COLLECTIONS ================= */}
      <section id="collections" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
                Shop by goal
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Pick your lane, <em className="font-medium text-pine">skip the guesswork.</em>
              </h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] underline underline-offset-8 decoration-ink/30 hover:decoration-ink"
            >
              View all products
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 110} className={i === 1 ? "lg:mt-12" : i === 2 ? "lg:mt-24" : ""}>
              <Link href={`/shop?category=${c.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-bone-2">
                  <div className="aspect-[4/5]">
                    <img
                      src={assetUrl(COLLECTION_IMAGES[c.slug])}
                      alt={`${c.label} collection`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-6 pt-20">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70">
                      {countFor(c.slug)} products
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-semibold text-bone">
                      {c.label}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-bone/75">
                      {c.blurb}
                    </p>
                  </div>
                  <span className="absolute right-4 top-4 grid size-11 -translate-y-2 place-items-center rounded-full bg-lime text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <IconArrow className="size-5 -rotate-45" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= BESTSELLERS ================= */}
      <section className="border-y border-ink/10 bg-bone-2/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
                  Bestsellers
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  The re-order list<span className="text-clay">.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-ink-2">
                The formulas our customers buy again, and again, and again. No dark-horse
                picks — just receipts.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STANDARD (dark) ================= */}
      <section id="standard" className="scroll-mt-16 bg-pine-deep text-bone">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
                  The ProTine standard
                </p>
                <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                  No shortcuts.
                  <br />
                  <em className="font-medium text-lime">Ever.</em>
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-bone/65">
                  Supplements are a trust business. We built ProTine so that trust is
                  something you can verify on the label — not something you take on faith.
                </p>
                <Link
                  href="/shop"
                  className="group mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-lime underline underline-offset-8 decoration-lime/40 hover:decoration-lime"
                >
                  Shop the batch-tested range
                  <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { to: 214, dec: 0, suffix: "", label: "batches lab-tested in 2025" },
                  { to: 55000, dec: 0, suffix: "+", label: "orders shipped worldwide" },
                  { to: 4.9, dec: 1, suffix: "", label: "average product rating" },
                  { to: 0, dec: 0, suffix: "", label: "proprietary blends, forever" },
                ].map((s) => (
                  <Reveal key={s.label}>
                    <p className="font-display text-5xl font-semibold tracking-tight text-lime">
                      <CountUp to={s.to} decimals={s.dec} suffix={s.suffix} />
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
                      {s.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              {PRINCIPLES.map((pr, i) => (
                <Reveal key={pr.n} delay={i * 100}>
                  <div className="group flex gap-6 border-t border-bone/15 py-9 last:border-b sm:gap-10">
                    <span className="pt-1 font-mono text-sm text-lime/60 transition-colors duration-300 group-hover:text-lime">
                      {pr.n}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                        {pr.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/60">
                        {pr.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={320}>
                <div className="mt-10 flex items-center gap-3 rounded-xl border border-bone/15 bg-bone/5 p-5">
                  <IconShield className="size-6 shrink-0 text-lime" />
                  <p className="text-sm leading-relaxed text-bone/70">
                    Every batch ships with a public certificate of analysis. Email{" "}
                    <a href="mailto:lab@protine.com" className="underline underline-offset-4">
                      lab@protine.com
                    </a>{" "}
                    with your batch code and it lands in your inbox the same day.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BUNDLE ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
              The foundation stack
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Three formulas.
              <br />
              <em className="font-medium text-pine">One decision.</em>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-2">
              The three most re-ordered ProTine formulas in a single click: protein to
              rebuild, creatine to push, a multi to cover the gaps. Start here, adjust
              later.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
              <span>Free shipping</span>
              <span>·</span>
              <span>30-day returns</span>
              <span>·</span>
              <span>Batch-tested</span>
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-2xl border border-ink/10 bg-bone-2 p-8 sm:p-10">
              <BundleAdd
                items={stack}
                note="Whey isolate · Creatine · Daily multi — the complete basics"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= REVIEW STRIP ================= */}
      <section
        id="reviews"
        className="scroll-mt-16 overflow-hidden border-y border-ink/10 bg-bone-2/60 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
                  Receipts from real humans
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  Don&apos;t take <em className="font-medium text-pine">our</em> word for it.
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] underline underline-offset-8 decoration-ink/30 hover:decoration-ink"
              >
                Read all reviews on any product
                <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {homeReviews.map((r, i) => (
              <Reveal
                key={r.id}
                delay={i * 90}
                className={[
                  i % 5 === 0 ? "-rotate-2" : i % 5 === 1 ? "rotate-1 lg:translate-y-6" : i % 5 === 2 ? "-rotate-1 lg:translate-y-12" : i % 5 === 3 ? "rotate-2 lg:translate-y-6" : "-rotate-2",
                ][i % 5]}
              >
                <figure className="h-full rounded-xl border border-ink/10 bg-bone p-5 shadow-[0_10px_30px_-18px_rgba(25,27,20,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0">
                  <Stars value={r.rating} />
                  <blockquote className="mt-3 text-sm leading-relaxed text-ink-2">
                    “{r.body}”
                  </blockquote>
                  <figcaption className="mt-4 border-t border-ink/10 pt-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em]">
                      {r.author}
                    </p>
                    <Link
                      href={`/product/${r.productSlug}`}
                      className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2 underline-offset-4 hover:underline"
                    >
                      on {r.productName}
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section id="story" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-2xl">
              <div className="aspect-[4/3]">
                <img
                  src={assetUrl("/images/lifestyle.webp")}
                  alt="Athlete lifting heavy in a moody industrial gym"
                  loading="lazy"
                  className="kenburns h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={130}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
              Why we exist
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              For the 5:45 alarm crowd —{" "}
              <em className="font-medium text-pine">and the Sunday walk crew.</em>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-2">
              ProTine started in 2021 in a garage in Salt Lake City, between a power rack
              and a chemistry bench. A strength coach and a food scientist kept arguing
              about the same thing: the supplement industry sells mystery, and athletes
              deserve evidence.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              So we built the brand we wanted to buy. Full labels, honest doses, and a
              lab report for every single batch — whether you are chasing a deadlift PR or
              just trying to sleep better.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-8">
              {[
                { to: 2021, dec: 0, suffix: "", label: "founded in Utah" },
                { to: 55000, dec: 0, suffix: "+", label: "orders shipped" },
                { to: 98, dec: 0, suffix: "%", label: "would re-order" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-semibold tracking-tight">
                    <CountUp to={s.to} decimals={s.dec} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/shop"
              className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-bone"
            >
              Shop the full range
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section id="newsletter" className="scroll-mt-16 bg-ink text-bone">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              10% off your first order<span className="text-lime">.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-bone/60">
              Plus restock alerts for small-batch drops and one genuinely useful training
              tip a week. No filler, no “50% off everything” spam.
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:justify-self-end">
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
