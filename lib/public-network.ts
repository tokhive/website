export type NetVendor = "openai" | "anthropic";
export type UsageRange = "24h" | "7d" | "30d";
export type UsagePoint = { start: string; openai: number; anthropic: number };
export type NetworkModel = { model: string; vendor: NetVendor; tokens: number; capacity_free_pct: number | null };
export type NetworkPlan = { platform: string; plan: string; accounts: number };
export type NetworkCapacity = { model: string; free_pct: number };
export type NetworkRecent = { receipt: string; model: string; vendor: NetVendor; upstream: string; signed_at: string };
export type PublicNetwork = {
  as_of: string;
  timezone: "UTC";
  supply: { providers: number; serving: number; idle: number };
  traffic: {
    tokens_24h: number;
    tokens_previous_24h: number;
    requests_24h: number;
    requests_peak_hour: number;
    first_output_p50_ms: number | null;
  };
  provider_earnings_usd: string;
  usage: Record<UsageRange, UsagePoint[]>;
  models: NetworkModel[];
  plans: NetworkPlan[];
  /** Free concurrency now, for every model with online supply. */
  capacity: NetworkCapacity[];
  attestations: { verified_30d: number; failed_30d: number; measurement: string; recent: NetworkRecent[] };
};
export type NetworkRequest = {
  id: number;
  model: string;
  vendor: NetVendor;
  tokens: number;
  duration_ms: number;
  finished_at: string;
};

export const VENDORS: NetVendor[] = ["anthropic", "openai"];
export const VENDOR_NAMES: Record<NetVendor, string> = { anthropic: "Anthropic", openai: "OpenAI" };
export const RANGE_POINTS: Record<UsageRange, number> = { "24h": 24, "7d": 7, "30d": 30 };

const invalid = (): never => {
  throw new Error("Invalid network response");
};
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : invalid();
const count = (value: unknown): number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : invalid();
const text = (value: unknown): string => (typeof value === "string" ? value : invalid());
const time = (value: unknown): string =>
  typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : invalid();
const vendor = (value: unknown): NetVendor => (value === "openai" || value === "anthropic" ? value : invalid());
const list = <T>(value: unknown, item: (value: unknown) => T): T[] => (Array.isArray(value) ? value.map(item) : invalid());

export function parsePublicNetwork(value: unknown): PublicNetwork {
  const data = record(value);
  if (data.timezone !== "UTC") invalid();
  const supply = record(data.supply);
  const traffic = record(data.traffic);
  const usage = record(data.usage);
  const attestations = record(data.attestations);
  const earnings = text(data.provider_earnings_usd);
  if (!/^\d+(?:\.\d{1,9})?$/.test(earnings)) invalid();
  const series = (range: UsageRange): UsagePoint[] => {
    const points = list(usage[range], (raw) => {
      const p = record(raw);
      return { start: time(p.start), openai: count(p.openai), anthropic: count(p.anthropic) };
    });
    return points.length === RANGE_POINTS[range] ? points : invalid();
  };
  return {
    as_of: time(data.as_of),
    timezone: "UTC",
    supply: { providers: count(supply.providers), serving: count(supply.serving), idle: count(supply.idle) },
    traffic: {
      tokens_24h: count(traffic.tokens_24h),
      tokens_previous_24h: count(traffic.tokens_previous_24h),
      requests_24h: count(traffic.requests_24h),
      requests_peak_hour: count(traffic.requests_peak_hour),
      first_output_p50_ms: traffic.first_output_p50_ms === null ? null : count(traffic.first_output_p50_ms),
    },
    provider_earnings_usd: earnings,
    usage: { "24h": series("24h"), "7d": series("7d"), "30d": series("30d") },
    models: list(data.models, (raw) => {
      const m = record(raw);
      const free = m.capacity_free_pct === null ? null : count(m.capacity_free_pct);
      return { model: text(m.model), vendor: vendor(m.vendor), tokens: count(m.tokens), capacity_free_pct: free };
    }),
    plans: list(data.plans, (raw) => {
      const p = record(raw);
      return { platform: text(p.platform), plan: text(p.plan), accounts: count(p.accounts) };
    }),
    // Older Hive releases do not report capacity yet.
    capacity: data.capacity === undefined ? [] : list(data.capacity, (raw) => {
      const c = record(raw);
      const free = count(c.free_pct);
      return { model: text(c.model), free_pct: free <= 100 ? free : invalid() };
    }),
    attestations: {
      verified_30d: count(attestations.verified_30d),
      failed_30d: count(attestations.failed_30d),
      measurement: text(attestations.measurement),
      recent: list(attestations.recent, (raw) => {
        const r = record(raw);
        return { receipt: text(r.receipt), model: text(r.model), vendor: vendor(r.vendor), upstream: text(r.upstream), signed_at: time(r.signed_at) };
      }),
    },
  };
}

