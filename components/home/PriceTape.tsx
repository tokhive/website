"use client";

import { ModelsStatus, useModels } from "@/components/ModelsProvider";
import { formatInputPrice, modelSavings } from "@/lib/public-models";

export function PriceTape() {
  const { models, status } = useModels();
  // Only models someone offers right now have a price to show.
  const offered = models.filter((m) => m.minimum_input_price !== null);
  return (
    <div className="flex price-tape overflow-hidden border-y border-line whitespace-nowrap" aria-busy={status === "loading"}>
      <ModelsStatus />
      {offered.map((m) => {
        const savings = modelSavings(m);
        return (
          <div
            key={m.id}
            className="flex flex-none items-baseline gap-3 border-r border-line-soft px-7 py-4 font-mono text-[13px]"
          >
            <span className="text-text-2">{m.id}</span>
            <span>{formatInputPrice(m.minimum_input_price!)}/M</span>
            {savings !== null && <span className="text-volt">−{savings}%</span>}
          </div>
        );
      })}
    </div>
  );
}
