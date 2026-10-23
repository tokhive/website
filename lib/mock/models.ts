// Sample model catalogue. Replace with `GET /v1/models` once the backend exists.

export type Vendor =
  | "Anthropic"
  | "OpenAI"
  | "Google"
  | "xAI"
  | "DeepSeek"
  | "Moonshot"
  | "Zhipu"
  | "Alibaba";

export type Capability = "Coding" | "Reasoning" | "Vision" | "Long context";

/** USD per 1M tokens. */
export type PriceSet = { in: number; out: number; cacheRead: number };

export type Model = {
  id: string;
  name: string;
  vendor: Vendor;
  context: string;
  official: PriceSet;
  tokhive: PriceSet;
  tags: Capability[];
  capacityPct: number;
  popularity: number;
  providers: number;
  p50Ms: number;
  tokPerSec: number;
  upstreamHost: string;
};

export const CAPABILITIES: Capability[] = ["Coding", "Reasoning", "Vision", "Long context"];

export const VENDOR_COLORS: Record<Vendor, string> = {
  Anthropic: "#C8F031",
  OpenAI: "#F2F2EE",
  Google: "#8A8D92",
  xAI: "#5E6163",
  DeepSeek: "#9CCB00",
  Moonshot: "#D6D8D2",
  Zhipu: "#6E8A1F",
  Alibaba: "#B4B6B0",
};

const UPSTREAM: Record<Vendor, string> = {
  Anthropic: "api.anthropic.com",
  OpenAI: "api.openai.com",
  Google: "googleapis.com",
  xAI: "api.x.ai",
  DeepSeek: "api.deepseek.com",
  Moonshot: "api.moonshot.ai",
  Zhipu: "open.bigmodel.cn",
  Alibaba: "dashscope.aliyuncs.com",
};

type Row = [
  id: string, name: string, vendor: Vendor, context: string,
  oi: number, oo: number, oc: number, ti: number, to: number, tc: number,
  tags: Capability[], capacityPct: number, popularity: number, providers: number,
];

const ROWS: Row[] = [
  ["claude-opus-4-1", "Claude Opus 4.1", "Anthropic", "200K", 15, 75, 1.5, 6, 30, 0.6, ["Reasoning", "Coding", "Vision"], 17, 96, 99],
  ["claude-sonnet-4-5", "Claude Sonnet 4.5", "Anthropic", "1M", 3, 15, 0.3, 1.2, 6, 0.12, ["Coding", "Reasoning", "Vision", "Long context"], 38, 100, 742],
  ["claude-haiku-4-5", "Claude Haiku 4.5", "Anthropic", "200K", 1, 5, 0.1, 0.45, 2.25, 0.045, ["Coding", "Vision"], 74, 92, 318],
  ["claude-sonnet-4", "Claude Sonnet 4", "Anthropic", "1M", 3, 15, 0.3, 1.1, 5.5, 0.11, ["Coding", "Long context"], 81, 61, 204],
  ["gpt-5", "GPT-5", "OpenAI", "400K", 1.25, 10, 0.125, 0.5, 4, 0.05, ["Reasoning", "Coding", "Vision"], 61, 88, 466],
  ["gpt-5-codex", "GPT-5 Codex", "OpenAI", "400K", 1.25, 10, 0.125, 0.5, 4, 0.05, ["Coding"], 52, 97, 511],
  ["gpt-5-mini", "GPT-5 mini", "OpenAI", "400K", 0.25, 2, 0.025, 0.11, 0.9, 0.011, ["Coding", "Vision"], 88, 70, 289],
  ["gpt-5-nano", "GPT-5 nano", "OpenAI", "400K", 0.05, 0.4, 0.005, 0.025, 0.2, 0.0025, [], 93, 34, 177],
  ["o3", "o3", "OpenAI", "200K", 2, 8, 0.5, 0.9, 3.6, 0.22, ["Reasoning", "Vision"], 66, 41, 152],
  ["gemini-2.5-pro", "Gemini 2.5 Pro", "Google", "1M", 1.25, 10, 0.31, 0.55, 4.4, 0.14, ["Reasoning", "Coding", "Vision", "Long context"], 70, 79, 233],
  ["gemini-2.5-flash", "Gemini 2.5 Flash", "Google", "1M", 0.3, 2.5, 0.075, 0.13, 1.1, 0.033, ["Vision", "Long context"], 83, 66, 261],
  ["gemini-2.5-flash-lite", "Gemini 2.5 Flash-Lite", "Google", "1M", 0.1, 0.4, 0.025, 0.045, 0.18, 0.011, ["Long context"], 91, 29, 140],
  ["grok-4", "Grok 4", "xAI", "256K", 3, 15, 0.75, 1.3, 6.5, 0.3, ["Reasoning", "Vision"], 58, 52, 96],
  ["grok-code-fast-1", "Grok Code Fast 1", "xAI", "256K", 0.2, 1.5, 0.02, 0.09, 0.65, 0.009, ["Coding"], 79, 64, 121],
  ["deepseek-v3.2", "DeepSeek V3.2", "DeepSeek", "128K", 0.28, 0.42, 0.028, 0.14, 0.21, 0.014, ["Coding", "Reasoning"], 85, 58, 88],
  ["kimi-k2", "Kimi K2", "Moonshot", "256K", 0.6, 2.5, 0.15, 0.28, 1.15, 0.07, ["Coding", "Long context"], 72, 47, 64],
  ["glm-4.6", "GLM-4.6", "Zhipu", "200K", 0.6, 2.2, 0.11, 0.27, 1, 0.05, ["Coding"], 76, 44, 59],
  ["qwen3-coder-plus", "Qwen3 Coder Plus", "Alibaba", "1M", 1, 5, 0.1, 0.42, 2.1, 0.04, ["Coding", "Long context"], 81, 39, 47],
];

export const MODELS: Model[] = ROWS.map(
  ([id, name, vendor, context, oi, oo, oc, ti, to, tc, tags, capacityPct, popularity, providers]) => ({
    id,
    name,
    vendor,
    context,
    official: { in: oi, out: oo, cacheRead: oc },
    tokhive: { in: ti, out: to, cacheRead: tc },
    tags,
    capacityPct,
    popularity,
    providers,
    p50Ms: Math.round(380 + ((oi * 37) % 900)),
    tokPerSec: 40 + ((popularity * 7) % 110),
    upstreamHost: UPSTREAM[vendor],
  }),
);

export const VENDORS: Vendor[] = [...new Set(MODELS.map((m) => m.vendor))];

export const savingsPct = (m: Model) => Math.round((1 - m.tokhive.in / m.official.in) * 100);

export const getModel = (id: string) => MODELS.find((m) => m.id === id);

/** Models shown on the home page price tape and honeycomb. */
export const FEATURED_MODEL_IDS = [
  "claude-opus-4-1",
  "claude-sonnet-4-5",
  "claude-haiku-4-5",
  "gpt-5",
  "gpt-5-codex",
  "gpt-5-mini",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
];

export const FEATURED_MODELS = FEATURED_MODEL_IDS.map((id) => getModel(id)!);
