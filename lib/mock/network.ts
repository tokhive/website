// Sample live-network data. Each generator takes a `tick` so the mock "moves" while staying
// deterministic between server and client. Replace with the /v1/network/* endpoints and the SSE stream.
import { formatInt, rnd } from "@/lib/format";

export type NetVendor = "Anthropic" | "OpenAI" | "Google";
export type UsageRange = "24h" | "7d" | "30d";

export type Kpi = { label: string; value: string; delta: string; positive: boolean };
export type FeedRow = { id: string; model: string; region: string; tokens: string; ms: number };
export type UsageBar = { label: string; Anthropic: number; OpenAI: number; Google: number };
export type ModelShare = { model: string; vendor: NetVendor; sharePct: number; capacityPct: number };
export type PlanCount = { plan: string; providers: number };
export type Attestation = {
  requestId: string;
  model: string;
  enclave: string;
  upstream: string;
  measurement: string;
  signed: string;
};

export const NET_VENDOR_COLORS: Record<NetVendor, string> = {
  Anthropic: "#C8F031",
  OpenAI: "#F2F2EE",
  Google: "#5E6163",
};

export const MODEL_SHARE: ModelShare[] = [
  { model: "claude-sonnet-4.5", vendor: "Anthropic", sharePct: 31.4, capacityPct: 38 },
  { model: "gpt-5-codex", vendor: "OpenAI", sharePct: 18.2, capacityPct: 52 },
  { model: "claude-opus-4.1", vendor: "Anthropic", sharePct: 12.6, capacityPct: 17 },
  { model: "gpt-5", vendor: "OpenAI", sharePct: 11.9, capacityPct: 61 },
  { model: "gemini-2.5-pro", vendor: "Google", sharePct: 9.8, capacityPct: 70 },
  { model: "claude-haiku-4.5", vendor: "Anthropic", sharePct: 7.1, capacityPct: 74 },
  { model: "gemini-2.5-flash", vendor: "Google", sharePct: 5.3, capacityPct: 83 },
  { model: "gpt-5-mini", vendor: "OpenAI", sharePct: 3.7, capacityPct: 88 },
];

export const PLANS: PlanCount[] = [
  { plan: "Claude Max 20x", providers: 1128 },
  { plan: "ChatGPT Pro", providers: 864 },
  { plan: "Claude Max 5x", providers: 702 },
  { plan: "Gemini AI Ultra", providers: 341 },
  { plan: "ChatGPT Plus", providers: 236 },
  { plan: "Claude Pro", providers: 141 },
];

export const PROVIDERS_PER_CELL = 40;

export const HIVE_LEGEND = { serving: 1906, idle: 1506 };

const REGIONS = ["us-east", "us-west", "eu-west", "ap-sg", "ap-tokyo", "eu-central"];

const UPSTREAM: Record<NetVendor, string> = {
  Anthropic: "api.anthropic.com",
  OpenAI: "api.openai.com",
  Google: "generativelanguage.googleapis.com",
};

export const requestsPerSec = (tick: number) => 1284 + Math.round((rnd(tick + 3) - 0.5) * 160);

export function getKpis(tick: number): Kpi[] {
  return [
    { label: "PROVIDERS ONLINE", value: formatInt(3412 + Math.round((rnd(tick) - 0.5) * 8)), delta: "+124 vs yesterday", positive: true },
    { label: "TOKENS · 24H", value: "9.81B", delta: "+6.2% d/d", positive: true },
    { label: "REQUESTS / SEC", value: formatInt(requestsPerSec(tick)), delta: "peak 2,906 today", positive: false },
    { label: "PAID TO PROVIDERS", value: "$2.42M", delta: "all time", positive: false },
    { label: "ROUTING OVERHEAD", value: "+38ms", delta: "p50, enclave included", positive: false },
  ];
}

/** Newest first. A new row arrives on every tick. */
export function getFeed(tick: number, length = 9): FeedRow[] {
  return Array.from({ length }, (_, i) => {
    const seq = tick - i;
    const n = seq * 3 + 63;
    const m = MODEL_SHARE[Math.floor(rnd(n) * MODEL_SHARE.length)];
    return {
      id: String(seq),
      model: m.model,
      region: REGIONS[Math.floor(rnd(n + 1) * REGIONS.length)],
      tokens: formatInt(Math.round(400 + rnd(n + 2) * 18000)),
      ms: Math.round(380 + rnd(n + 4) * 2200),
    };
  });
}

const RANGE_BARS: Record<UsageRange, number> = { "24h": 24, "7d": 7, "30d": 30 };
const RANGE_TOTAL_B: Record<UsageRange, number> = { "24h": 9.8, "7d": 64.3, "30d": 251.7 };

export const RANGE_META: Record<UsageRange, { label: string; axisL: string; axisR: string }> = {
  "24h": { label: "last 24 hours", axisL: "00:00", axisR: "23:00" },
  "7d": { label: "last 7 days", axisL: "Oct 17", axisR: "Oct 23" },
  "30d": { label: "last 30 days", axisL: "Sep 24", axisR: "Oct 23" },
};

/** Usage per bar in relative units, plus the all-vendor total in billions of tokens. */
export function getUsage(range: UsageRange): { bars: UsageBar[]; totalB: number } {
  const n = RANGE_BARS[range];
  const bars = Array.from({ length: n }, (_, i) => {
    const k = i + n * 13;
    const base =
      range === "24h" ? 0.55 + 0.45 * Math.sin(((i - 6) / 24) * Math.PI * 2) * 0.5 + 0.25 : 0.6 + (i / n) * 0.35;
    return {
      label: range === "24h" ? `${String(i).padStart(2, "0")}:00` : `day ${i + 1}`,
      Anthropic: base * (0.45 + rnd(k) * 0.08),
      OpenAI: base * (0.32 + rnd(k + 1) * 0.08),
      Google: base * (0.16 + rnd(k + 2) * 0.06),
    };
  });
  return { bars, totalB: RANGE_TOTAL_B[range] };
}

export function getAttestations(tick: number, length = 6): Attestation[] {
  return Array.from({ length }, (_, i) => {
    const n = tick + 40 - i;
    const m = MODEL_SHARE[Math.floor(rnd(n * 5) * MODEL_SHARE.length)];
    const hx = Math.floor(rnd(n * 7) * 0xffff).toString(16).padStart(4, "0");
    const hy = Math.floor(rnd(n * 11) * 0xffff).toString(16).padStart(4, "0");
    const up = UPSTREAM[m.vendor];
    return {
      requestId: "req_01J9" + hx.toUpperCase() + "…",
      model: m.model,
      enclave: "AMD SEV-SNP",
      upstream: up.length > 20 ? "generativelanguage…" : up,
      measurement: "snp-app:" + hx + "…" + hy,
      signed: `${i * 2 + 1}s ago`,
    };
  });
}
