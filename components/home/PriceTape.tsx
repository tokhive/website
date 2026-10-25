import { formatPrice } from "@/lib/format";
import { FEATURED_MODELS, savingsPct } from "@/lib/mock/models";

export function PriceTape() {
  return (
    <div className="flex price-tape overflow-hidden border-y border-line whitespace-nowrap">
      {FEATURED_MODELS.map((m) => (
        <div
          key={m.id}
          className="flex flex-none items-baseline gap-3 border-r border-line-soft px-7 py-4 font-mono text-[13px]"
        >
          <span className="text-text-2">{m.id}</span>
          <span>{formatPrice(m.tokhive.in)}/M</span>
          <span className="text-volt">−{savingsPct(m)}%</span>
        </div>
      ))}
    </div>
  );
}
