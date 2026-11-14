/**
 * A plan Bee can share. `platform` and `plan` match what Hive reports; `sample` is the
 * illustrative monthly earning with all quota sold, used until Hive has measured the plan.
 */
export type ProviderPlan = { name: string; platform: string; plan: string; price: number; sample: number };
export const PROVIDER_PLANS: ProviderPlan[] = [
  { name: "Claude Max", platform: "claude", plan: "max", price: 100, sample: 212 },
  // Ultra (formerly Max 20x) has four times Max's usage, so its sample scales with usage, not price.
  { name: "Claude Ultra", platform: "claude", plan: "ultra", price: 200, sample: 848 },
  { name: "Claude Pro", platform: "claude", plan: "pro", price: 20, sample: 42 },
  { name: "ChatGPT Pro", platform: "openai", plan: "pro", price: 200, sample: 391 },
  { name: "ChatGPT Pro Lite", platform: "openai", plan: "prolite", price: 100, sample: 195 },
  { name: "ChatGPT Plus", platform: "openai", plan: "plus", price: 20, sample: 38 },
];

// Copy for these lists lives in messages/*.json under Providers; the keys fix their order.
export const PROVIDER_STEPS = ["signIn", "share", "earn"] as const;
export const PROVIDER_CONTROLS = ["stop", "start", "track", "keep"] as const;
export const PROVIDER_SAFETY = ["encrypted", "aup", "limits", "audit"] as const;
export const PROVIDER_RISKS = ["vendor", "rejection"] as const;
export const PROVIDER_FAQ = ["idle", "slower", "stop", "withdraw", "calculated", "credits", "apiKey", "registered", "computer"] as const;
export const SETTLEMENT_STATS = ["realTime", "minimum", "web3"] as const;

// Illustrative, at roughly TokHive's floor prices (mostly input, ~10% output).
// A null model is the cache-read line, whose label is translated.
export const SETTLEMENT_EXAMPLE: { model: string | null; tokens: string; amount: string }[] = [
  { model: "claude-opus-5-5", tokens: "18.4M", amount: "$11.33" },
  { model: "gpt-6-sol", tokens: "22.0M", amount: "$6.78" },
  { model: "claude-sonnet-5-5", tokens: "9.2M", amount: "$2.83" },
  { model: null, tokens: "41.0M", amount: "$0.74" },
];
/** Sum of the example amounts. */
export const SETTLEMENT_TOTAL = "+$21.68";
