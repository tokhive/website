import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { createMockServer } from "../mock/server.mjs";
import fixture from "../mock/earnings.json" with { type: "json" };
import {
  earningsBarHeights, earningsMonthLabel, fetchPublicEarnings, formatCompactEarnings,
  formatEarningsUsd, parsePublicEarnings,
} from "../lib/public-earnings.ts";

async function start(t, scenario = "default") {
  const server = createMockServer({ scenario });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  return `http://127.0.0.1:${server.address().port}`;
}

test("homepage earnings client reads the public contract, errors and cancellation", async (t) => {
  const base = await start(t);
  assert.deepEqual(await fetchPublicEarnings(`${base}/`), fixture);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchPublicEarnings(base, controller.signal), { name: "AbortError" });
  const failed = await start(t, "error");
  await assert.rejects(fetchPublicEarnings(failed), /503/);
});

test("empty earnings are real zeros, while unavailable supply leaves earned income intact", async (t) => {
  const empty = await fetchPublicEarnings(await start(t, "empty"));
  assert.equal(empty.all_time_usd, "0.000000000");
  assert.equal(empty.average_monthly_provider_usd, null);
  assert.equal(empty.earning_providers, 0);
  assert.deepEqual(earningsBarHeights(empty.monthly), Array(12).fill(0));
  const unavailable = await fetchPublicEarnings(await start(t, "unavailable"));
  assert.deepEqual(unavailable, fixture);
});

test("withdrawal data, invalid amounts and incorrect monthly periods cannot be shown as settled income", () => {
  for (const change of [
    (data) => { data.basis = "withdrawals"; },
    (data) => { data.currency = "USDT"; },
    (data) => { data.timezone = "Asia/Shanghai"; },
    (data) => { data.as_of = "invalid"; },
    (data) => { data.all_time_usd = 2418906; },
    (data) => { data.all_time_usd = "-1"; },
    (data) => { data.all_time_usd = "1"; },
    (data) => { data.average_month = "2026-10"; },
    (data) => { data.average_monthly_provider_usd = null; },
    (data) => { data.earning_providers = -1; },
    (data) => { data.monthly.pop(); },
    (data) => { data.monthly.reverse(); },
    (data) => { data.monthly[0].amount_usd = "NaN"; },
  ]) {
    const data = structuredClone(fixture);
    change(data);
    assert.throws(() => parsePublicEarnings(data), /Invalid earnings response/);
  }
});

test("dollar presentation and bar scaling handle tiny, large and non-monotonic earnings", () => {
  assert.equal(formatCompactEarnings(fixture.all_time_usd), "$2.4M");
  assert.equal(formatEarningsUsd(fixture.all_time_usd), "$2,418,906");
  assert.equal(formatEarningsUsd("12.345000000"), "$12.35");
  assert.equal(formatEarningsUsd("0.000000001"), "<$0.01");
  assert.equal(formatEarningsUsd("0"), "$0");
  assert.equal(formatEarningsUsd("999999999999999999.990000000"), "$999,999,999,999,999,999.99");
  assert.equal(formatCompactEarnings("999999"), "$1M");
  assert.equal(earningsMonthLabel("2025-12"), "Dec ’25");
  assert.equal(earningsMonthLabel("2025-12", true), "December 2025");
  assert.deepEqual(earningsBarHeights([
    { month: "2026-01", amount_usd: "10" },
    { month: "2026-02", amount_usd: "0" },
    { month: "2026-03", amount_usd: "5" },
  ]), [94, 0, 47]);
});

test("plan capacity is optional and validated", async () => {
  const { parsePublicEarnings } = await import("../lib/public-earnings.ts");
  const { default: fixture } = await import("../mock/earnings.json", { with: { type: "json" } });
  assert.equal(parsePublicEarnings(fixture).plan_capacity.length, 3);
  const { plan_capacity: _, ...older } = fixture;
  assert.deepEqual(parsePublicEarnings(older).plan_capacity, []);
  assert.throws(() => parsePublicEarnings({ ...fixture, plan_capacity: [{ platform: "openai", plan: "pro", accounts: 0, max_weekly_provider_usd: "1" }] }));
  assert.throws(() => parsePublicEarnings({ ...fixture, plan_capacity: [{ platform: "openai", plan: "pro", accounts: 2, max_weekly_provider_usd: "-1" }] }));
});
