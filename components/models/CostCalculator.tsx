"use client";

import { useState } from "react";
import { formatTokensM, formatUsd } from "@/lib/format";
import { LINKS } from "@/lib/links";
import { MODELS, getModel } from "@/lib/mock/models";

export function CostCalculator() {
  const [modelId, setModelId] = useState("claude-sonnet-4-5");
  const [inM, setInM] = useState(300);
  const [outM, setOutM] = useState(60);

  const m = getModel(modelId)!;
  const official = inM * m.official.in + outM * m.official.out;
  const ours = inM * m.tokhive.in + outM * m.tokhive.out;
  const pct = Math.round((1 - ours / official) * 100);

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,520px),1fr))] gap-6 pt-24">
      <div className="flex flex-col gap-7 rounded-card bg-surface p-9 max-sm:p-6">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow">COST CALCULATOR</span>
          <span className="text-[28px] font-semibold tracking-[-0.02em]">What would your month cost?</span>
        </div>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted">MODEL</span>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="h-11 rounded-input border border-line-hero bg-bg px-3 text-sm text-paper"
          >
            {MODELS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <Range label="INPUT TOKENS / MONTH" value={inM} max={2000} onChange={setInM} />
        <Range label="OUTPUT TOKENS / MONTH" value={outM} max={500} onChange={setOutM} />
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-card bg-volt p-9 text-ink max-sm:p-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs font-medium tracking-[0.14em]">YOU SAVE / MONTH</span>
          <span
            className="font-mono text-[80px] leading-none font-medium tracking-[-0.05em] max-sm:text-[52px]"
            aria-live="polite"
          >
            {formatUsd(official - ours)}
          </span>
          <span className="text-[15px]">{pct}% less than paying the vendor directly</span>
        </div>
        <div className="flex flex-col gap-3.5 font-mono text-[13px]">
          <Bar label="Official list price" value={formatUsd(official)} width={100} fill="bg-ink/35" />
          <Bar label="TokHive" value={formatUsd(ours)} width={(ours / official) * 100} fill="bg-ink" strong />
        </div>
        <a
          href={LINKS.getApiKey}
          className="self-start rounded-full bg-ink px-[22px] py-3.5 text-[15px] font-semibold text-paper"
        >
          Get API key →
        </a>
      </div>
    </section>
  );
}

function Range({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex justify-between font-mono text-xs text-muted">
        <span>{label}</span>
        <span className="text-paper">{formatTokensM(value)}</span>
      </span>
      <input
        type="range"
        min={1}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}

function Bar({ label, value, width, fill, strong }: { label: string; value: string; width: number; fill: string; strong?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex justify-between ${strong ? "font-medium" : ""}`}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3.5 rounded-[3px] bg-ink/15">
        <div className={`h-full rounded-[3px] ${fill}`} style={{ width: `${width.toFixed(1)}%` }} />
      </div>
    </div>
  );
}
