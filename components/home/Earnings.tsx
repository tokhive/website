"use client";

import { useEarnings } from "@/components/home/EarningsProvider";
import { earningsBarHeights, earningsMonthLabel, formatEarningsUsd } from "@/lib/public-earnings";

export function Earnings() {
  const { data, status, retry } = useEarnings();
  const heights = data ? earningsBarHeights(data.monthly) : [];
  return (
    <section className="home-earnings site-container pb-[120px] max-[899px]:pb-20">
      <div className="grid gap-14 rounded-card-lg bg-surface p-14 max-[899px]:p-8 min-[900px]:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="eyebrow">PROVIDER EARNINGS · ALL TIME</span>
          <span className="break-all font-mono text-[80px] leading-none font-medium tracking-[-0.05em] max-[1100px]:text-[64px] max-sm:text-[44px]" aria-live="polite">
            {data ? formatEarningsUsd(data.all_time_usd) : "—"}
          </span>
          <span className="max-w-[460px] text-base leading-[1.55] text-text-2">
            {data ? (
              <>Earnings settle in real time after each successful request. {data.average_monthly_provider_usd === null
                ? `No providers earned income in ${earningsMonthLabel(data.average_month, true)}.`
                : `Earning providers averaged ${formatEarningsUsd(data.average_monthly_provider_usd)} in ${earningsMonthLabel(data.average_month, true)}.`}</>
            ) : status === "loading" ? "Loading settled provider earnings…" : (
              <>Earnings are temporarily unavailable. <button type="button" onClick={retry} className="cursor-pointer text-volt underline">Try again</button></>
            )}
          </span>
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex h-[180px] items-end gap-1.5" role="img" aria-label="Monthly settled provider earnings in USD, UTC" aria-busy={status === "loading"}>
            {data?.monthly.map((point, i) => (
              <div
                key={point.month}
                className={`clip-peak flex-1 ${i === data.monthly.length - 1 ? "bg-volt" : "bg-paper/16"}`}
                style={{ height: `${heights[i]}%` }}
                title={`${earningsMonthLabel(point.month, true)}: ${formatEarningsUsd(point.amount_usd)}${i === data.monthly.length - 1 ? " (month to date, UTC)" : " (UTC)"}`}
              />
            ))}
          </div>
          <div className="mt-2.5 flex justify-between font-mono text-[11px] text-muted">
            <span>{data ? earningsMonthLabel(data.monthly[0].month) : "—"}</span>
            <span>monthly earnings · UTC</span>
            <span>{data ? earningsMonthLabel(data.monthly[data.monthly.length - 1].month) : "—"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
