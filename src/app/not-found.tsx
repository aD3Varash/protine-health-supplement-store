import Link from "next/link";
import { IconArrow } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
        Error 404
      </p>
      <h1 className="mt-4 font-display text-6xl font-black tracking-tight sm:text-7xl">
        Out of the <em className="font-medium italic text-pine">gym.</em>
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-ink-2">
        The page you are after either took a long rest day or was never on the program.
        The shop, however, is wide open.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:bg-pine"
        >
          Back home
          <IconArrow className="size-4" />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2.5 rounded-full border border-ink/25 px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-bone"
        >
          Shop all
        </Link>
      </div>
    </div>
  );
}
