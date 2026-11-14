"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Chip, Segmented } from "@/components/Chip";
import { NET_VENDOR_COLORS } from "@/components/network/Breakdowns";
import {
  formatTokens, RANGE_POINTS, VENDOR_NAMES, VENDORS, type NetVendor, type PublicNetwork, type UsageRange,
} from "@/lib/public-network";

const VENDOR_FILTERS = ["All", ...VENDORS] as const;
const RANGES = ["24h", "7d", "30d"] as const;
const axisLabel = (start: string, range: UsageRange, locale: string) =>
  range === "24h"
    ? start.slice(11, 16)
    : new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(start));

export function TokenUsage({ data }: { data: PublicNetwork | null }) {
  const t = useTranslations("Network.usage");
  const locale = useLocale();
  const rangeOptions = { "24h": t("rangeOptions.24h"), "7d": t("rangeOptions.7d"), "30d": t("rangeOptions.30d") };
  const [range, setRange] = useState<UsageRange>("24h");
  const [vendor, setVendor] = useState<(typeof VENDOR_FILTERS)[number]>("All");

  const { bars, total, axisL, axisR } = useMemo(() => {
    const points = data?.usage[range] ?? [];
    const shown: NetVendor[] = VENDORS.filter((v) => vendor === "All" || v === vendor);
    const sum = (p: (typeof points)[number]) => shown.reduce((t, v) => t + p[v], 0);
    const max = Math.max(0, ...points.map(sum)) || 1;
    return {
      bars: (points.length ? points : Array.from({ length: RANGE_POINTS[range] }, () => null)).map((p, i) => ({
        key: p?.start ?? String(i),
        label: p ? t("bar", { label: axisLabel(p.start, range, locale), tokens: formatTokens(sum(p)) }) : "",
        segments: shown.map((v) => ({ v, pct: p ? (p[v] / max) * 96 : 0 })),
      })),
      total: data ? formatTokens(points.reduce((t, p) => t + sum(p), 0)) : "—",
      axisL: points.length ? axisLabel(points[0].start, range, locale) : "",
      axisR: points.length ? axisLabel(points[points.length - 1].start, range, locale) : "",
    };
  }, [data, range, vendor, locale, t]);

  return (
    <section className="token-usage rounded-card bg-surface p-8 max-sm:p-5">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-muted">{t("eyebrow")}</span>
          <div className="flex flex-wrap items-baseline gap-3.5">
            <span className="font-mono text-5xl font-medium tracking-[-0.04em]">{total}</span>
            <span className="text-sm text-muted">{t("total", { range: t(`ranges.${range}`) })}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-1.5">
            {VENDOR_FILTERS.map((v) => (
              <Chip key={v} active={vendor === v} onClick={() => setVendor(v)}>
                {v === "All" ? t("all") : VENDOR_NAMES[v]}
              </Chip>
            ))}
          </div>
          <Segmented options={RANGES} value={range} onChange={setRange} label={t("rangeLabel")} labels={rangeOptions} className="bg-bg" />
        </div>
      </div>
      <div
        className="flex h-[240px] items-end gap-1 border-b border-line"
        role="img"
        aria-label={t("chart", { range: t(`ranges.${range}`) })}
      >
        {bars.map((b) => (
          <div key={b.key} title={b.label} className="flex h-full flex-1 flex-col-reverse gap-0.5">
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
        <span>{axisL}</span>
        <div className="flex gap-[18px]">
          {VENDORS.map((v) => (
            <span key={v} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: NET_VENDOR_COLORS[v] }} />
              {VENDOR_NAMES[v]}
            </span>
          ))}
        </div>
        <span>{axisR}</span>
      </div>
    </section>
  );
}
