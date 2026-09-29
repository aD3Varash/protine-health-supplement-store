"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { IconArrow, IconCheck } from "@/components/ui";

const inputClass = "w-full rounded-lg border border-ink/20 bg-bone px-4 py-3 text-sm placeholder:text-ink-2/60";

export default function LoginPage() {
  const { profile, signIn, signOut } = useAuth();
  const router = useRouter();
  const [createAccount, setCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for the demo password.");
      return;
    }
    if (createAccount && name.trim().length < 2) {
      setError("Add your name to create a demo account.");
      return;
    }
    const inferredName = email.trim().split("@")[0].replace(/[._-]+/g, " ");
    signIn({ name: createAccount ? name.trim() : inferredName.replace(/\b\w/g, (c) => c.toUpperCase()), email: email.trim() });
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  };

  return (
    <div className="mx-auto grid min-h-[65vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">Your ProTine account</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Good to have you <em className="font-medium text-pine">back.</em>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-ink-2">
          Sign in to keep your demo profile handy at checkout. This account stays in this browser only.
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-ink/10 bg-bone-2/50 p-4 text-sm text-ink-2">
          <IconCheck className="size-5 shrink-0 text-pine" /> No account server, password storage, or email is involved.
        </div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-2xl border border-ink/10 bg-bone p-6 sm:p-8">
        {profile ? (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">Signed in</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="mt-2 text-sm text-ink-2">{profile.email}</p>
            <Link href="/shop" className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine">
              Continue shopping <IconArrow className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button type="button" onClick={() => { signOut(); setEmail(""); }} className="mt-4 w-full font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 underline underline-offset-4 hover:text-ink">
              Sign out
            </button>
          </>
        ) : (
          <>
            <div className="mb-7 flex gap-5 border-b border-ink/10">
              <button type="button" onClick={() => { setCreateAccount(false); setError(""); }} className={`pb-3 font-mono text-[11px] uppercase tracking-[0.14em] ${!createAccount ? "border-b border-ink text-ink" : "text-ink-2"}`}>Sign in</button>
              <button type="button" onClick={() => { setCreateAccount(true); setError(""); }} className={`pb-3 font-mono text-[11px] uppercase tracking-[0.14em] ${createAccount ? "border-b border-ink text-ink" : "text-ink-2"}`}>Create account</button>
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">{createAccount ? "Start your profile" : "Welcome back"}</h2>
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              {createAccount && (
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Full name</span>
                  <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Strong" className={inputClass} />
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Email</span>
                <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@fastmail.com" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Demo password</span>
                <input type="password" autoComplete={createAccount ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} />
              </label>
              {error && <p className="text-sm text-clay">{error}</p>}
              <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine">
                {createAccount ? "Create demo account" : "Sign in"}
                <IconArrow className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
            <p className="mt-5 text-center text-xs leading-relaxed text-ink-2">Any email and 6+ character password work. Passwords are never saved.</p>
          </>
        )}
      </div>
    </div>
  );
}
