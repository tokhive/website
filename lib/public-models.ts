export type PublicModelPrice = {
  id: string;
  name: string;
  platform: string;
  official_input_price: string | null;
  minimum_input_price: string | null;
  protocol: "responses" | "messages";
  cache_mode: "none" | "read" | "read_write";
  context_window: number | null;
  capabilities: string[];
  official_prices: ModelPrices;
  minimum_prices: ModelPrices | null;
};

export const PRICE_ITEMS = ["input", "output", "cache_read", "cache_write_5m", "cache_write_1h"] as const;
export type PriceItem = typeof PRICE_ITEMS[number];
export type ModelPrices = Partial<Record<PriceItem, string | null>>;

export type PublicModelPrices = {
  currency: "USD";
  unit: "per_1m_tokens";
  models: PublicModelPrice[];
};

const decimal = /^\d+(?:\.\d+)?$/;
const isPrice = (value: unknown): value is string | null =>
  value === null || (typeof value === "string" && decimal.test(value));

function parsePriceTable(value: unknown, items: readonly PriceItem[]): ModelPrices {
  if (!value || typeof value !== "object") throw new Error("Invalid model prices response");
  const entries = Object.entries(value);
  if (entries.length !== items.length || entries.some(([key, price]) => !items.includes(key as PriceItem) || !isPrice(price))) {
    throw new Error("Invalid model prices response");
  }
  return Object.fromEntries(entries);
}

export function parseModelPrices(data: unknown): PublicModelPrices {
  if (!data || typeof data !== "object" || !("currency" in data) || data.currency !== "USD" ||
    !("unit" in data) || data.unit !== "per_1m_tokens" || !("models" in data) || !Array.isArray(data.models)) {
    throw new Error("Invalid model prices response");
  }
  const ids = new Set<string>();
  const models = data.models.map((model: unknown): PublicModelPrice => {
    if (!model || typeof model !== "object" ||
      !("id" in model) || typeof model.id !== "string" || !model.id || ids.has(model.id) ||
      !("name" in model) || typeof model.name !== "string" || !model.name ||
      !("platform" in model) || typeof model.platform !== "string" || !model.platform ||
      !("official_input_price" in model) || !isPrice(model.official_input_price) ||
      !("minimum_input_price" in model) || !isPrice(model.minimum_input_price)) {
      throw new Error("Invalid model prices response");
    }
    if (!("protocol" in model) || (model.protocol !== "responses" && model.protocol !== "messages") ||
      !("cache_mode" in model) || !["none", "read", "read_write"].includes(String(model.cache_mode)) ||
      !("context_window" in model) || (model.context_window !== null &&
        (typeof model.context_window !== "number" || !Number.isSafeInteger(model.context_window) || model.context_window <= 0)) ||
      !("capabilities" in model) || !Array.isArray(model.capabilities) ||
      model.capabilities.some((capability: unknown) => typeof capability !== "string" || !capability) ||
      new Set(model.capabilities).size !== model.capabilities.length ||
      !("official_prices" in model) || !("minimum_prices" in model)) {
      throw new Error("Invalid model prices response");
    }
    const cacheMode = model.cache_mode as PublicModelPrice["cache_mode"];
    const items = PRICE_ITEMS.filter((item) => item === "input" || item === "output" ||
      (item === "cache_read" ? cacheMode !== "none" : cacheMode === "read_write"));
    const official = parsePriceTable(model.official_prices, items);
    const minimum = model.minimum_prices === null ? null : parsePriceTable(model.minimum_prices, items);
    if (official.input !== model.official_input_price || (minimum?.input ?? null) !== model.minimum_input_price) {
      throw new Error("Invalid model prices response");
    }
    ids.add(model.id);
    return {
      id: model.id, name: model.name, platform: model.platform,
      official_input_price: model.official_input_price,
      minimum_input_price: model.minimum_input_price,
      protocol: model.protocol, cache_mode: cacheMode, context_window: model.context_window,
      capabilities: model.capabilities, official_prices: official, minimum_prices: minimum,
    };
  });
  return { currency: "USD", unit: "per_1m_tokens", models };
}

