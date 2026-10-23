/** USD per 1M tokens: ≥10 → $15, ≥0.1 → $1.20, otherwise up to 3 decimals with trailing zeros trimmed. */
export function formatPrice(x: number): string {
  if (x >= 10) return "$" + x.toFixed(0);
  if (x >= 0.1) return "$" + x.toFixed(2);
  return "$" + x.toFixed(3).replace(/0+$/, "");
}

export const formatUsd = (x: number) => "$" + Math.round(x).toLocaleString("en-US");

/** Millions of tokens → "300M" or "1.2B". */
export function formatTokensM(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 ? 1 : 0) + "B";
  return n + "M";
}

export const formatInt = (n: number) => n.toLocaleString("en-US");

/** Deterministic pseudo-random in [0, 1) so server and client render the same mock values. */
export const rnd = (n: number) => (Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1);
