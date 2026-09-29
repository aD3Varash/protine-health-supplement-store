"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ---------------- scroll reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${y}px)`,
        transition:
          "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- stars ---------------- */

function Star({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.7l2.45 4.96 5.47.79-3.96 3.86.94 5.44L10 14.18l-4.9 2.57.94-5.44L2.08 7.45l5.47-.79L10 1.7z" />
    </svg>
  );
}

export function Stars({
  value,
  className = "",
  starClass = "size-3.5",
  tone = "ink",
}: {
  value: number;
  className?: string;
  starClass?: string;
  tone?: "ink" | "lime" | "bone";
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const empty =
    tone === "lime" ? "text-bone/25" : tone === "bone" ? "text-bone/20" : "text-ink/15";
  const filled =
    tone === "lime" ? "text-lime" : tone === "bone" ? "text-bone" : "text-ink";
  return (
    <span
      className={`relative inline-flex ${className}`}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      <span className={`flex gap-0.5 ${empty}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={starClass} />
        ))}
      </span>
      <span
        className={`absolute inset-0 flex gap-0.5 overflow-hidden ${filled}`}
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${starClass} shrink-0`} />
        ))}
      </span>
    </span>
  );
}

/* ---------------- count up ---------------- */

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1500,
  className = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        if (reduced) {
          setVal(to);
          return;
        }
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ---------------- accordion ---------------- */

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-mono text-[11px] uppercase tracking-[0.18em]"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span
          className={`text-ink-2 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          <IconPlus className="size-4" />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm leading-relaxed text-ink-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- marquee ---------------- */

export function Marquee({
  children,
  speed = 30,
  className = "",
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`marquee-paused overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={
          {
            "--marquee-speed": `${speed}s`,
            animationDirection: reverse ? "reverse" : undefined,
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- icons ---------------- */

type IconProps = { className?: string };
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export const IconBag = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M6 8h12l1 13H5L6 8z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

export const IconPlus = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const IconArrow = ({ className = "size-4" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M4 12h16m0 0-6-6m6 6-6 6" />
  </svg>
);

export const IconCheck = ({ className = "size-4" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M4 12.5 9.5 18 20 6.5" />
  </svg>
);

export const IconX = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M3 7h18M3 12h18M3 17h12" />
  </svg>
);

export const IconChevron = ({ className = "size-4" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconFlask = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M10 3h4M10 3v6l-6.2 10.2A2 2 0 0 0 5.5 22h13a2 2 0 0 0 1.7-2.8L14 9V3" />
    <path d="M7.5 15h9" />
  </svg>
);

export const IconShield = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M12 2 4.5 5v6.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V5L12 2z" />
    <path d="m8.8 11.8 2.3 2.3 4.2-4.6" />
  </svg>
);

export const IconTruck = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M1.5 6h13v11h-13zM14.5 10h4l3 3.5V17h-7" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17.5" cy="18" r="2" />
  </svg>
);

export const IconLeaf = ({ className = "size-5" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <path d="M5 19c0-8 4-14 14-14 0 10-5 14-11 14" />
    <path d="M5 19c3-4 6-7 10-9" />
  </svg>
);

export const IconSearch = ({ className = "size-4" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </svg>
);

export const IconLock = ({ className = "size-4" }: IconProps) => (
  <svg {...svgProps} className={className}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const IconSpark = ({ className = "size-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" />
  </svg>
);

/* ---------------- qty stepper ---------------- */

export function QtyStepper({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (q: number) => void;
  small?: boolean;
}) {
  const btn = `grid place-items-center text-ink transition-colors hover:text-pine ${
    small ? "size-7" : "size-9"
  }`;
  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink/20 ${
        small ? "h-7" : "h-10"
      }`}
    >
      <button type="button" className={btn} onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        <IconMinus className="size-3.5" />
      </button>
      <span className={`min-w-6 text-center font-mono ${small ? "text-xs" : "text-sm"}`}>
        {qty}
      </span>
      <button type="button" className={btn} onClick={() => onChange(qty + 1)} aria-label="Increase quantity">
        <IconPlus className="size-3.5" />
      </button>
    </div>
  );
}
