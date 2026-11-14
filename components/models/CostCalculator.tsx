"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { formatTokensM } from "@/lib/format";
import { LINKS } from "@/lib/links";
import { ModelsStatus, useModels } from "@/components/ModelsProvider";
import { estimateModelCost, formatInputPrice, modelSavings, priceDifference } from "@/lib/public-models";

export function CostCalculator() {
  const t = useTranslations("Models.calculator");
  const common = useTranslations("Common");
  const { models, status } = useModels();
  const [modelId, setModelId] = useState("");
  const [inM, setInM] = useState(300);
  const [outM, setOutM] = useState(60);

  if (status !== "ready" || !models.length) return <ModelsStatus />;
  const m = models.find((model) => model.id === modelId) ?? models.find((model) => model.minimum_prices !== null) ?? models[0];
  const { official, minimum: ours } = estimateModelCost(m, inM, outM);
  const savings = official === null || ours === null ? null : priceDifference(official, ours);
  const extra = savings?.startsWith("-") ?? false;
  const pct = modelSavings({ official_input_price: official, minimum_input_price: ours });
  const maxCost = Math.max(Number(official ?? 0), Number(ours ?? 0));
  const width = (amount: string | null) => maxCost > 0 && amount !== null ? Number(amount) / maxCost * 100 : 0;

  return (
    <section className="cost-calculator grid grid-cols-[repeat(auto-fit,minmax(min(100%,520px),1fr))] gap-6 pt-24">
      <div className="flex flex-col gap-7 rounded-card bg-surface p-9 max-sm:p-6">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow">{t("eyebrow")}</span>
          <span className="text-[28px] font-semibold tracking-[-0.02em]">{t("title")}</span>
        </div>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted">{t("model")}</span>
          <select
            value={m.id}
            onChange={(e) => setModelId(e.target.value)}
            className="h-11 rounded-input border border-line-hero bg-bg px-3 text-sm text-paper"
          >
            {models.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <Range label={t("input")} value={inM} max={2000} onChange={setInM} />
        <Range label={t("output")} value={outM} max={500} onChange={setOutM} />
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-card bg-volt p-9 text-ink max-sm:p-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs font-medium tracking-[0.14em]">{extra ? t("additional") : t("save")}</span>
          <span
            className="break-all font-mono text-[64px] leading-none font-medium tracking-[-0.05em] max-sm:text-[44px]"
            aria-live="polite"
          >
            {savings === null ? "—" : formatInputPrice(extra ? savings.slice(1) : savings)}
          </span>
          <span className="text-[15px]">{ours === null ? t("noQuote") : extra ? t("exceeds") : pct !== null ? t("lessThan", { pct }) : t("compared")}</span>
        </div>
        <div className="flex flex-col gap-3.5 font-mono text-[13px]">
          <Bar label={t("official")} value={official === null ? "—" : formatInputPrice(official)} width={width(official)} fill="bg-ink/35" />
          <Bar label={t("tokhive")} value={ours === null ? common("unavailable") : formatInputPrice(ours)} width={width(ours)} fill="bg-ink" strong />
        </div>
        <a
          href={LINKS.getApiKey}
          className="self-start rounded-full bg-ink px-[22px] py-3.5 text-[15px] font-semibold text-paper"
        >
          {common("getApiKey")}
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
