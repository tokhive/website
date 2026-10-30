"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip } from "@/components/Chip";
import { ModelsStatus, useModels } from "@/components/ModelsProvider";
import { hiveMenuRows } from "@/lib/hive-menu-layout";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { formatInputPrice, modelPlatformLabel, modelSavings } from "@/lib/public-models";

const TONES = ["bg-volt text-ink", "bg-surface-2 text-paper", "bg-surface-3 text-paper"];

export function HiveMenu() {
  const { models, status } = useModels();
  const [platform, setPlatform] = useState("");
  const platforms = [...new Set(models.map((model) => model.platform))];
  const selected = platforms.includes(platform) ? platform : "";
  // A row of 4 plus the offset needs ~1212px, so drop to 2 per row before it would overflow.
  const narrow = useMediaQuery("(max-width: 1239px)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const perRow = narrow ? 2 : 4;

  const tiles = models.filter((m) => !selected || m.platform === selected);
  const rows = hiveMenuRows(tiles, perRow, mobile).slice(0, 3);

  return (
    <section className="hive-menu site-container pb-[120px] max-[899px]:pb-20" aria-busy={status === "loading"}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="h2">The hive menu.</h2>
        <div className="flex flex-wrap gap-2">
          {["", ...platforms].map((f) => (
            <Chip
              key={f}
              active={selected === f}
              onClick={() => setPlatform(f)}
              className="h-auto px-4 py-[9px] text-[13px]"
            >
              {f ? modelPlatformLabel(f) : "All"}
            </Chip>
          ))}
        </div>
      </div>
      <ModelsStatus />
      <div className={`honeycomb flex flex-col items-center ${narrow ? "comb-2" : ""}`}>
        {rows.map((row, r) => (
          <div key={r} className={`flex gap-2 ${r ? "comb-pull" : ""} ${r % 2 ? "comb-offset" : ""}`}>
            {row.map((m, column) => {
              if (m === null) {
                return <div key={`empty-${column}`} aria-hidden="true" className="comb-tile invisible" />;
              }
              const idx = tiles.indexOf(m);
              const savings = modelSavings(m);
              return (
                <div
                  key={m.id}
                  className={`comb-tile clip-hex flex flex-col items-center justify-center gap-1.5 text-center ${TONES[idx % 3]}`}
                >
                  <span className="font-mono text-[11px] tracking-[0.06em] opacity-70">{modelPlatformLabel(m.platform)}</span>
                  <span className="comb-name leading-[1.15] font-semibold tracking-[-0.01em]">{m.name}</span>
                  <span className="mt-1.5 max-w-full break-all font-mono text-[13px]">
                    {m.minimum_input_price === null ? "Unavailable" : formatInputPrice(m.minimum_input_price)}{" "}
                    {savings !== null && m.official_input_price !== null && (
                      <span className="line-through opacity-60">{formatInputPrice(m.official_input_price)}</span>
                    )}
                  </span>
                  <span className="font-mono text-[11px] opacity-70">per 1M input</span>
                  {savings !== null && <span className="mt-1.5 font-mono text-[15px] font-semibold">−{savings}%</span>}
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
