"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { money, shippingFor } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { saveDemoOrder } from "@/lib/demo-store";
import { assetUrl } from "@/lib/assets";
import { IconArrow, IconBag, IconCheck, IconLock } from "@/components/ui";

type Fields = {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const EMPTY: Fields = {
  email: "",
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

const inputCls =
  "w-full rounded-lg border border-ink/20 bg-bone px-4 py-3 text-sm placeholder:text-ink-2/60";
const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { profile } = useAuth();
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [processing, setProcessing] = useState(false);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  useEffect(() => {
    if (!profile) return;
    setFields((current) => ({
      ...current,
      email: current.email || profile.email,
      name: current.name || profile.name,
      cardName: current.cardName || profile.name,
    }));
  }, [profile]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (key === "cardNumber") {
      v = v
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    if (key === "expiry") {
      v = v
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(?=\d)/, "$1/");
    }
    if (key === "cvc") v = v.replace(/\D/g, "").slice(0, 4);
    if (key === "zip") v = v.replace(/\D/g, "").slice(0, 6);
    setFields((f) => ({ ...f, [key]: v }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er: Partial<Record<keyof Fields, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) er.email = "Enter a valid email";
    if (fields.name.trim().length < 2) er.name = "Required";
    if (fields.address.trim().length < 4) er.address = "Required";
    if (!fields.city.trim()) er.city = "Required";
    if (!/^\d{6}$/.test(fields.zip)) er.zip = "Enter a valid 6-digit PIN code";
    if (fields.cardName.trim().length < 2) er.cardName = "Required";
    if (fields.cardNumber.replace(/\s/g, "").length !== 16) er.cardNumber = "16 digits required";
    if (!/^\d{2}\/\d{2}$/.test(fields.expiry)) er.expiry = "MM/YY";
    if (fields.cvc.length < 3) er.cvc = "3–4 digits";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.getElementById("checkout-errors")?.scrollIntoView({ block: "center" });
      return;
    }
    setProcessing(true);
    window.setTimeout(() => {
      const rand = Math.floor(Math.random() * 36 ** 3).toString(36).toUpperCase().padStart(4, "0");
      const id = `PT-${Date.now().toString(36).toUpperCase()}${rand}`;
      saveDemoOrder({
        id,
        email: fields.email.trim(),
        name: fields.name.trim(),
        line1: fields.address.trim(),
        city: fields.city.trim(),
        state: fields.state.trim(),
        zip: fields.zip.trim(),
        country: "India",
        items: items.map(({ id: itemId, key, name, size, image, price, qty }) => ({ id: itemId, key, name, size, image, price, qty })),
        subtotal,
        shipping,
        total,
        paymentLast4: fields.cardNumber.replace(/\D/g, "").slice(-4),
        createdAt: new Date().toISOString(),
      });
      clear();
      router.push(`/order?ref=${encodeURIComponent(id)}`);
    }, 650);
  };

  const err = (k: keyof Fields) =>
    errors[k] ? <p className="mt-1 text-xs text-clay">{errors[k]}</p> : null;

  const summary = useMemo(
    () => (
      <aside className="lg:sticky lg:top-28">
        <div className="rounded-2xl border border-ink/10 bg-bone-2/60 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Order summary
          </h2>
          <ul className="mt-5 divide-y divide-ink/10">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3">
                <div className="relative shrink-0">
                  <img
                    src={assetUrl(i.image)}
                    alt={i.name}
                    className="size-14 rounded-lg object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-bone">
                    {i.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{i.name}</p>
                  {i.flavor && i.flavor !== "Unflavored" && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-2">
                      {i.flavor}
                    </p>
                  )}
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-2">{i.size}</p>
                </div>
                <span className="font-mono text-sm">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-2">
              <span>Subtotal</span>
              <span className="font-mono">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Shipping</span>
              <span className="font-mono">
                {shipping === 0 ? (
                  <span className="text-pine">Free</span>
                ) : (
                  money(shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 font-display text-xl font-semibold text-ink">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
          <IconLock className="size-3.5" /> Secure demo checkout — no real charge
        </p>
      </aside>
    ),
    [items, subtotal, shipping, total],
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <span className="grid size-16 place-items-center rounded-full bg-bone-2">
          <IconBag className="size-7 text-ink-2" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
          Nothing to check out
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-2">
          Your cart is empty. Add a formula or two, then come back — the good stuff is
          batch-tested and waiting.
        </p>
        <Link
          href="/shop"
          className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine"
        >
          Back to the shop
          <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
            Almost yours
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">
            Checkout
          </h1>
        </div>
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-pine">
          <IconCheck className="size-4" /> 30-day empty-bottle returns on everything
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate>
          {/* contact */}
          <fieldset className="rounded-2xl border border-ink/10 p-6 sm:p-8">
            <legend className="float-left mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
              01 · Contact
            </legend>
            <div className="clear-both">
              <label className={labelCls} htmlFor="co-email">
                Email
              </label>
              <input
                id="co-email"
                type="email"
                autoComplete="email"
                placeholder="you@fastmail.com"
                value={fields.email}
                onChange={set("email")}
                className={inputCls}
              />
              {err("email")}
            </div>
          </fieldset>

          {/* shipping */}
          <fieldset className="mt-6 rounded-2xl border border-ink/10 p-6 sm:p-8">
            <legend className="float-left mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
              02 · Shipping
            </legend>
            <div className="clear-both grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="co-name">
                  Full name
                </label>
                <input
                  id="co-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Strong"
                  value={fields.name}
                  onChange={set("name")}
                  className={inputCls}
                />
                {err("name")}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="co-address">
                  Address
                </label>
                <input
                  id="co-address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="1205 Hypertrophy Ave"
                  value={fields.address}
                  onChange={set("address")}
                  className={inputCls}
                />
                {err("address")}
              </div>
              <div>
                <label className={labelCls} htmlFor="co-city">
                  City
                </label>
                <input
                  id="co-city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Mumbai"
                  value={fields.city}
                  onChange={set("city")}
                  className={inputCls}
                />
                {err("city")}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="co-state">
                    State
                  </label>
                  <input
                    id="co-state"
                    type="text"
                    autoComplete="address-level1"
                    placeholder="UT"
                    value={fields.state}
                    onChange={set("state")}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="co-zip">
                    PIN code
                  </label>
                  <input
                    id="co-zip"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="560001"
                    value={fields.zip}
                    onChange={set("zip")}
                    className={inputCls}
                  />
                  {err("zip")}
                </div>
              </div>
            </div>
          </fieldset>

          {/* payment */}
          <fieldset className="mt-6 rounded-2xl border border-ink/10 p-6 sm:p-8">
            <legend className="float-left mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
              03 · Payment
            </legend>
            <div className="clear-both grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="co-cardname">
                  Name on card
                </label>
                <input
                  id="co-cardname"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Alex Strong"
                  value={fields.cardName}
                  onChange={set("cardName")}
                  className={inputCls}
                />
                {err("cardName")}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="co-cardnum">
                  Card number
                </label>
                <input
                  id="co-cardnum"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  value={fields.cardNumber}
                  onChange={set("cardNumber")}
                  className={inputCls}
                />
                {err("cardNumber")}
              </div>
              <div>
                <label className={labelCls} htmlFor="co-exp">
                  Expiry
                </label>
                <input
                  id="co-exp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={fields.expiry}
                  onChange={set("expiry")}
                  className={inputCls}
                />
                {err("expiry")}
              </div>
              <div>
                <label className={labelCls} htmlFor="co-cvc">
                  CVC
                </label>
                <input
                  id="co-cvc"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={fields.cvc}
                  onChange={set("cvc")}
                  className={inputCls}
                />
                {err("cvc")}
              </div>
            </div>
          </fieldset>

          <div id="checkout-errors" className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xs text-xs leading-relaxed text-ink-2">
              Demo storefront: card details are validated locally and never stored or
              charged.
            </p>
            <button
              type="submit"
              disabled={processing}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-10 py-4.5 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-all enabled:hover:bg-pine disabled:opacity-60"
            >
              {processing ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  Pay {money(total)}
                  <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {summary}
      </div>
    </div>
  );
}
