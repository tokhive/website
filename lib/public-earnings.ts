export type MonthlyEarnings = { month: string; amount_usd: string };
/** What one account on a plan earns in a week with all of its quota sold, at current prices and demand. */
export type PlanCapacity = { platform: string; plan: string; accounts: number; max_weekly_provider_usd: string };
export type PublicEarnings = {
  currency: "USD";
  basis: "settled_provider_earnings";
  timezone: "UTC";
  as_of: string;
  all_time_usd: string;
  average_month: string;
  average_monthly_provider_usd: string | null;
  earning_providers: number;
  monthly: MonthlyEarnings[];
  plan_capacity: PlanCapacity[];
};

const isAmount = (value: unknown): value is string => typeof value === "string" && /^\d+(?:\.\d{1,9})?$/.test(value);
const nanos = (amount: string): bigint => {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(9, "0"));
};
const monthKey = (date: Date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

export function parsePublicEarnings(value: unknown): PublicEarnings {
  if (!value || typeof value !== "object") throw new Error("Invalid earnings response");
  const data = value as Record<string, unknown>;
  if (data.currency !== "USD" || data.basis !== "settled_provider_earnings" || data.timezone !== "UTC" ||
    typeof data.as_of !== "string" || !/^\d{4}-\d{2}-\d{2}T.*Z$/.test(data.as_of) || !Number.isFinite(Date.parse(data.as_of)) ||
    !isAmount(data.all_time_usd) || typeof data.average_month !== "string" ||
    !(data.average_monthly_provider_usd === null || isAmount(data.average_monthly_provider_usd)) ||
    typeof data.earning_providers !== "number" || !Number.isSafeInteger(data.earning_providers) || data.earning_providers < 0 ||
    !Array.isArray(data.monthly) || data.monthly.length !== 12) {
    throw new Error("Invalid earnings response");
  }
  const at = new Date(data.as_of);
  const end = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), 1));
  const previous = new Date(end);
  previous.setUTCMonth(previous.getUTCMonth() - 1);
  if (data.average_month !== monthKey(previous) ||
    (data.earning_providers === 0) !== (data.average_monthly_provider_usd === null)) {
    throw new Error("Invalid earnings response");
  }
  const monthly = data.monthly.map((item: unknown, index): MonthlyEarnings => {
    const expected = new Date(end);
    expected.setUTCMonth(expected.getUTCMonth() - 11 + index);
    if (!item || typeof item !== "object" || !("month" in item) || item.month !== monthKey(expected) ||
      !("amount_usd" in item) || !isAmount(item.amount_usd)) {
      throw new Error("Invalid earnings response");
    }
    return { month: item.month, amount_usd: item.amount_usd };
  });
  if (monthly.reduce((sum, item) => sum + nanos(item.amount_usd), BigInt(0)) > nanos(data.all_time_usd)) {
    throw new Error("Invalid earnings response");
  }
  // Older Hive releases do not report plan capacity yet.
  const plans = data.plan_capacity ?? [];
  if (!Array.isArray(plans)) throw new Error("Invalid earnings response");
  const plan_capacity = plans.map((item: unknown): PlanCapacity => {
    const p = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    if (typeof p.platform !== "string" || typeof p.plan !== "string" || typeof p.accounts !== "number" ||
      !Number.isSafeInteger(p.accounts) || p.accounts < 1 || !isAmount(p.max_weekly_provider_usd)) {
      throw new Error("Invalid earnings response");
    }
    return { platform: p.platform, plan: p.plan, accounts: p.accounts, max_weekly_provider_usd: p.max_weekly_provider_usd };
  });
  return {
    currency: "USD", basis: "settled_provider_earnings", timezone: "UTC", as_of: data.as_of,
    all_time_usd: data.all_time_usd, average_month: data.average_month,
    average_monthly_provider_usd: data.average_monthly_provider_usd,
    earning_providers: data.earning_providers, monthly, plan_capacity,
  };
}

export async function fetchPublicEarnings(baseUrl: string, signal?: AbortSignal): Promise<PublicEarnings> {
  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/public/earnings`, {
    signal, credentials: "omit", cache: "no-store",
  });
  if (!response.ok) throw new Error(`Earnings request failed (${response.status})`);
  return parsePublicEarnings(await response.json());
}

/** Presentation rounds to cents; a tiny nonzero earning is never shown as zero. */
export function formatEarningsUsd(amount: string): string {
  const units = nanos(amount);
  if (units > BigInt(0) && units < BigInt(10_000_000)) return "<$0.01";
  const cents = (units + BigInt(5_000_000)) / BigInt(10_000_000);
  const whole = String(cents / BigInt(100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fraction = cents % BigInt(100);
  return `$${whole}${fraction ? `.${String(fraction).padStart(2, "0")}` : ""}`;
}

export function formatCompactEarnings(amount: string): string {
  const units = nanos(amount);
  const tiers = [["T", BigInt("1000000000000000000000")], ["B", BigInt("1000000000000000000")],
    ["M", BigInt("1000000000000000")], ["K", BigInt("1000000000000")]] as const;
  for (const [index, [label, size]] of tiers.entries()) {
    if (units >= size) {
      const tenths = (units * BigInt(10) + size / BigInt(2)) / size;
      if (tenths >= BigInt(10000) && index > 0) return `$1${tiers[index - 1][0]}`;
      return `$${tenths / BigInt(10)}${tenths % BigInt(10) ? `.${tenths % BigInt(10)}` : ""}${label}`;
    }
  }
  return formatEarningsUsd(amount);
}

/** "December 2025" / "Dec ’25" in English, "2025年12月" / "25年12月" in Chinese. */
export function earningsMonthLabel(month: string, long = false, locale = "en"): string {
  const date = new Date(`${month}-01T00:00:00Z`);
  if (locale === "zh") return `${long ? month.slice(0, 4) : month.slice(2, 4)}年${Number(month.slice(5, 7))}月`;
  if (long) return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  return `${new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(date)} ’${month.slice(2, 4)}`;
}

export function earningsBarHeights(monthly: MonthlyEarnings[]): number[] {
  const values = monthly.map((item) => nanos(item.amount_usd));
  const max = values.reduce((a, b) => a > b ? a : b, BigInt(0));
  return values.map((value) => max === BigInt(0) ? 0 : Number(value * BigInt(9400) / max) / 100);
}
