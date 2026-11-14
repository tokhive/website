"use client";

import { useTranslations } from "next-intl";
import { useEarnings } from "@/components/home/EarningsProvider";
import { formatCompactEarnings } from "@/lib/public-earnings";

export function PaidOut() {
  const t = useTranslations("Home.paidOut");
  const { data, status } = useEarnings();
  return (
    <span className="font-mono text-[13px] text-muted" title={t("title")} aria-live="polite">
      {data ? t("amount", { amount: formatCompactEarnings(data.all_time_usd) }) : status === "loading" ? t("loading") : t("unavailable")}
    </span>
  );
}
