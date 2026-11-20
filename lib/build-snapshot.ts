import { fetchModelPrices, type PublicModelPrice } from "@/lib/public-models";
import { HIVE_API_BASE_URL } from "@/lib/public-api";

let snapshot: Promise<PublicModelPrice[] | null> | undefined;

/**
 * Model prices read while the static site is built, so the first HTML a
 * visitor or a search engine receives already lists them. The page asks Hive
 * again as soon as it loads, which replaces these with current prices.
 * A failed read leaves the page as it was without one: prices load in the
 * browser.
 */
export function buildTimeModels(): Promise<PublicModelPrice[] | null> {
  snapshot ??= fetchModelPrices(HIVE_API_BASE_URL, AbortSignal.timeout(10_000)).catch((error: unknown) => {
    console.warn(`Model prices were not prerendered: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  });
  return snapshot;
}
