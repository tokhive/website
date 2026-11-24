// Numbers behind the live hive: how many tokens one lit tile stands for, and how fast tiles light.

/** Seconds over which a finished request's tiles are played back, so bursts read as a swell, not a flash. */
export const DRAIN_SECONDS = 40;

/** Tiles lit per second that the hive aims for at the network's average pace. */
const TARGET_TILES_PER_SECOND = 140;

/**
 * Tokens one tile stands for, as a round figure (1, 2, 5, 10, 20, 50, …), so the average pace
 * lights about `tilesPerSecond` tiles. Never below one token per tile.
 */
export function tokensPerTile(tokensPerSecond: number, tilesPerSecond = TARGET_TILES_PER_SECOND): number {
  const raw = tokensPerSecond / tilesPerSecond;
  if (!(raw > 1)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const lead = raw / magnitude;
  return (lead < 1.5 ? 1 : lead < 3.5 ? 2 : lead < 7.5 ? 5 : 10) * magnitude;
}

/**
 * Tiles to queue per vendor so the hive opens at the network's average pace instead of dark:
 * the day's tokens split by each vendor's share of model usage.
 */
export function openingTiles<V extends string>(
  tokens24h: number,
  models: readonly { vendor: V; tokens: number }[],
  perTile: number,
): Partial<Record<V, number>> {
  const total = models.reduce((sum, m) => sum + m.tokens, 0);
  if (!(total > 0) || !(tokens24h > 0)) return {};
  const tilesPerSecond = tokens24h / 86_400 / perTile;
  const out: Partial<Record<V, number>> = {};
  for (const m of models) out[m.vendor] = (out[m.vendor] ?? 0) + (m.tokens / total) * tilesPerSecond * DRAIN_SECONDS;
  return out;
}
