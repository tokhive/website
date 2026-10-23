import { formatUsd } from "@/lib/format";
import { PAYOUTS } from "@/lib/mock/home";

export function Earnings() {
  const max = Math.max(...PAYOUTS.monthly);
  return (
    <section className="site-container pb-[120px] max-[899px]:pb-20">
      <div className="grid gap-14 rounded-card-lg bg-surface p-14 max-[899px]:p-8 min-[900px]:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="eyebrow">PAID TO PROVIDERS · ALL TIME</span>
          <span className="font-mono text-[96px] leading-none font-medium tracking-[-0.05em] max-[1100px]:text-[72px] max-sm:text-[48px]">
            {formatUsd(PAYOUTS.allTimeUsd)}
          </span>
          <span className="max-w-[460px] text-base leading-[1.55] text-text-2">
            Weekly payouts in USDC or bank transfer. The average active provider earns $
            {PAYOUTS.avgMonthlyPerProvider} a month from quota they weren&apos;t using.
          </span>
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex h-[180px] items-end gap-1.5" role="img" aria-label="Monthly payouts, rising each month">
            {PAYOUTS.monthly.map((v, i) => (
              <div
                key={i}
                className={`clip-peak flex-1 ${i === PAYOUTS.monthly.length - 1 ? "bg-volt" : "bg-paper/16"}`}
                style={{ height: Math.round((v / max) * 170) }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex justify-between font-mono text-[11px] text-muted">
            <span>{PAYOUTS.fromLabel}</span>
            <span>monthly payouts</span>
            <span>{PAYOUTS.toLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
