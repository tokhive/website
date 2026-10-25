"use client";

import { useMemo, useState } from "react";
import { Chip, Segmented } from "@/components/Chip";
import { getUsage, NET_VENDOR_COLORS, RANGE_META, type NetVendor, type UsageRange } from "@/lib/mock/network";

const VENDOR_FILTERS = ["All", "Anthropic", "OpenAI", "Google"] as const;
const RANGES = ["24h", "7d", "30d"] as const;
// Bottom to top.
const STACK: NetVendor[] = ["Anthropic", "OpenAI", "Google"];

export function TokenUsage() {
  const [range, setRange] = useState<UsageRange>("24h");
  const [vendor, setVendor] = useState<(typeof VENDOR_FILTERS)[number]>("All");

  const { bars, total } = useMemo(() => {
    const { bars, totalB } = getUsage(range);
    const shown = STACK.filter((v) => vendor === "All" || v === vendor);
    const sum = (b: (typeof bars)[number], vs: NetVendor[]) => vs.reduce((t, v) => t + b[v], 0);
    const max = Math.max(...bars.map((b) => sum(b, shown))) || 1;
    const all = bars.reduce((t, b) => t + sum(b, STACK), 0);
    const part = bars.reduce((t, b) => t + sum(b, shown), 0);
    const totalShown = (totalB * part) / all;
    return {
      bars: bars.map((b) => ({
        label: b.label,
        segments: shown.map((v) => ({ v, pct: (b[v] / max) * 96 })),
      })),
      total: totalShown >= 100 ? totalShown.toFixed(0) + "B" : totalShown.toFixed(1) + "B",
    };
  }, [range, vendor]);

  const meta = RANGE_META[range];

  return (
    <section className="token-usage rounded-card bg-surface p-8 max-sm:p-5">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-muted">TOKEN USAGE</span>
          <div className="flex flex-wrap items-baseline gap-3.5">
            <span className="font-mono text-5xl font-medium tracking-[-0.04em]">{total}</span>
            <span className="text-sm text-muted">tokens · {meta.label}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-1.5">
            {VENDOR_FILTERS.map((v) => (
              <Chip key={v} active={vendor === v} onClick={() => setVendor(v)}>
                {v}
              </Chip>
            ))}
          </div>
          <Segmented options={RANGES} value={range} onChange={setRange} label="Range" className="bg-bg" />
        </div>
      </div>
      <div
        className="flex h-[240px] items-end gap-1 border-b border-line"
        role="img"
        aria-label={`Token usage, ${meta.label}, stacked by vendor`}
      >
        {bars.map((b) => (
          <div key={b.label} title={b.label} className="flex h-full flex-1 flex-col-reverse gap-0.5">
            {b.segments.map((s) => (
              <div
                key={s.v}
                className="rounded-[2px]"
                style={{ height: `${s.pct.toFixed(1)}%`, background: NET_VENDOR_COLORS[s.v] }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-3 font-mono text-[11px] text-muted">
        <span>{meta.axisL}</span>
        <div className="flex gap-[18px]">
          {STACK.map((v) => (
            <span key={v} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: NET_VENDOR_COLORS[v] }} />
              {v}
            </span>
          ))}
        </div>
        <span>{meta.axisR}</span>
      </div>
    </section>
  );
}
