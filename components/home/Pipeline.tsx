"use client";

import { useTranslations } from "next-intl";
import { useNetworkSnapshot } from "@/components/network/useNetworkSnapshot";
import { ATTESTATION_SAMPLE } from "@/lib/content/home";
import { shortMeasurement } from "@/lib/public-network";

const HOPS = [
  { key: "request", tile: "bg-surface text-paper", num: "text-muted" },
  { key: "router", tile: "bg-surface-2 text-paper", num: "text-muted" },
  { key: "tee", tile: "bg-surface-3 text-paper", num: "text-volt" },
  { key: "official", tile: "bg-volt text-ink", num: "text-ink" },
] as const;

export function Pipeline() {
  const t = useTranslations("Home.pipeline");
  const attestations = useNetworkSnapshot()?.attestations;
  const latest = attestations?.recent[0];
  // The newest provider receipt, or the sample until one is available.
  const receipt = latest && attestations
    ? { ...ATTESTATION_SAMPLE, upstream: latest.upstream, model: latest.model, measurement: shortMeasurement(attestations.measurement) }
    : ATTESTATION_SAMPLE;
  const fields = [
    { k: t("fields.enclave"), v: receipt.enclave },
    { k: t("fields.upstream"), v: receipt.upstream },
    { k: t("fields.model"), v: receipt.model },
    { k: t("fields.measurement"), v: receipt.measurement },
  ];
  return (
    <section className="home-pipeline site-container -mt-10 flex flex-col gap-4 pb-[120px] max-[899px]:mt-0 max-[899px]:pb-20">
      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs font-medium tracking-[0.14em] text-muted">
        <span>{t("heading")}</span>
        <span className="tracking-normal text-text-2">{t("sub")}</span>
      </div>
      <ol className="grid grid-cols-4 gap-2.5 max-[899px]:grid-cols-2 max-sm:grid-cols-1">
        {HOPS.map((h, i) => (
          <li key={h.key} className={`clip-chevron flex flex-col gap-3 px-7 pt-7 pb-8 ${h.tile}`}>
            <span className={`pl-3 font-mono text-xs font-medium ${h.num}`}>{String(i + 1).padStart(2, "0")}</span>
            <span className="pl-3 text-lg font-semibold">{t(`hops.${h.key}.title`)}</span>
            <span className="pl-3 font-mono text-[13px] opacity-75">{t(`hops.${h.key}.detail`)}</span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-[repeat(4,1fr)_auto] items-center gap-6 rounded-code border border-paper/10 bg-surface px-6 py-5 font-mono text-[13px] max-[899px]:grid-cols-2">
        {fields.map((a) => (
          <div key={a.k} className="flex min-w-0 flex-col gap-1">
            <span className="text-[11px] text-muted">{a.k}</span>
            <span className="truncate">{a.v}</span>
          </div>
        ))}
        <span className="justify-self-start rounded-lg bg-volt px-3 py-2 font-medium whitespace-nowrap text-ink">
          {t("signatureValid")}
        </span>
      </div>
    </section>
  );
}