export async function fetchModelPrices(baseUrl: string, signal?: AbortSignal): Promise<PublicModelPrice[]> {
  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/public/models`, {
    signal, credentials: "omit", cache: "no-store",
  });
  if (!response.ok) throw new Error(`Model prices request failed (${response.status})`);
  return parseModelPrices(await response.json()).models;
}

/** Format decimal API prices without rounding a small nonzero amount to zero. */
export function formatInputPrice(price: string): string {
  const negative = price.startsWith("-");
  const [whole, rawFraction = ""] = (negative ? price.slice(1) : price).split(".");
  const fraction = rawFraction.replace(/0+$/, "");
  return `${negative ? "−" : ""}$${whole}${fraction ? `.${fraction}` : ""}`;
}

/** Nearest whole percent saved; null when a meaningful discount is unavailable. */
export function modelSavings(model: Pick<PublicModelPrice, "official_input_price" | "minimum_input_price">): number | null {
  if (model.official_input_price === null || model.minimum_input_price === null) return null;
  const [officialWhole, officialFraction = ""] = model.official_input_price.split(".");
  const [minimumWhole, minimumFraction = ""] = model.minimum_input_price.split(".");
  const scale = Math.max(officialFraction.length, minimumFraction.length);
  const official = BigInt(officialWhole + officialFraction.padEnd(scale, "0"));
  const minimum = BigInt(minimumWhole + minimumFraction.padEnd(scale, "0"));
  if (official === BigInt(0) || minimum >= official) return null;
  const savings = Number(((official - minimum) * BigInt(200) + official) / (official * BigInt(2)));
  return savings > 0 ? savings : null;
}

/**
 * Whole percent saved on input price across `usage`, weighted by each model's tokens.
 * Models without both prices are left out; null without priced usage.
 */
export function weightedSavings(
  models: Pick<PublicModelPrice, "id" | "official_input_price" | "minimum_input_price">[],
  usage: { model: string; tokens: number }[],
): number | null {
  const prices = new Map(models.map((m) => [m.id, m]));
  let official = 0;
  let minimum = 0;
  for (const { model, tokens } of usage) {
    const m = prices.get(model);
    if (!m || m.official_input_price === null || m.minimum_input_price === null) continue;
    official += tokens * Number(m.official_input_price);
    minimum += tokens * Number(m.minimum_input_price);
  }
  if (official === 0) return null;
  const savings = Math.round((1 - minimum / official) * 100);
  return savings > 0 ? savings : null;
}

export function comparePrices(a: string | null, b: string | null): number {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  const [aw, af = ""] = a.split("."), [bw, bf = ""] = b.split(".");
  const scale = Math.max(af.length, bf.length);
  const left = BigInt(aw + af.padEnd(scale, "0")), right = BigInt(bw + bf.padEnd(scale, "0"));
  return left < right ? -1 : left > right ? 1 : 0;
}

function weightedCost(prices: ModelPrices | null, input: number, output: number): string | null {
  if (prices?.input == null || prices.output == null) return null;
  const [iw, inf = ""] = prices.input.split("."), [ow, outf = ""] = prices.output.split(".");
  const scale = Math.max(inf.length, outf.length);
  const total = BigInt(iw + inf.padEnd(scale, "0")) * BigInt(input) + BigInt(ow + outf.padEnd(scale, "0")) * BigInt(output);
  if (!scale) return String(total);
  const value = String(total).padStart(scale + 1, "0");
  return `${value.slice(0, -scale)}.${value.slice(-scale)}`;
}

export function estimateModelCost(model: PublicModelPrice, input: number, output: number) {
  return {
    official: weightedCost(model.official_prices, input, output),
    minimum: weightedCost(model.minimum_prices, input, output),
  };
}

export function priceDifference(a: string, b: string): string {
  const [aw, af = ""] = a.split("."), [bw, bf = ""] = b.split(".");
  const scale = Math.max(af.length, bf.length);
  const units = BigInt(aw + af.padEnd(scale, "0")) - BigInt(bw + bf.padEnd(scale, "0"));
  const negative = units < BigInt(0);
  const value = String(negative ? -units : units).padStart(scale + 1, "0");
  return `${negative ? "-" : ""}${scale ? `${value.slice(0, -scale)}.${value.slice(-scale)}` : value}`;
}

export function formatContextWindow(tokens: number | null): string {
  if (tokens === null) return "—";
  if (tokens >= 1_000_000 && tokens % 1_000_000 === 0) return `${tokens / 1_000_000}M`;
  if (tokens >= 1_000 && tokens % 1_000 === 0) return `${tokens / 1_000}K`;
  return tokens.toLocaleString("en-US");
}

export function capabilityLabel(capability: string): string {
  const labels: Record<string, string> = { coding: "Coding", reasoning: "Reasoning", vision: "Vision", long_context: "Long context" };
  return Object.hasOwn(labels, capability) ? labels[capability] : capability;
}

export function platformColor(platform: string): string {
  return platform === "anthropic" ? "#C8F031" : platform === "openai" ? "#F2F2EE" : "#8A8D92";
}

export function modelPlatformLabel(platform: string): string {
  const labels: Record<string, string> = { anthropic: "Anthropic", openai: "OpenAI", google: "Google" };
  return Object.hasOwn(labels, platform) ? labels[platform] : platform;
}
