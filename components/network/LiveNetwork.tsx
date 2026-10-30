"use client";

import { useEffect, useState } from "react";
import { HexField } from "@/components/HexField";
import { useTick } from "@/lib/useTick";
import { formatInt } from "@/lib/format";
import { LINKS } from "@/lib/links";
import { formatCompactEarnings } from "@/lib/public-earnings";
import {
  formatAgo, formatDuration, formatTokens, shortMeasurement, VENDOR_NAMES, verifiedShare, type PublicNetwork,
} from "@/lib/public-network";
import { NetworkProvider, useNetwork } from "@/components/network/NetworkProvider";
import { TokenUsage } from "@/components/network/TokenUsage";
import { ModelShareCard, PlansCard } from "@/components/network/Breakdowns";

type Kpi = { label: string; value: string; delta: string; positive: boolean };

/** Below this many providers online the hive shows sample counts instead of Hive's. */
const MIN_LIVE_PROVIDERS = 30;
const SAMPLE_HIVE = { serving: 1906, idle: 1506 };

function kpis(data: PublicNetwork | null): Kpi[] {
  if (!data) {
    return ["PROVIDERS ONLINE", "TOKENS · 24H", "REQUESTS · 24H", "PROVIDER EARNINGS", "FIRST OUTPUT · P50"].map((label) => ({
      label, value: "—", delta: "\u00a0", positive: false,
    }));
  }
  const { supply, traffic } = data;
  const previous = traffic.tokens_previous_24h;
  const change = previous > 0 ? ((traffic.tokens_24h - previous) / previous) * 100 : null;
  const p50 = traffic.first_output_p50_ms;
  return [
    { label: "PROVIDERS ONLINE", value: formatInt(supply.providers), delta: `${formatInt(supply.serving + supply.idle)} accounts · ${formatInt(supply.serving)} serving`, positive: false },
    {
      label: "TOKENS · 24H", value: formatTokens(traffic.tokens_24h),
      delta: change === null ? "no traffic the day before" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}% d/d`, positive: (change ?? 0) > 0,
    },
    { label: "REQUESTS · 24H", value: formatInt(traffic.requests_24h), delta: `peak ${formatInt(traffic.requests_peak_hour)} in one hour`, positive: false },
    { label: "PROVIDER EARNINGS", value: formatCompactEarnings(data.provider_earnings_usd), delta: "settled · all time", positive: false },
    { label: "FIRST OUTPUT · P50", value: p50 === null ? "—" : formatDuration(p50), delta: "24h, reasoning included", positive: false },
  ];
}

export function LiveNetwork() {
  return (
    <NetworkProvider>
      <LiveNetworkView />
    </NetworkProvider>
  );
}

function LiveNetworkView() {
  const { status, data, requests, updatedAt } = useNetwork();
  // Re-renders the relative times every second.
  const tick = useTick(1000);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time only exists on the client
    setNow(Date.now());
  }, [tick, updatedAt]);
  const updated = updatedAt ? new Date(updatedAt).toISOString().slice(11, 19) : "--:--:--";
  const cards = kpis(data);
  const attestations = data?.attestations.recent ?? [];
  const verified = data ? verifiedShare(data.attestations.verified_30d, data.attestations.failed_30d) : null;
  const measurement = data?.attestations.measurement ?? "";
  const serving = data?.supply.serving ?? 0;
  const idle = data?.supply.idle ?? 0;
  // The legend is always real; the hive itself is drawn from sample counts until the network is big enough.
  const hive = data && data.supply.providers >= MIN_LIVE_PROVIDERS ? data.supply : SAMPLE_HIVE;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-8 pt-[72px] pb-10 max-sm:pt-12">
        <div className="flex flex-col gap-4">
          <span className="eyebrow flex items-center gap-2.5">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-volt motion-reduce:animate-none" />
            LIVE NETWORK
          </span>
          <h1 className="h1">The hive, live.</h1>
        </div>
        <span className="font-mono text-[13px] text-muted">
          {status === "error" ? "network data unavailable" : `updated ${updated} · all times UTC`}
        </span>
      </header>

      <div className="network-kpis grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-y border-line">
        {cards.map((k) => (
          <div key={k.label} className="flex flex-col gap-1.5 py-7 pr-6">
            <span className="font-mono text-xs tracking-[0.06em] text-muted">{k.label}</span>
            <span className="font-mono text-[34px] font-medium tracking-[-0.03em]">{k.value}</span>
            <span className={`font-mono text-xs ${k.positive ? "text-volt" : "text-muted"}`}>{k.delta}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-6 py-12">
        <div className="flex flex-col overflow-hidden rounded-card bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
            <span className="text-[17px] font-semibold">Accounts online</span>
            <div className="flex gap-[18px] font-mono text-xs text-text-2">
              <Legend swatch="clip-hex bg-volt" label={`serving · ${formatInt(serving)}`} />
              <Legend swatch="clip-hex bg-[#3A3D3F]" label={`idle · ${formatInt(idle)}`} />
              <Legend swatch="border border-[#3A3D3F]" label="offline" />
            </div>
          </div>
          <div className="network-hive relative h-[400px]">
            <HexField
              cols={30}
              rows={13}
              s={18}
              mode="sparkle"
              interval={160}
              burst={hive.serving === 0 ? 0 : Math.min(7, hive.serving)}
              lit="#C8F031"
              line="#2A2D2F"
              idleFill="#2A2D2F"
              onlineRatio={hive.serving + hive.idle === 0 ? 0 : 0.82}
              fadeMs={1600}
              holdMin={500}
              holdMax={1400}
            />
          </div>
          <div className="border-t border-paper/6 px-6 py-3.5 font-mono text-xs text-muted">
            Illustrative. Serving accounts are running a request now; idle ones are ready for new work.
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-card bg-surface">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-[17px] font-semibold">Live requests</span>
            <span className="font-mono text-xs text-muted">newest settled</span>
          </div>
          <div className="grid grid-cols-[1.6fr_.8fr_.8fr_.6fr] gap-2 px-6 pb-2.5 font-mono text-[11px] tracking-[0.06em] text-muted-2">
            <span>MODEL</span>
            <span>VENDOR</span>
            <span className="text-right">TOKENS</span>
            <span className="text-right">TIME</span>
          </div>
          <div aria-live="off">
            {requests.length === 0 && (
              <div className="border-t border-paper/6 px-6 py-[11px] font-mono text-[13px] text-muted">
                {status === "error" ? "Requests unavailable" : "No requests yet"}
              </div>
            )}
            {requests.map((f, i) => (
              <div
                key={f.id}
                className="grid grid-cols-[1.6fr_.8fr_.8fr_.6fr] gap-2 border-t border-paper/6 px-6 py-[11px] font-mono text-[13px] whitespace-nowrap"
                style={{ opacity: i === 0 ? 1 : 1 - i * 0.06 }}
              >
                <span className="truncate">{f.model}</span>
                <span className="text-muted">{VENDOR_NAMES[f.vendor]}</span>
                <span className="text-right">{formatInt(f.tokens)}</span>
                <span className="text-right text-volt">{formatDuration(f.duration_ms)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TokenUsage data={data} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6 pt-6">
        <ModelShareCard data={data} />
        <PlansCard data={data} />
      </div>

      <section className="pt-6 pb-[120px]">
        <div className="overflow-hidden rounded-card bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-7 max-sm:px-5">
            <div className="flex flex-col gap-1.5">
              <span className="eyebrow">TEE TRANSPARENCY</span>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Recent attestations</h2>
            </div>
            <div className="flex flex-wrap gap-7 font-mono text-[13px] text-text-2">
              <span>{verified ? `${verified} verified · 30d` : "no receipts in 30d"}</span>
              <a href={LINKS.verifier} target="_blank" rel="noreferrer" className="text-paper">
                Open-source verifier ↗
              </a>
            </div>
          </div>
          <div className="overflow-x-auto max-md:hidden">
            <table className="w-full min-w-[900px] border-collapse font-mono text-[13px]">
              <thead>
                <tr className="border-t border-paper/8 text-left text-[11px] tracking-[0.06em] text-muted-2">
                  {["RECEIPT", "MODEL", "ENCLAVE", "UPSTREAM", "MEASUREMENT", "SIGNED"].map((h) => (
                    <th key={h} className="px-1.5 py-3 font-normal first:pl-8">
                      {h}
                    </th>
                  ))}
                  <th className="py-3 pr-8 text-right font-normal">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {attestations.map((a) => (
                  <tr key={a.receipt} className="border-t border-paper/6">
                    <td className="py-3.5 pr-1.5 pl-8">{a.receipt}…</td>
                    <td className="px-1.5">{a.model}</td>
                    <td className="px-1.5 text-text-2">{ENCLAVE}</td>
                    <td className="px-1.5 text-text-2">{a.upstream}</td>
                    <td className="px-1.5 text-muted">{shortMeasurement(measurement)}</td>
                    <td className="px-1.5 text-muted">{now === null ? "" : formatAgo(a.signed_at, now)}</td>
                    <td className="pr-8 text-right">
                      <span className="rounded-badge bg-volt px-2 py-[3px] text-xs whitespace-nowrap text-ink">
                        ✓ valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden">
            {attestations.map((a) => (
              <article
                key={a.receipt}
                className="flex flex-col gap-3 border-t border-paper/8 px-5 py-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-paper">{a.receipt}…</span>
                  <span className="rounded-badge bg-volt px-2 py-1 text-ink">✓ valid</span>
                </div>
                <p className="text-[13px]">{a.model}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  <dt className="text-muted-2">upstream</dt>
                  <dd className="text-right text-text-2">{a.upstream}</dd>
                  <dt className="text-muted-2">enclave</dt>
                  <dd className="text-right text-text-2">{ENCLAVE}</dd>
                  <dt className="text-muted-2">measurement</dt>
                  <dd className="text-right text-text-2">{shortMeasurement(measurement)}</dd>
                  <dt className="text-muted-2">signed</dt>
                  <dd className="text-right text-text-2">{now === null ? "" : formatAgo(a.signed_at, now)}</dd>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const ENCLAVE = "AMD SEV-SNP";

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 ${swatch}`} />
      {label}
    </span>
  );
}
