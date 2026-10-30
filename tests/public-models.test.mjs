import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { createMockServer } from "../mock/server.mjs";
import fixture from "../mock/models.json" with { type: "json" };
import { comparePrices, estimateModelCost, fetchModelPrices, formatContextWindow, formatInputPrice, modelPlatformLabel, modelSavings, parseModelPrices, priceDifference } from "../lib/public-models.ts";

async function start(t, scenario) {
  const server = createMockServer({ scenario });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  return `http://127.0.0.1:${server.address().port}`;
}

test("homepage client loads the Hive mock contract including nullable prices", async (t) => {
  const base = await start(t, "default");
  assert.deepEqual(await fetchModelPrices(`${base}/`), fixture.models);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchModelPrices(base, controller.signal), { name: "AbortError" });
});

test("homepage client supports empty and unavailable results and rejects a 503", async (t) => {
  const empty = await start(t, "empty");
  assert.deepEqual(await fetchModelPrices(empty), []);
  const unavailable = await start(t, "unavailable");
  const models = await fetchModelPrices(unavailable);
  assert.equal(models.length, fixture.models.length);
  assert.ok(models.every((model) => model.minimum_input_price === null && modelSavings(model) === null));
  const error = await start(t, "error");
  await assert.rejects(fetchModelPrices(error), /503/);
});

test("invalid API data cannot silently display incorrect prices", () => {
  for (const change of [
    (body) => { body.currency = "EUR"; },
    (body) => { body.unit = "per_token"; },
    (body) => { body.models = null; },
    (body) => { body.models.push(body.models[0]); },
    (body) => { body.models[0].minimum_input_price = 0.45; },
    (body) => { body.models[0].minimum_input_price = "-1"; },
    (body) => { body.models[0].official_input_price = "NaN"; },
    (body) => { body.models[0].official_prices.output = 15; },
    (body) => { body.models[0].minimum_prices.input = "100"; },
    (body) => { body.models[0].context_window = -1; },
    (body) => { body.models[0].capabilities = ["coding", "coding"]; },
    (body) => { delete body.models[0].official_prices.cache_read; },
  ]) {
    const body = structuredClone(fixture);
    change(body);
    assert.throws(() => parseModelPrices(body), /Invalid model prices response/);
  }
});

test("model metadata can be unknown and monthly estimates use both token prices exactly", () => {
  const body = structuredClone(fixture);
  body.models[0].context_window = null;
  body.models[0].capabilities = [];
  const unknown = parseModelPrices(body).models[0];
  assert.equal(unknown.context_window, null);
  assert.deepEqual(unknown.capabilities, []);
  assert.equal(formatContextWindow(null), "—");
  assert.equal(formatContextWindow(200000), "200K");
  assert.equal(formatContextWindow(1000000), "1M");
  const model = structuredClone(fixture.models[0]);
  model.official_prices = { input: "3.000000001", output: "15" };
  model.minimum_prices = { input: "0.33000000011", output: "1.65" };
  const estimate = estimateModelCost(model, 300, 60);
  assert.equal(formatInputPrice(estimate.official), "$1800.0000003");
  assert.equal(formatInputPrice(estimate.minimum), "$198.000000033");
  assert.equal(formatInputPrice(priceDifference(estimate.official, estimate.minimum)), "$1602.000000267");
  assert.equal(estimateModelCost({ ...model, minimum_prices: null }, 300, 60).minimum, null);
  assert.equal(estimateModelCost({ ...model, minimum_prices: { input: "0", output: "0" } }, 300, 60).minimum, "0");
  assert.equal(formatInputPrice(priceDifference("1", "2")), "−$1");
  assert.equal(comparePrices("0", "0.00000000001"), -1);
  assert.equal(comparePrices(null, "0"), 1);
});

test("display keeps tiny decimal prices and computes discounts without float rounding", () => {
  assert.equal(formatInputPrice("3.000000000"), "$3");
  assert.equal(formatInputPrice("0.33000000011"), "$0.33000000011");
  assert.equal(formatInputPrice("0.00000000001"), "$0.00000000001");
  assert.equal(formatInputPrice("0.000000000"), "$0");
  const model = (official, minimum) => ({ official_input_price: official, minimum_input_price: minimum });
  assert.equal(modelSavings(model("3.000000001", "0.33000000011")), 89);
  assert.equal(modelSavings(model("3", "0")), 100);
  assert.equal(modelSavings(model("0", "0")), null);
  assert.equal(modelSavings(model("3", null)), null);
  assert.equal(modelSavings(model(null, "1")), null);
  assert.equal(modelSavings(model("3", "4")), null);
  assert.equal(modelSavings(model("100", "99.500000000000000000000000001")), null);
  assert.equal(modelSavings(model("100", "99.499999999999999999999999999")), 1);
  assert.equal(modelPlatformLabel("openai"), "OpenAI");
  assert.equal(modelPlatformLabel("new-platform"), "new-platform");
  assert.equal(modelPlatformLabel("constructor"), "constructor");
});
