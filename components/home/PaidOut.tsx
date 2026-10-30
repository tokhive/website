"use client";

import { useEarnings } from "@/components/home/EarningsProvider";
import { formatCompactEarnings } from "@/lib/public-earnings";

export function PaidOut() {
  const { data, status } = useEarnings();
  return (
    <span className="font-mono text-[13px] text-muted" title="Settled provider earnings" aria-live="polite">
      {data ? `${formatCompactEarnings(data.all_time_usd)} paid out` : status === "loading" ? "Loading earnings…" : "Earnings unavailable"}
    </span>
  );
}
