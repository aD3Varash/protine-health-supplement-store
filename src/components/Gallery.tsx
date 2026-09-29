"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/assets";

const CAPTIONS = ["", "In the family", "In the field"];

export default function Gallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bone-2">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={assetUrl(src)}
            alt={i === 0 ? name : `${name} — ${CAPTIONS[i] ?? "detail"}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx((idx - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bone/90 text-ink opacity-0 shadow-md transition-all duration-300 hover:bg-ink hover:text-bone focus-visible:opacity-100 md:hover:opacity-100"
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                <path d="M20 12H4m0 0 6-6m-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIdx((idx + 1) % images.length)}
              className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bone/90 text-ink opacity-0 shadow-md transition-all duration-300 hover:bg-ink hover:text-bone focus-visible:opacity-100 md:hover:opacity-100"
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                <path d="M4 12h16m0 0-6-6m6 6-6 6" />
              </svg>
            </button>
            {idx > 0 && (
              <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone">
                {CAPTIONS[idx]}
              </span>
            )}
            <span className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-bone">
              {idx + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={"thumb" + i}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative size-20 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                i === idx
                  ? "border-ink"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
              aria-current={i === idx}
            >
              <img src={assetUrl(src)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
