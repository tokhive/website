"use client";

import { useModels } from "@/components/ModelsProvider";
import { useNetworkSnapshot } from "@/components/network/useNetworkSnapshot";
import { weightedSavings } from "@/lib/public-models";

/** Input-price saving vs official list prices, weighted by the last 24 hours of usage. */
export function AvgSaving() {
  const { models } = useModels();
  const usage = useNetworkSnapshot()?.models;
  const savings = usage ? weightedSavings(models, usage) : null;
  if (savings === null) return null;
  return (
    <span className="font-mono text-[13px] text-muted" title="Input price, weighted by the last 24 hours of usage">
      avg. −{savings}% vs list
    </span>
  );
}
