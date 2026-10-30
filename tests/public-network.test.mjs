import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { createMockServer } from "../mock/server.mjs";
import fixture from "../mock/network.json" with { type: "json" };
import requestsFixture from "../mock/network-requests.json" with { type: "json" };
import {
  fetchNetworkRequests, fetchPublicNetwork, formatDuration, formatTokens, mergeRequests,
  parsePublicNetwork, planLabel, verifiedShare,
} from "../lib/public-network.ts";

async function start(t, scenario = "default") {
  const server = createMockServer({ scenario });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  return `http://127.0.0.1:${server.address().port}`;
}

test("network client reads the public contract, empty markets and errors", async (t) => {
  const base = await start(t);
  assert.deepEqual(await fetchPublicNetwork(`${base}/`), fixture);
  assert.deepEqual(await fetchNetworkRequests(base), requestsFixture.requests);
  const empty = await fetchPublicNetwork(await start(t, "empty"));
  assert.equal(empty.supply.providers, 0);
  assert.equal(empty.traffic.first_output_p50_ms, null);
  assert.equal(empty.usage["30d"].length, 30);
  assert.deepEqual(await fetchNetworkRequests(await start(t, "empty")), []);
  const unavailable = await fetchPublicNetwork(await start(t, "unavailable"));
  assert.ok(unavailable.models.every((model) => model.capacity_free_pct === null));
  assert.equal(unavailable.traffic.tokens_24h, fixture.traffic.tokens_24h);
  const failed = await start(t, "error");
  await assert.rejects(fetchPublicNetwork(failed), /503/);
  await assert.rejects(fetchNetworkRequests(failed), /503/);
});

test("network responses with unknown vendors or short series are refused", () => {
  assert.throws(() => parsePublicNetwork({ ...fixture, models: [{ ...fixture.models[0], vendor: "google" }] }), /Invalid/);
  assert.throws(() => parsePublicNetwork({ ...fixture, usage: { ...fixture.usage, "7d": fixture.usage["7d"].slice(1) } }), /Invalid/);
  assert.throws(() => parsePublicNetwork({ ...fixture, provider_earnings_usd: "-1" }), /Invalid/);
});

test("the feed keeps the newest unique requests", () => {
  const [a, b, c] = requestsFixture.requests;
  assert.deepEqual(mergeRequests([b, c], [a, b], 2).map((r) => r.id), [a.id, b.id]);
});

test("network figures are formatted for the page", () => {
  assert.equal(formatTokens(9_810_000_000), "9.81B");
  assert.equal(formatTokens(100_000_000), "100M");
  assert.equal(formatTokens(201_400_000), "201M");
  assert.equal(formatTokens(10_000), "10K");
  assert.equal(formatTokens(950), "950");
  assert.equal(formatDuration(850), "850ms");
  assert.equal(formatDuration(6372), "6.4s");
  assert.equal(formatDuration(72_400), "1m 12s");
  assert.equal(planLabel("openai", "prolite"), "ChatGPT Pro Lite");
  assert.equal(planLabel("claude", "max"), "Claude Max");
  assert.equal(planLabel("openai", ""), "ChatGPT (plan unknown)");
  assert.equal(verifiedShare(35894, 54), "99.85%");
  assert.equal(verifiedShare(10, 0), "100%");
  assert.equal(verifiedShare(999999, 1), "99.99%");
  assert.equal(verifiedShare(0, 0), null);
});

test("average saving is weighted by usage and skips unpriced models", async () => {
  const { weightedSavings } = await import("../lib/public-models.ts");
  const models = [
    { id: "big", official_input_price: "10", minimum_input_price: "1" },
    { id: "small", official_input_price: "2", minimum_input_price: "1.5" },
    { id: "unpriced", official_input_price: "5", minimum_input_price: null },
  ];
  assert.equal(weightedSavings(models, [{ model: "big", tokens: 1 }, { model: "small", tokens: 10 }, { model: "unpriced", tokens: 100 }]), 47);
  assert.equal(weightedSavings(models, [{ model: "unpriced", tokens: 100 }]), null);
  assert.equal(weightedSavings(models, []), null);
});
