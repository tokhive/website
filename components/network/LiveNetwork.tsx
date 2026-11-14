"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HexField } from "@/components/HexField";
import { useTick } from "@/lib/useTick";
import { formatInt } from "@/lib/format";
import { LINKS } from "@/lib/links";
import { formatCompactEarnings } from "@/lib/public-earnings";
import {
  elapsed, formatDuration, formatTokens, shortMeasurement, VENDOR_NAMES, verifiedShare, type PublicNetwork,
} from "@/lib/public-network";
import { NetworkProvider, useNetwork } from "@/components/network/NetworkProvider";
import { TokenUsage } from "@/components/network/TokenUsage";
import { ModelShareCard, PlansCard } from "@/components/network/Breakdowns";

type Kpi = { label: string; value: string; delta: string; positive: boolean };
type Translate = ReturnType<typeof useTranslations<"Network">>;

/** Below this many providers online the hive shows sample counts instead of Hive's. */
const MIN_LIVE_PROVIDERS = 30;
const SAMPLE_HIVE = { serving: 1906, idle: 1506 };

function kpis(data: PublicNetwork | null, t: Translate): Kpi[] {
  if (!data) {
    return (["providers", "tokens", "requests", "earnings", "firstOutput"] as const).map((key) => ({
      label: t(`kpi.${key}`), value: "—", delta: "\u00a0", positive: false,
    }));
  }
  const { supply, traffic } = data;
  const previous = traffic.tokens_previous_24h;
  const change = previous > 0 ? ((traffic.tokens_24h - previous) / previous) * 100 : null;
  const p50 = traffic.first_output_p50_ms;
  return [
    {
      label: t("kpi.providers"), value: formatInt(supply.providers),
      delta: t("kpi.providersDelta", { accounts: formatInt(supply.serving + supply.idle), serving: formatInt(supply.serving) }), positive: false,
    },
    {
      label: t("kpi.tokens"), value: formatTokens(traffic.tokens_24h),
      delta: change === null ? t("kpi.noPrevious") : t("kpi.change", { change: `${change >= 0 ? "+" : ""}${change.toFixed(1)}` }), positive: (change ?? 0) > 0,
    },
    { label: t("kpi.requests"), value: formatInt(traffic.requests_24h), delta: t("kpi.peak", { count: formatInt(traffic.requests_peak_hour) }), positive: false },
    { label: t("kpi.earnings"), value: formatCompactEarnings(data.provider_earnings_usd), delta: t("kpi.earningsDelta"), positive: false },
    { label: t("kpi.firstOutput"), value: p50 === null ? "—" : formatDuration(p50), delta: t("kpi.firstOutputDelta"), positive: false },
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
  const t = useTranslations("Network");
  const ago = (at: string, asOf: number) => {
    const { unit, count } = elapsed(at, asOf);
    return t(`ago.${unit}`, { count });
  };
  const { status, data, requests, updatedAt } = useNetwork();
  // Re-renders the relative times every second.
  const tick = useTick(1000);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time only exists on the client
    setNow(Date.now());
  }, [tick, updatedAt]);
  const updated = updatedAt ? new Date(updatedAt).toISOString().slice(11, 19) : "--:--:--";
  const cards = kpis(data, t);
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
            {t("eyebrow")}
          </span>
          <h1 className="h1">{t("title")}</h1>
        </div>
        <span className="font-mono text-[13px] text-muted">
          {status === "error" ? t("unavailable") : t("updated", { time: updated })}
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
            <span className="text-[17px] font-semibold">{t("accounts.title")}</span>
            <div className="flex gap-[18px] font-mono text-xs text-text-2">
              <Legend swatch="clip-hex bg-volt" label={t("accounts.serving", { count: formatInt(serving) })} />
              <Legend swatch="clip-hex bg-[#3A3D3F]" label={t("accounts.idle", { count: formatInt(idle) })} />
              <Legend swatch="border border-[#3A3D3F]" label={t("accounts.offline")} />
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
            {t("accounts.note")}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-card bg-surface">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-[17px] font-semibold">{t("live.title")}</span>
            <span className="font-mono text-xs text-muted">{t("live.newest")}</span>
          </div>
          <div className="grid grid-cols-[1.6fr_.8fr_.8fr_.6fr] gap-2 px-6 pb-2.5 font-mono text-[11px] tracking-[0.06em] text-muted-2">
            <span>{t("live.model")}</span>
            <span>{t("live.vendor")}</span>
            <span className="text-right">{t("live.tokens")}</span>
            <span className="text-right">{t("live.time")}</span>
          </div>
          <div aria-live="off">
            {requests.length === 0 && (
              <div className="border-t border-paper/6 px-6 py-[11px] font-mono text-[13px] text-muted">
                {status === "error" ? t("live.unavailable") : t("live.empty")}
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
              <span className="eyebrow">{t("attestations.eyebrow")}</span>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{t("attestations.title")}</h2>
            </div>
            <div className="flex flex-wrap gap-7 font-mono text-[13px] text-text-2">
              <span>{verified ? t("attestations.verified", { share: verified }) : t("attestations.none")}</span>
              <a href={LINKS.verifier} target="_blank" rel="noreferrer" className="text-paper">
                {t("attestations.verifier")}
              </a>
            </div>
          </div>
          <div className="overflow-x-auto max-md:hidden">
            <table className="w-full min-w-[900px] border-collapse font-mono text-[13px]">
              <thead>
                <tr className="border-t border-paper/8 text-left text-[11px] tracking-[0.06em] text-muted-2">
                  {(["receipt", "model", "enclave", "upstream", "measurement", "signed"] as const).map((h) => (
                    <th key={h} className="px-1.5 py-3 font-normal first:pl-8">
                      {t(`attestations.columns.${h}`)}
                    </th>
                  ))}
                  <th className="py-3 pr-8 text-right font-normal">{t("attestations.columns.status")}</th>
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
                    <td className="px-1.5 text-muted">{now === null ? "" : ago(a.signed_at, now)}</td>
                    <td className="pr-8 text-right">
                      <span className="rounded-badge bg-volt px-2 py-[3px] text-xs whitespace-nowrap text-ink">
                        {t("attestations.valid")}
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
                  <span className="rounded-badge bg-volt px-2 py-1 text-ink">{t("attestations.valid")}</span>
                </div>
                <p className="text-[13px]">{a.model}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  <dt className="text-muted-2">{t("attestations.fields.upstream")}</dt>
                  <dd className="text-right text-text-2">{a.upstream}</dd>
                  <dt className="text-muted-2">{t("attestations.fields.enclave")}</dt>
                  <dd className="text-right text-text-2">{ENCLAVE}</dd>
                  <dt className="text-muted-2">{t("attestations.fields.measurement")}</dt>
                  <dd className="text-right text-text-2">{shortMeasurement(measurement)}</dd>
                  <dt className="text-muted-2">{t("attestations.fields.signed")}</dt>
                  <dd className="text-right text-text-2">{now === null ? "" : ago(a.signed_at, now)}</dd>
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
