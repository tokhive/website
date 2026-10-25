"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip } from "@/components/Chip";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { formatPrice } from "@/lib/format";
import { FEATURED_MODELS, savingsPct, type Vendor } from "@/lib/mock/models";

const FILTERS: ("All" | Vendor)[] = ["All", "Anthropic", "OpenAI", "Google"];
const TONES = ["bg-volt text-ink", "bg-surface-2 text-paper", "bg-surface-3 text-paper"];

export function HiveMenu() {
  const [vendor, setVendor] = useState<(typeof FILTERS)[number]>("All");
  // A row of 4 plus the offset needs ~1212px, so drop to 2 per row before it would overflow.
  const narrow = useMediaQuery("(max-width: 1239px)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const perRow = narrow ? 2 : 4;

  const tiles = FEATURED_MODELS.filter((m) => vendor === "All" || m.vendor === vendor);
  const rows: (typeof tiles)[] = [];
  for (let i = 0; i < tiles.length;) {
    const count = mobile ? (rows.length % 2 ? 1 : 2) : perRow;
    rows.push(tiles.slice(i, i + count));
    i += count;
  }

  return (
    <section className="hive-menu site-container pb-[120px] max-[899px]:pb-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="h2">The hive menu.</h2>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Chip
              key={f}
              active={vendor === f}
              onClick={() => setVendor(f)}
              className="h-auto px-4 py-[9px] text-[13px]"
            >
              {f}
            </Chip>
          ))}
        </div>
      </div>
      <div className={`honeycomb flex flex-col items-center ${narrow ? "comb-2" : ""}`}>
        {rows.map((row, r) => (
          <div key={r} className={`flex gap-2 ${r ? "comb-pull" : ""} ${r % 2 ? "comb-offset" : ""}`}>
            {row.map((m) => {
              const idx = tiles.indexOf(m);
              return (
                <div
                  key={m.id}
                  className={`comb-tile clip-hex flex flex-col items-center justify-center gap-1.5 text-center ${TONES[idx % 3]}`}
                >
                  <span className="font-mono text-[11px] tracking-[0.06em] opacity-70">{m.vendor}</span>
                  <span className="comb-name leading-[1.15] font-semibold tracking-[-0.01em]">{m.name}</span>
                  <span className="mt-1.5 font-mono text-[13px]">
                    {formatPrice(m.tokhive.in)}{" "}
                    <span className="line-through opacity-60">{formatPrice(m.official.in)}</span>
                  </span>
                  <span className="font-mono text-[11px] opacity-70">per 1M input</span>
                  <span className="mt-1.5 font-mono text-[15px] font-semibold">−{savingsPct(m)}%</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-5 text-center md:hidden">
        <Link href="/models" className="border-b border-volt pb-0.5 text-sm font-semibold">
          All models &amp; pricing →
        </Link>
      </div>
    </section>
  );
}
