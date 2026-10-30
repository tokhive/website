"use client";

import { useState } from "react";
import { useEarnings } from "@/components/home/EarningsProvider";
import { PROVIDER_PLANS } from "@/lib/mock/providers";
import { formatInt, formatUsd } from "@/lib/format";

const WEEKS_PER_MONTH = 30 / 7;

export function EarningsCalculator() {
  const [planIndex, setPlanIndex] = useState(0);
  const [usePct, setUsePct] = useState(45);
  const plan = PROVIDER_PLANS[planIndex];
  const live = useEarnings().data?.plan_capacity.find((p) => p.platform === plan.platform && p.plan === plan.plan);
  // The most an account on this plan earns with all of its quota sold; the sample until Hive measured one.
  const full = live ? Number(live.max_weekly_provider_usd) * WEEKS_PER_MONTH : plan.sample;
  const shared = 100 - usePct;
  const monthly = (full * shared) / 100;
  const cover =
    monthly >= plan.price
      ? `covers your plan ×${(monthly / plan.price).toFixed(1)}`
      : `covers ${Math.round((monthly / plan.price) * 100)}% of your plan`;
  return (
    <div className="earnings-calculator overflow-hidden rounded-card-lg border border-paper/10 bg-surface">
      <div className="flex flex-col gap-[22px] p-7 max-md:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="eyebrow">Earnings estimate</h2>
          <span className="font-mono text-[11px] text-muted-2">
            {live ? `measured on ${formatInt(live.accounts)} ${live.accounts === 1 ? "account" : "accounts"} · current prices` : "illustrative estimate"}
          </span>
        </div>
        <fieldset>
          <legend className="mb-2 font-mono text-xs text-muted">YOUR PLAN</legend>
          <div className="grid grid-cols-3 gap-1.5 max-md:grid-cols-2">
            {PROVIDER_PLANS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={planIndex === i}
                onClick={() => setPlanIndex(i)}
                className={`flex min-h-14 cursor-pointer flex-col gap-0.5 rounded-input border px-3 py-2.5 text-left ${planIndex === i ? "border-transparent bg-volt text-ink" : "border-line bg-bg"}`}
              >
                <span className="text-[13px] font-semibold">{p.name}</span>
                <span className="font-mono text-[11px] opacity-70">{p.priceLabel}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <label className="flex flex-col gap-2">
          <span className="flex justify-between gap-3 font-mono text-xs text-muted">
            <span>YOUR ESTIMATED PERSONAL USE</span>
            <span className="text-paper">{usePct}%</span>
          </span>
          <input
            aria-label="Estimated personal use"
            type="range"
            min={0}
            max={100}
            value={usePct}
            onChange={(e) => setUsePct(Number(e.target.value))}
          />
        </label>
        <div className="flex flex-col gap-2">
          <div
            className="flex h-3.5 gap-0.5 overflow-hidden rounded-[3px]"
            role="img"
            aria-label={`${usePct}% estimated personal use, ${shared}% estimated unused quota`}
          >
            <span className="bg-[#5E6163]" style={{ flex: usePct }} />
            <span className="bg-volt" style={{ flex: shared }} />
          </div>
          <div className="flex gap-4 font-mono text-[11px] text-muted">
            <span>■ personal use</span>
            <span className="text-volt">■ unused · {shared}%</span>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted">Estimate your unused quota. Start and stop sharing manually with Bee.</p>
      </div>
      <div
        className="calculator-result grid grid-cols-[1fr_auto] items-end gap-2 bg-volt px-7 py-6 text-ink max-md:grid-cols-1 max-md:px-5"
        aria-live="polite"
      >
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] font-medium tracking-[.14em]">EST. MONTHLY EARNINGS</span>
          <span className="font-mono text-[60px] leading-none font-medium tracking-[-.05em] max-md:text-[52px]">
            {formatUsd(monthly)}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right font-mono text-[13px] max-md:flex-row max-md:justify-between max-md:text-xs">
          <span>{formatUsd(full)} / mo at full use</span>
          <span>{formatUsd(monthly * 12)} / year</span>
          <span className="font-medium">{cover}</span>
        </div>
      </div>
    </div>
  );
}
