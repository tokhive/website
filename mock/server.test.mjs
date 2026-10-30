import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { createMockServer } from "./server.mjs";

async function start(t, scenario = "default") {
  const server = createMockServer({ scenario });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  return `http://127.0.0.1:${server.address().port}`;
}

test("anonymous model prices match Hive's public response contract", async (t) => {
  const base = await start(t);
  const response = await fetch(`${base}/api/public/models`, { headers: { Origin: "http://localhost:3000" } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(response.headers.get("access-control-allow-credentials"), null);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
  const body = await response.json();
  assert.deepEqual(Object.keys(body).sort(), ["currency", "models", "unit"]);
  assert.equal(body.currency, "USD");
  assert.equal(body.unit, "per_1m_tokens");
  assert.ok(body.models.length > 0);
  for (const model of body.models) {
    assert.deepEqual(Object.keys(model).sort(), ["cache_mode", "capabilities", "context_window", "id", "minimum_input_price", "minimum_prices", "name", "official_input_price", "official_prices", "platform", "protocol"]);
    assert.equal(typeof model.id, "string");
    assert.equal(typeof model.name, "string");
    assert.ok(["anthropic", "openai"].includes(model.platform));
    assert.match(model.official_input_price, /^\d+(\.\d+)?$/);
    assert.equal(model.official_prices.input, model.official_input_price);
    assert.match(model.official_prices.output, /^\d+(\.\d+)?$/);
    assert.ok(model.context_window === null || Number.isSafeInteger(model.context_window));
    assert.ok(Array.isArray(model.capabilities));
    if (model.minimum_input_price !== null) {
      assert.equal(typeof model.minimum_input_price, "string");
      assert.match(model.minimum_input_price, /^\d+(\.\d+)?$/);
      assert.equal(model.minimum_prices.input, model.minimum_input_price);
      assert.match(model.minimum_prices.output, /^\d+(\.\d+)?$/);
    } else {
      assert.equal(model.minimum_prices, null);
    }
  }
  const keys = body.models.map((model) => `${model.platform}/${model.id}`);
  assert.deepEqual(keys, [...keys].sort());
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(body.models.some((model) => model.minimum_input_price === null));
});

test("HEAD, preflight and unknown public paths behave like Hive", async (t) => {
  const base = await start(t);
  const head = await fetch(`${base}/api/public/models`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const preflight = await fetch(`${base}/api/public/models`, {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:3000", "Access-Control-Request-Method": "GET" },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), "*");
  assert.equal(preflight.headers.get("access-control-allow-methods"), "GET, HEAD, OPTIONS");
  assert.equal(preflight.headers.get("access-control-allow-headers"), "Content-Type");
  assert.equal(await preflight.text(), "");
  const missing = await fetch(`${base}/api/public/missing`);
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get("access-control-allow-origin"), "*");
  assert.deepEqual(await missing.json(), {
    error: { code: "not_found", message: "this API has no endpoint GET /api/public/missing", type: "invalid_request_error", param: null },
  });
});

test("public earnings supports anonymous reads, HEAD and preflight", async (t) => {
  const base = await start(t);
  const endpoint = `${base}/api/public/earnings`;
  const response = await fetch(endpoint, { headers: { Origin: "https://tokhive.ai" } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(response.headers.get("access-control-allow-credentials"), null);
  const body = await response.json();
  assert.deepEqual(Object.keys(body).sort(), ["all_time_usd", "as_of", "average_month", "average_monthly_provider_usd", "basis", "currency", "earning_providers", "monthly", "plan_capacity", "timezone"]);
  assert.equal(body.basis, "settled_provider_earnings");
  assert.equal(body.currency, "USD");
  assert.equal(body.timezone, "UTC");
  assert.equal(typeof body.all_time_usd, "string");
  assert.equal(body.monthly.length, 12);
  const head = await fetch(endpoint, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const options = await fetch(endpoint, { method: "OPTIONS" });
  assert.equal(options.status, 204);
  assert.equal(options.headers.get("access-control-allow-methods"), "GET, HEAD, OPTIONS");
});

test("empty, unavailable and error scenarios retain Hive's contract", async (t) => {
  for (const scenario of ["empty", "unavailable", "error"]) {
    await t.test(scenario, async (t) => {
      const base = await start(t, scenario);
      const response = await fetch(`${base}/api/public/models`);
      const body = await response.json();
      if (scenario === "error") {
        assert.equal(response.status, 503);
        assert.deepEqual(body, {
          error: { code: "unavailable", message: "model catalog temporarily unavailable", type: "server_error", param: null },
        });
      } else {
        assert.equal(response.status, 200);
        assert.equal(body.currency, "USD");
        assert.equal(body.unit, "per_1m_tokens");
        if (scenario === "empty") {
          assert.deepEqual(body.models, []);
        } else {
          assert.ok(body.models.length > 0);
          assert.ok(body.models.every((model) => model.minimum_input_price === null && model.minimum_prices === null));
        }
      }
    });
  }
});
