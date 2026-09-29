import Link from "next/link";
import { getProducts } from "@/lib/products";
import ShopGrid from "@/components/ShopGrid";

export const metadata = { title: "Shop all products" };

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
      </nav>

      <header className="mt-8 max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
          The catalog
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Everything,{" "}
          <em className="font-medium text-pine">batch-tested.</em>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-2">
          Eight formulas, zero proprietary blends. Filter by goal, price, or mood — every label is one you can read in ten seconds.
        </p>
      </header>

      <div className="mt-12">
        <ShopGrid products={products} />
      </div>
    </div>
  );
}
