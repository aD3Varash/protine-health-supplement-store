"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Marquee, IconBag, IconMenu, IconX, IconSpark } from "./ui";

const NAV = [
  { label: "Shop all", href: "/shop" },
  { label: "Protein", href: "/shop?category=protein" },
  { label: "Creatine", href: "/shop?category=creatine" },
  { label: "Supplements", href: "/shop?category=supplements" },
  { label: "Reviews", href: "/#reviews" },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-baseline gap-0.5" aria-label="ProTine home">
      <span className="font-display text-[26px] font-black leading-none tracking-tight">
        PROTINE
      </span>
      <span className="inline-block size-2 rounded-full bg-lime transition-transform duration-300 group-hover:scale-125" />
      <span className="ml-0.5 font-mono text-[9px] text-ink-2">®</span>
    </Link>
  );
}

export default function Header() {
  const { count, open } = useCart();
  const { profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* announcement ticker */}
      <div className="bg-ink text-bone">
        <Marquee speed={26} className="py-2">
          {["FREE SHIPPING OVER ₹1,999", "30-DAY EMPTY-BOTTLE RETURNS", "EVERY BATCH THIRD-PARTY TESTED", "SMALL BATCH · BRED IN UTAH", "NO PROPRIETARY BLENDS, EVER"].map(
            (t) => (
              <span key={t} className="flex items-center">
                <span className="px-6 font-mono text-[10px] tracking-[0.22em]">
                  {t}
                </span>
                <IconSpark className="size-2.5 text-lime" />
              </span>
            ),
          )}
        </Marquee>
      </div>

      <header
        className={`sticky top-0 z-50 border-b bg-bone transition-all duration-300 ${
          scrolled ? "border-ink/10 shadow-[0_1px_0_0_rgba(25,27,20,0.04)]" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu className="size-6" />
            </button>
            <Logo />
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="relative font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all after:duration-300 hover:after:w-full"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="mr-1 rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-ink-2 transition-colors hover:bg-bone-2 hover:text-ink sm:px-4 sm:text-[11px]"
              aria-label={profile ? `Account for ${profile.name}` : "Sign in"}
            >
              {profile ? "Account" : "Sign in"}
            </Link>
            <Link
              href="/shop"
              className="mr-1 hidden rounded-full border border-ink/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-ink hover:bg-ink hover:text-bone md:block"
            >
              Shop
            </Link>
            <button
              type="button"
              onClick={open}
              className="relative grid size-11 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-bone"
              aria-label={`Open cart, ${count} items`}
            >
              <IconBag className="size-5" />
              <span
                className={`absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full border border-bone bg-lime font-mono text-[10px] font-medium text-ink transition-transform duration-300 ${
                  count > 0 ? "scale-100" : "scale-0"
                }`}
              >
                {count > 99 ? "99" : count}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 z-[70] bg-bone transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-5">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-11 place-items-center rounded-full border border-ink/15"
              aria-label="Close menu"
            >
              <IconX className="size-5" />
            </button>
          </div>
          <nav className="mt-14 flex flex-col gap-2" aria-label="Mobile">
            {NAV.map((n, i) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-4 border-b border-ink/10 py-4"
              >
                <span className="font-mono text-[11px] text-ink-2">0{i + 1}</span>
                <span className="font-display text-4xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                  {n.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
            <p>Free shipping over ₹1,999</p>
            <p>30-day empty-bottle returns</p>
          </div>
        </div>
      </div>
    </>
  );
}
