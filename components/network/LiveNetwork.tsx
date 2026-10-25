"use client";

import { useEffect, useState } from "react";
import { HexField } from "@/components/HexField";
import { useTick } from "@/lib/useTick";
import { getAttestations, getFeed, getKpis, HIVE_LEGEND, requestsPerSec } from "@/lib/mock/network";
import { formatInt } from "@/lib/format";
import { LINKS } from "@/lib/links";
import { TokenUsage } from "@/components/network/TokenUsage";
import { ModelShareCard, PlansCard } from "@/components/network/Breakdowns";

const FEED_MS = 1400;

function useUtcClock(tick: number) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time only exists on the client
    setNow(new Date().toISOString().slice(11, 19));
  }, [tick]);
  return now ?? "--:--:--";
}

export function LiveNetwork() {
  const tick = useTick(FEED_MS);
  const updated = useUtcClock(tick);
  const kpis = getKpis(tick);
  const feed = getFeed(tick);
  const attestations = getAttestations(tick);

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
        <span className="font-mono text-[13px] text-muted">updated {updated} · all times UTC</span>
      </header>

      <div className="network-kpis grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-y border-line">
        {kpis.map((k) => (
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
            <span className="text-[17px] font-semibold">Providers online</span>
            <div className="flex gap-[18px] font-mono text-xs text-text-2">
              <Legend swatch="clip-hex bg-volt" label={`serving · ${formatInt(HIVE_LEGEND.serving)}`} />
              <Legend swatch="clip-hex bg-[#3A3D3F]" label={`idle · ${formatInt(HIVE_LEGEND.idle)}`} />
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
              burst={7}
              lit="#C8F031"
              line="#2A2D2F"
              idleFill="#2A2D2F"
              onlineRatio={0.82}
              fadeMs={1600}
              holdMin={500}
              holdMax={1400}
            />
          </div>
          <div className="border-t border-paper/6 px-6 py-3.5 font-mono text-xs text-muted">
            Each cell is a provider. It lights up while serving a request.
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-card bg-surface">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-[17px] font-semibold">Live requests</span>
            <span className="font-mono text-xs text-muted">{formatInt(requestsPerSec(tick))} req/s</span>
          </div>
          <div className="grid grid-cols-[1.6fr_.8fr_.8fr_.6fr] gap-2 px-6 pb-2.5 font-mono text-[11px] tracking-[0.06em] text-muted-2">
            <span>MODEL</span>
            <span>REGION</span>
            <span className="text-right">TOKENS</span>
            <span className="text-right">MS</span>
          </div>
          <div aria-live="off">
            {feed.map((f, i) => (
              <div
                key={f.id}
                className="grid grid-cols-[1.6fr_.8fr_.8fr_.6fr] gap-2 border-t border-paper/6 px-6 py-[11px] font-mono text-[13px] whitespace-nowrap"
                style={{ opacity: i === 0 ? 1 : 1 - i * 0.06 }}
              >
                <span className="truncate">{f.model}</span>
                <span className="text-muted">{f.region}</span>
                <span className="text-right">{f.tokens}</span>
                <span className="text-right text-volt">{f.ms}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TokenUsage />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6 pt-6">
        <ModelShareCard />
        <PlansCard />
      </div>

      <section className="pt-6 pb-[120px]">
        <div className="overflow-hidden rounded-card bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-7 max-sm:px-5">
            <div className="flex flex-col gap-1.5">
              <span className="eyebrow">TEE TRANSPARENCY</span>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Recent attestations</h2>
            </div>
            <div className="flex flex-wrap gap-7 font-mono text-[13px] text-text-2">
              <span>99.998% verified · 30d</span>
              <a href={LINKS.verifier} target="_blank" rel="noreferrer" className="text-paper">
                Open-source verifier ↗
              </a>
            </div>
          </div>
          <div className="overflow-x-auto max-md:hidden">
            <table className="w-full min-w-[900px] border-collapse font-mono text-[13px]">
              <thead>
                <tr className="border-t border-paper/8 text-left text-[11px] tracking-[0.06em] text-muted-2">
                  {["REQUEST", "MODEL", "ENCLAVE", "UPSTREAM", "MEASUREMENT", "SIGNED"].map((h) => (
                    <th key={h} className="px-1.5 py-3 font-normal first:pl-8">
                      {h}
                    </th>
                  ))}
                  <th className="py-3 pr-8 text-right font-normal">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {attestations.map((a) => (
                  <tr key={a.requestId + a.signed} className="border-t border-paper/6">
                    <td className="py-3.5 pr-1.5 pl-8">
                      <a href="#" className="underline decoration-paper/30 underline-offset-[3px]">
                        {a.requestId}
                      </a>
                    </td>
                    <td className="px-1.5">{a.model}</td>
                    <td className="px-1.5 text-text-2">{a.enclave}</td>
                    <td className="px-1.5 text-text-2">{a.upstream}</td>
                    <td className="px-1.5 text-muted">{a.measurement}</td>
                    <td className="px-1.5 text-muted">{a.signed}</td>
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
                key={a.requestId + a.signed}
                className="flex flex-col gap-3 border-t border-paper/8 px-5 py-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-paper">{a.requestId}</span>
                  <span className="rounded-badge bg-volt px-2 py-1 text-ink">✓ valid</span>
                </div>
                <p className="text-[13px]">{a.model}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  <dt className="text-muted-2">upstream</dt>
                  <dd className="text-right text-text-2">{a.upstream}</dd>
                  <dt className="text-muted-2">enclave</dt>
                  <dd className="text-right text-text-2">{a.enclave}</dd>
                  <dt className="text-muted-2">measurement</dt>
                  <dd className="text-right text-text-2">{a.measurement}</dd>
                  <dt className="text-muted-2">signed</dt>
                  <dd className="text-right text-text-2">{a.signed}</dd>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 ${swatch}`} />
      {label}
    </span>
  );
}