export function parseNetworkRequests(value: unknown): NetworkRequest[] {
  return list(record(value).requests, (raw) => {
    const r = record(raw);
    return {
      id: count(r.id), model: text(r.model), vendor: vendor(r.vendor), tokens: count(r.tokens),
      duration_ms: count(r.duration_ms), finished_at: time(r.finished_at),
    };
  });
}

async function get(baseUrl: string, path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, { signal, credentials: "omit", cache: "no-store" });
  if (!response.ok) throw new Error(`Network request failed (${response.status})`);
  return response.json();
}

export async function fetchPublicNetwork(baseUrl: string, signal?: AbortSignal): Promise<PublicNetwork> {
  return parsePublicNetwork(await get(baseUrl, "/api/public/network", signal));
}

export async function fetchNetworkRequests(baseUrl: string, signal?: AbortSignal): Promise<NetworkRequest[]> {
  return parseNetworkRequests(await get(baseUrl, "/api/public/network/requests", signal));
}

/** Newest first, without duplicates, at most `limit` rows. */
export function mergeRequests(current: NetworkRequest[], incoming: NetworkRequest[], limit: number): NetworkRequest[] {
  const seen = new Set<number>();
  return [...incoming, ...current]
    .filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);
}

/** 1234 → "1.2K", 9_810_000_000 → "9.81B". */
export function formatTokens(n: number): string {
  const tiers: [string, number][] = [["T", 1e12], ["B", 1e9], ["M", 1e6], ["K", 1e3]];
  for (const [label, size] of tiers) {
    if (n >= size) {
      const v = n / size;
      if (v >= 100) return v.toFixed(0) + label;
      return (v >= 10 ? v.toFixed(1) : v.toFixed(2)).replace(/\.?0+$/, "") + label;
    }
  }
  return String(n);
}

/** Milliseconds → "850ms", "6.4s", "1m 12s". */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

/** Elapsed time since `at`, as of `now`: "12s ago", "5m ago", "3h ago", "2d ago". */
export function formatAgo(at: string, now: number): string {
  const s = Math.max(0, Math.round((now - Date.parse(at)) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86_400)}d ago`;
}

const PLAN_NAMES: Record<string, string> = {
  free: "Free", go: "Go", plus: "Plus", pro: "Pro", prolite: "Pro Lite", promax: "Pro Max", max: "Max",
  team: "Team", business: "Business", enterprise: "Enterprise", edu: "Edu",
};

/** "openai" + "prolite" → "ChatGPT Pro Lite"; Claude Max is not split into 5x and 20x. */
export function planLabel(platform: string, plan: string): string {
  const product = platform === "openai" ? "ChatGPT" : platform === "claude" ? "Claude" : platform;
  if (!plan) return `${product} (plan unknown)`;
  return `${product} ${PLAN_NAMES[plan] ?? plan.charAt(0).toUpperCase() + plan.slice(1)}`;
}

/** The pinned TEE image, shortened like a digest: "snp-app:b02d…69a8". */
export function shortMeasurement(m: string): string {
  if (!m) return "—";
  return m.length > 20 ? `${m.slice(0, 12)}…${m.slice(-4)}` : m;
}

/** Share of all verified receipts, e.g. "99.85%"; null without receipts. */
export function verifiedShare(verified: number, failed: number): string | null {
  const total = verified + failed;
  if (total === 0) return null;
  const pct = (verified / total) * 100;
  return (failed > 0 && pct >= 99.995 ? "99.99" : pct.toFixed(2).replace(/\.?0+$/, "")) + "%";
}
