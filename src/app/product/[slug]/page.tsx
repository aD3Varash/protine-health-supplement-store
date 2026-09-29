import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProducts,
  getProductBySlug,
  getRelated,
  getReviewsForProduct,
} from "@/lib/products";
import { CATEGORY_LABEL } from "@/lib/types";
import { formatCount } from "@/lib/format";
import Gallery from "@/components/Gallery";
import BuyBox from "@/components/BuyBox";
import ReviewsSection from "@/components/ReviewsSection";
import ProductCard from "@/components/ProductCard";
import {
  Accordion,
  IconFlask,
  IconShield,
  IconTruck,
  Reveal,
  Stars,
} from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p ? p.name : "Product not found" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts, reviews] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
    Promise.resolve(null),
  ]);
  if (!product) notFound();
  const productReviews = await getReviewsForProduct(product.id);
  const related = await getRelated(product, allProducts);
  const soldOut = product.stock <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
          {CATEGORY_LABEL[product.category] ?? product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* gallery — sticky on desktop */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gallery images={product.images} name={product.name} />
        </div>

        {/* details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.badge && (
              <span
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  product.badge === "New" ? "bg-lime text-ink" : "bg-ink text-bone"
                }`}
              >
                {product.badge}
              </span>
            )}
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                soldOut ? "bg-clay/15 text-clay" : "bg-pine/10 text-pine"
              }`}
            >
              <span className={`size-1.5 rounded-full ${soldOut ? "bg-clay" : "bg-lime-deep"}`} />
              {soldOut ? "Sold out" : "In stock, ships in 24h"}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 font-display text-xl italic text-ink-2">{product.tagline}</p>

          <a href="#reviews" className="group mt-4 inline-flex items-center gap-2.5">
            <Stars value={product.rating} starClass="size-4" />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 underline-offset-4 group-hover:underline">
              {product.rating.toFixed(1)} · {formatCount(product.ratingCount)} ratings
            </span>
          </a>

          <div className="mt-5">
            <BuyBox product={product} />
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
            {product.description}
          </p>

          {/* macro highlights */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(product.macros).slice(0, 6).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-bone-2 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">
                  {k}
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 rounded-xl border border-ink/10 p-4 sm:grid-cols-3">
            {[
              { icon: IconTruck, t: "Free shipping over ₹1,999" },
              { icon: IconShield, t: "30-day empty-bottle returns" },
              { icon: IconFlask, t: "Third-party tested, every batch" },
            ].map((b) => (
              <p key={b.t} className="flex items-center gap-2.5 text-[12px] leading-snug text-ink-2">
                <b.icon className="size-4.5 shrink-0 text-pine" />
                {b.t}
              </p>
            ))}
          </div>

          <div className="mt-9 border-t border-ink/10">
            <Accordion title="Details" defaultOpen>
              <div className="space-y-4">
                {product.details.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Accordion>
            <Accordion title="Ingredients">
              <p>{product.ingredients}</p>
            </Accordion>
            <Accordion title="Nutrition facts">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">
                    <th className="pb-2">Per {product.servingText.toLowerCase()}</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(product.macros).map(([k, v]) => (
                    <tr key={k} className="border-t border-ink/10">
                      <td className="py-2 text-sm">{k}</td>
                      <td className="py-2 text-right font-mono text-sm">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion>
            <Accordion title="Shipping & returns">
              <p>
                Orders placed before 12 p.m. ship the same day. Delivery takes 2–5 business
                days; shipping is free on orders over ₹1,999.
              </p>
              <p className="mt-3">
                Not feeling it? Return the bottle — even the empty one — within 30 days
                for a full refund. No forms, no interrogation.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* reviews */}
      <div className="mt-24">
        <ReviewsSection product={product} initialReviews={productReviews} />
      </div>

      {/* related */}
      <section className="mt-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Pairs well with
            </h2>
            <Link
              href="/shop"
              className="font-mono text-[11px] uppercase tracking-[0.16em] underline underline-offset-8 decoration-ink/30 hover:decoration-ink"
            >
              View all
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
