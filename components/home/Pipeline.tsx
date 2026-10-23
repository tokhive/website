import { ATTESTATION_SAMPLE } from "@/lib/mock/home";

const HOPS = [
  { t: "Your request", d: "api.tokhive.ai", tile: "bg-surface text-paper", num: "text-muted" },
  { t: "TokHive router", d: "picks a provider", tile: "bg-surface-2 text-paper", num: "text-muted" },
  { t: "TEE enclave", d: "Intel TDX · sealed", tile: "bg-surface-3 text-paper", num: "text-volt" },
  { t: "Official API", d: "anthropic · openai · google", tile: "bg-volt text-ink", num: "text-ink" },
];

export function Pipeline() {
  return (
    <section className="site-container -mt-10 flex flex-col gap-4 pb-[120px] max-[899px]:mt-0 max-[899px]:pb-20">
      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs font-medium tracking-[0.14em] text-muted">
        <span>HOW A REQUEST TRAVELS</span>
        <span className="tracking-normal text-text-2">every hop is sealed and signed</span>
      </div>
      <ol className="grid grid-cols-4 gap-2.5 max-[899px]:grid-cols-2 max-sm:grid-cols-1">
        {HOPS.map((h, i) => (
          <li key={h.t} className={`clip-chevron flex flex-col gap-3 px-7 pt-7 pb-8 ${h.tile}`}>
            <span className={`pl-3 font-mono text-xs font-medium ${h.num}`}>{String(i + 1).padStart(2, "0")}</span>
            <span className="pl-3 text-lg font-semibold">{h.t}</span>
            <span className="pl-3 font-mono text-[13px] opacity-75">{h.d}</span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-[repeat(4,1fr)_auto] items-center gap-6 rounded-code border border-paper/10 bg-surface px-6 py-5 font-mono text-[13px] max-[899px]:grid-cols-2">
        {ATTESTATION_SAMPLE.map((a) => (
          <div key={a.k} className="flex min-w-0 flex-col gap-1">
            <span className="text-[11px] text-muted">{a.k}</span>
            <span className="truncate">{a.v}</span>
          </div>
        ))}
        <span className="justify-self-start rounded-lg bg-volt px-3 py-2 font-medium whitespace-nowrap text-ink">
          ✓ Signature valid
        </span>
      </div>
    </section>
  );
}
