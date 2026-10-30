import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import fixture from "./models.json" with { type: "json" };
import earnings from "./earnings.json" with { type: "json" };
import network from "./network.json" with { type: "json" };
import networkRequests from "./network-requests.json" with { type: "json" };

const scenarios = ["default", "empty", "unavailable", "error"];
const modelsPath = "/api/public/models";
const earningsPath = "/api/public/earnings";
const networkPath = "/api/public/network";
const networkRequestsPath = "/api/public/network/requests";
const publicPaths = [modelsPath, earningsPath, networkPath, networkRequestsPath];
const errorMessages = {
  [modelsPath]: "model catalog temporarily unavailable",
  [earningsPath]: "earnings temporarily unavailable",
  [networkPath]: "network temporarily unavailable",
  [networkRequestsPath]: "network temporarily unavailable",
};

// empty: a market with no traffic; unavailable: traffic, but no account online.
function networkFor(scenario) {
  if (scenario === "empty") {
    const zero = (points) => points.map((point) => ({ ...point, openai: 0, anthropic: 0 }));
    return {
      ...network,
      supply: { providers: 0, serving: 0, idle: 0 },
      traffic: { tokens_24h: 0, tokens_previous_24h: 0, requests_24h: 0, requests_peak_hour: 0, first_output_p50_ms: null },
      provider_earnings_usd: "0.000000000",
      usage: { "24h": zero(network.usage["24h"]), "7d": zero(network.usage["7d"]), "30d": zero(network.usage["30d"]) },
      models: [],
      plans: [],
      capacity: [],
      attestations: { ...network.attestations, verified_30d: 0, failed_30d: 0, recent: [] },
    };
  }
  if (scenario === "unavailable") {
    return {
      ...network,
      supply: { providers: 0, serving: 0, idle: 0 },
      models: network.models.map((model) => ({ ...model, capacity_free_pct: null })),
      plans: [],
      capacity: [],
    };
  }
  return network;
}

function apiError(code, message, type = "invalid_request_error") {
  return { error: { code, message, type, param: null } };
}

export function createMockServer({ scenario = "default" } = {}) {
  if (!scenarios.includes(scenario)) {
    throw new Error(`MOCK_SCENARIO must be one of: ${scenarios.join(", ")}`);
  }

  return createServer((request, response) => {
    const path = new URL(request.url, "http://mock.local").pathname;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    if (path.startsWith("/api/public/")) {
      response.setHeader("Access-Control-Allow-Origin", "*");
    }

    const reply = (status, body) => {
      response.statusCode = status;
      response.end(request.method === "HEAD" ? undefined : JSON.stringify(body));
    };

    if (publicPaths.includes(path)) {
      if (request.method === "OPTIONS") {
        response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.removeHeader("Content-Type");
        response.writeHead(204).end();
        return;
      }
      if (request.method === "GET" || request.method === "HEAD") {
        if (scenario === "error") {
          reply(503, apiError("unavailable", errorMessages[path], "server_error"));
          return;
        }
        if (path === networkPath) {
          reply(200, networkFor(scenario));
          return;
        }
        if (path === networkRequestsPath) {
          reply(200, scenario === "empty" ? { requests: [] } : networkRequests);
          return;
        }
        if (path === earningsPath) {
          reply(200, scenario === "empty" ? {
            ...earnings, all_time_usd: "0.000000000", average_monthly_provider_usd: null, earning_providers: 0,
            monthly: earnings.monthly.map((point) => ({ ...point, amount_usd: "0.000000000" })), plan_capacity: [],
          } : earnings);
          return;
        }
        const models = scenario === "empty" ? [] : fixture.models.map((model) => ({
          ...model,
          minimum_input_price: scenario === "unavailable" ? null : model.minimum_input_price,
          minimum_prices: scenario === "unavailable" ? null : model.minimum_prices,
        }));
        reply(200, { currency: fixture.currency, unit: fixture.unit, models });
        return;
      }
    }

    reply(404, apiError("not_found", `this API has no endpoint ${request.method} ${path}`));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.MOCK_HOST ?? "127.0.0.1";
  const port = Number(process.env.MOCK_PORT ?? "3001");
  const scenario = process.env.MOCK_SCENARIO ?? "default";
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("MOCK_PORT must be an integer between 1 and 65535");
  }
  const server = createMockServer({ scenario });
  server.on("error", (error) => {
    console.error(`Mock API failed to start: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log(`Mock Hive API: http://${host}:${port}/api/public/ (models, earnings, network; scenario: ${scenario})`);
  });
  const stop = () => server.close(() => process.exit(0));
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
