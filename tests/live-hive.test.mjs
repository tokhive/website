import assert from "node:assert/strict";
import { test } from "node:test";
import { DRAIN_SECONDS, openingTiles, tokensPerTile } from "../lib/live-hive.ts";

test("a tile stands for a round number of tokens near the target pace", () => {
  assert.equal(tokensPerTile(0), 1);
  assert.equal(tokensPerTile(40), 1);
  assert.equal(tokensPerTile(1495), 10);
  assert.equal(tokensPerTile(3000), 20);
  assert.equal(tokensPerTile(9000), 50);
  assert.equal(tokensPerTile(150_000), 1000);
});

test("the hive opens at the day's average pace, split by vendor share", () => {
  const models = [
    { vendor: "openai", tokens: 600 },
    { vendor: "openai", tokens: 150 },
    { vendor: "anthropic", tokens: 250 },
  ];
  const tiles = openingTiles(86_400 * 1000, models, 10);
  // 1000 tokens a second at 10 tokens a tile is 100 tiles a second.
  assert.ok(Math.abs(tiles.openai - 75 * DRAIN_SECONDS) < 1e-6);
  assert.ok(Math.abs(tiles.anthropic - 25 * DRAIN_SECONDS) < 1e-6);
});

test("with no traffic the hive opens dark", () => {
  assert.deepEqual(openingTiles(0, [{ vendor: "openai", tokens: 5 }], 1), {});
  assert.deepEqual(openingTiles(1000, [], 1), {});
});
